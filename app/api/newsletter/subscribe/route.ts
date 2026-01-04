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
        html: `<p>New subscriber: <strong>${email}</strong></p>`
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
