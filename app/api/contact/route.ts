import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { sendAdminNotificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(messages).values({
      name,
      email,
      subject,
      message,
    });

    // Notify Admin
    try {
      await sendAdminNotificationEmail({
        subject: `New Contact Message: ${subject || "No Subject"}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #111; margin-bottom: 20px;">New Contact Message 📬</h2>
            
            <div style="margin-bottom: 20px;">
              <p style="color: #666; font-size: 14px; margin-bottom: 4px;">From:</p>
              <p style="font-weight: bold; margin: 0;">${name} (<a href="mailto:${email}" style="color: #000;">${email}</a>)</p>
            </div>

            <div style="margin-bottom: 24px;">
              <p style="color: #666; font-size: 14px; margin-bottom: 4px;">Subject:</p>
              <p style="font-weight: bold; margin: 0;">${subject || "No Subject"}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p style="color: #666; font-size: 14px; margin-bottom: 8px;">Message:</p>
            <div style="background: #f9f9f9; padding: 16px; border-radius: 4px;">
              <p style="white-space: pre-wrap; margin: 0; line-height: 1.6; color: #333;">${message}</p>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 24px;">Time: ${new Date().toLocaleString()}</p>
          </div>
        `
      });
    } catch (error) {
      console.error("Failed to send admin notification:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
