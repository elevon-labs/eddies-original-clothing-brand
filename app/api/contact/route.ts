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
          <div style="font-family: sans-serif;">
            <h2>New Contact Message</h2>
            <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
            <hr />
            <p style="white-space: pre-wrap;">${message}</p>
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
