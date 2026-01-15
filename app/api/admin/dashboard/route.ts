import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products, newsletterSubscribers, messages } from "@/db/schema";
import { count, eq, lt, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch Counts
    const [productsCount] = await db.select({ value: count() }).from(products);
    const [activeProductsCount] = await db.select({ value: count() }).from(products).where(eq(products.isActive, true));
    const [lowStockCount] = await db.select({ value: count() }).from(products).where(lt(products.stockCount, 5));
    const [subscribersCount] = await db.select({ value: count() }).from(newsletterSubscribers);
    const [unreadMessagesCount] = await db.select({ value: count() }).from(messages).where(eq(messages.isRead, false));

    // 2. Fetch Recent Activity
    // We'll fetch the last 5 items from each category and sort them in code to get the true mixed timeline
    
    const recentProducts = await db
      .select({
        name: products.name,
        createdAt: products.createdAt,
      })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(5);

    const recentSubscribers = await db
      .select({
        email: newsletterSubscribers.email,
        subscribedAt: newsletterSubscribers.subscribedAt,
      })
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.subscribedAt))
      .limit(5);

    const recentMessages = await db
      .select({
        subject: messages.subject,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .orderBy(desc(messages.createdAt))
      .limit(5);
    
    // Normalize and combine
    const activities = [
      ...recentProducts.map(p => ({
        type: 'product',
        action: 'Product added',
        item: p.name,
        date: p.createdAt
      })),
      ...recentSubscribers.map(s => ({
        type: 'newsletter',
        action: 'New subscriber',
        item: s.email,
        date: s.subscribedAt
      })),
      ...recentMessages.map(m => ({
        type: 'inbox',
        action: 'Message received',
        item: m.subject || "No Subject",
        date: m.createdAt
      }))
    ].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    }).slice(0, 5); // Take top 5 most recent

    return NextResponse.json({
      metrics: {
        totalProducts: productsCount.value,
        activeProducts: activeProductsCount.value,
        lowStockProducts: lowStockCount.value,
        totalSubscribers: subscribersCount.value,
        unreadMessages: unreadMessagesCount.value
      },
      recentActivity: activities
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
