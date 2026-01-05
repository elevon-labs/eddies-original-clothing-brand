import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendAdminNotificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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
