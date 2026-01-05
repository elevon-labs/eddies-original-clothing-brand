import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { Parser } from "json2csv";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await db.select().from(newsletterSubscribers);

    const fields = ["id", "email", "subscribedAt"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(subscribers);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting newsletter subscribers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
