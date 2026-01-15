import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  return "http://localhost:3000"
}

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${getBaseUrl()}/account/verify?token=${token}`

  await resend.emails.send({
    from: "Eddie Originals <hello@eddieoriginals-department.com>",
    to: email,
    subject: "Confirm your email",
    text: `Hi,

Thanks for signing up for Eddie Originals.

Please confirm your email address by visiting the link below:
${confirmLink}

This link will expire shortly for security reasons.

If you didn't create an account with Eddie Originals, you can safely ignore this email.

—
Eddie Originals Team`,
    html: `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 15px;
              color: #111;
              line-height: 1.6;
              max-width: 520px;
              margin: 0 auto;">
    
    <p>Hi,</p>

    <p>
      Thanks for signing up for <strong>Eddie Originals</strong>.
    </p>

    <p>
      Please confirm your email address by clicking the link below:
    </p>

    <p>
      <a href="${confirmLink}" style="color: #111; text-decoration: underline;">
        ${confirmLink}
      </a>
    </p>

    <p>
      This link will expire shortly for security reasons.
    </p>

    <p>
      If you didn't create an account with Eddie Originals, you can safely ignore this email.
    </p>

    <p style="margin-top: 32px;">
      —<br />
      Eddie Originals Team
    </p>

    <p style="font-size: 12px; color: #666; margin-top: 24px;">
      This is an automated message. Please do not reply.
    </p>
  </div>
`
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${getBaseUrl()}/account/new-password?token=${token}`

  await resend.emails.send({
    from: "Eddie Originals <hello@eddieoriginals-department.com>",
    to: email,
    subject: "Reset your password",
    text: `Hi,

We received a request to reset your password for your Eddie Originals account.

Please click the link below to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

—
Eddie Originals Team`,
    html: `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 15px;
              color: #111;
              line-height: 1.6;
              max-width: 520px;
              margin: 0 auto;">
    
    <p>Hi,</p>

    <p>
      We received a request to reset your password for your <strong>Eddie Originals</strong> account.
    </p>

    <p>
      Please click the link below to reset your password:
    </p>

    <p>
      <a href="${resetLink}" style="color: #111; text-decoration: underline;">
        ${resetLink}
      </a>
    </p>

    <p>
      This link will expire in 1 hour.
    </p>

    <p>
      If you didn't request a password reset, you can safely ignore this email.
    </p>

    <p style="margin-top: 32px;">
      —<br />
      Eddie Originals Team
    </p>

    <p style="font-size: 12px; color: #666; margin-top: 24px;">
      This is an automated message. Please do not reply.
    </p>
  </div>
`,
  })
}

export const sendOrderConfirmationEmail = async ({
  to,
  orderId,
  items,
  total,
}: {
  to: string
  orderId: string
  items: { name: string; quantity: number; price: number }[]
  total: number
}) => {
  const orderLink = `${getBaseUrl()}/account/orders/${orderId}`
  const formattedTotal = (total / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  })

  const itemsSummaryText = items
    .map((item) => `- ${item.name} x${item.quantity}`)
    .join("\n")

  const itemsSummaryHtml = items
    .map(
      (item) =>
        `<li><strong>${item.name}</strong> &times; ${item.quantity}</li>`,
    )
    .join("")

  await resend.emails.send({
    from: "Eddie Originals <hello@eddieoriginals-department.com>",
    to,
    subject: `Order Confirmation #${orderId.slice(0, 8).toUpperCase()}`,
    text: `Hi,

Thank you for your order!

Order ID: ${orderId}
Total: ${formattedTotal}

Items:
${itemsSummaryText}

We will notify you when your order ships.

View Order: ${orderLink}

—
Eddie Originals Team`,
    html: `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 15px;
              color: #111;
              line-height: 1.6;
              max-width: 520px;
              margin: 0 auto;">
    
    <p>Hi,</p>

    <p>
      Thank you for your order! We're getting it ready.
    </p>
    
    <div style="background: #f9f9f9; padding: 24px; border-radius: 12px; margin: 24px 0;">
      <p style="margin: 0; font-weight: 600;">Order ID: ${orderId.slice(0, 8).toUpperCase()}</p>
      <p style="margin: 4px 0 0; color: #666;">Total: ${formattedTotal}</p>
    </div>

    <p style="margin: 16px 0 4px; font-weight: 600;">Items:</p>
    <ul style="margin: 0 0 16px 20px; padding: 0; color: #333;">
      ${itemsSummaryHtml}
    </ul>
    
    <p>
      We will notify you when your order ships.
    </p>

    <p>
      <a href="${orderLink}" style="color: #111; text-decoration: underline;">
        View Order Status
      </a>
    </p>

    <p style="margin-top: 32px;">
      —<br />
      Eddie Originals Team
    </p>
  </div>
`
  })
}

export const sendAdminNewOrderEmail = async ({
  orderId,
  total,
}: {
  orderId: string
  total: number
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || "hello@eddieoriginals-department.com"
  const formattedTotal = (total / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  })

  await resend.emails.send({
    from: "Eddie Originals <hello@eddieoriginals-department.com>",
    to: adminEmail,
    subject: `[New Order] #${orderId.slice(0, 8).toUpperCase()} - ${formattedTotal}`,
    text: `New order received!

Order ID: ${orderId}
Total: ${formattedTotal}

Check admin dashboard for details.`,
  })
}

export const sendAdminNotificationEmail = async ({
  subject,
  text,
  html,
}: {
  subject: string
  text: string
  html?: string
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || "hello@eddieoriginals-department.com"

  await resend.emails.send({
    from: "Eddie Originals <hello@eddieoriginals-department.com>",
    to: adminEmail,
    subject: `[Admin Alert] ${subject}`,
    text,
    html: html || `<p>${text.replace(/\n/g, "<br>")}</p>`,
  })
}
