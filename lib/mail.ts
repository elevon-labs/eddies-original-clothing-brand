import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/account/verify?token=${token}`

  await resend.emails.send({
    from: "Eddie Originals <onboarding@resend.dev>", // TODO: Update with your verified domain
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`
  })
}
