import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendAdminNotificationEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/verify-turnstile";

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting (IP-based)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const isAllowed = await rateLimit(`newsletter_${ip}`, 5, 60); // 5 requests per minute

    if (!isAllowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { email, token } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 2. Turnstile Verification
    // We only verify if a token is provided (to support existing clients during migration, or enforce strictness)
    // For strict security, we should require it.
    if (token) {
      const isHuman = await verifyTurnstile(token);
      if (!isHuman) {
        return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 400 });
      }
    } else if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      // If Turnstile is enabled in env but no token sent
      return NextResponse.json({ error: "Security check required." }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existingSubscriber.length > 0) {
      return NextResponse.json({ error: "You are already subscribed!" }, { status: 409 });
    }
    
    await db.insert(newsletterSubscribers).values({
      email,
    });

    // Notify Admin
    try {
      await sendAdminNotificationEmail({
        subject: "New Newsletter Subscriber",
        text: `New subscriber: ${email}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #111; margin-bottom: 16px;">New Newsletter Subscriber 🚀</h2>
            <p style="color: #666; margin-bottom: 8px;">A new user has just subscribed to the newsletter:</p>
            <p style="font-size: 18px; font-weight: bold; color: #000; padding: 12px; background: #f9f9f9; border-radius: 4px; display: inline-block;">${email}</p>
            <p style="font-size: 12px; color: #999; margin-top: 24px;">Time: ${new Date().toLocaleString()}</p>
          </div>
        `
      });
    } catch (error) {
      console.error("Failed to send admin notification:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
