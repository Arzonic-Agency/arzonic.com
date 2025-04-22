// src/lib/server/contact.ts
import nodemailer from "nodemailer";

export async function sendContactEmail(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  // 1) Notify admin
  await transporter.sendMail({
    from: `"Website Contact" <${process.env.FROM_EMAIL!}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `New contact form submission from ${name}`,
    text: `You’ve received a new message:\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  // 2) Confirmation to user
  await transporter.sendMail({
    from: `"Arzonic Agency" <${process.env.FROM_EMAIL!}>`,
    to: email,
    subject: `We’ve received your message, ${name}!`,
    text: `Hi ${name},\n\nThanks for reaching out! We’ll be in touch shortly.\n\n– Arzonic Agency`,
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for reaching out! We’ll be in touch shortly.</p>
      <p>– Arzonic Agency</p>
    `,
  });
}
