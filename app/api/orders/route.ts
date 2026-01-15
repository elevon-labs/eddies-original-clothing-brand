import { db } from "@/db"
import { OrderPayload } from "@/types"
import { NextResponse } from "next/server"
import { calculateShipping } from "@/lib/utils"
import { orders, orderItems } from "@/db/schema"
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/mail"
import { checkBotId } from "botid/server"

export async function POST(req: Request) {
  try {
    // BotID Check
    const verification = await checkBotId()
    if (verification.isBot) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const payload: OrderPayload = await req.json()
    const { reference, cartItems, shippingAddress, email, userId, totalAmount, shippingCost } = payload

    if (!reference || !cartItems || cartItems.length === 0 || !shippingAddress || !email || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const expectedShipping = calculateShipping(subtotal)
    
    // 1. Verify with Paystack
    const verifyReq = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const verifyData = await verifyReq.json()

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }
    
    // Ensure amount matches (Paystack returns in Kobo)
    if (verifyData.data.amount !== totalAmount) { 
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
    }

    // 2. Create Order & Items
    // Using transaction to ensure integrity
    const result = await db.transaction(async (tx) => {
        const [newOrder] = await tx.insert(orders).values({
            userId: userId || null,
            status: 'paid',
            total: totalAmount,
            shippingCost: shippingCost || expectedShipping * 100, // Save as Kobo
            paystackReference: reference,
            shippingAddress: shippingAddress,
            guestEmail: email,
            guestName: `${shippingAddress.firstName} ${shippingAddress.lastName}`
        }).returning()

        const itemsToInsert = cartItems.map((item) => ({
            orderId: newOrder.id,
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.size,
            selectedColor: item.color
        }))

        await tx.insert(orderItems).values(itemsToInsert)
        
        return newOrder
    })

    // 3. Send Emails (Async, don't block response)
    // We await them here for simplicity to ensure they are sent, or use Promise.allSettled
    await Promise.allSettled([
        sendOrderConfirmationEmail({ to: email, orderId: result.id, items: cartItems, total: totalAmount }),
        sendAdminNewOrderEmail({ orderId: result.id, total: totalAmount })
    ])

    return NextResponse.json({ success: true, orderId: result.id })

  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
