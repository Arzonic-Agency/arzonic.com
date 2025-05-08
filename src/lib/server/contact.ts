// src/lib/server/contact.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});


export async function sendContactEmail(
  name: string,
  email: string,
  message: string
): Promise<void> {
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

export async function sendEstimatorEmail(
  name: string,
  email: string,
  estimate: string,    
  details: string      // optional breakdown or summary
): Promise<void> {
  // 1) Notify admin 
  await transporter.sendMail({
    from: `"Estimator" <${process.env.FROM_EMAIL!}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `New estimate request from ${name}`,
    text: `Estimate request details:\n\nName: ${name}\nEmail: ${email}\nEstimated Price: ${estimate}\n\n${details}`,
    html: `
      <h2>New Estimate Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Estimated Price:</strong> ${estimate}</p>
      <hr/>
      <p>${details.replace(/\n/g, "<br/>")}</p>
    `,
  });

  // 2) Send the user their custom estimate
  await transporter.sendMail({
    from: `"Arzonic Agency" <${process.env.FROM_EMAIL!}>`,
    to: email,
    subject: `Your custom estimate is here, ${name}!`,
    text: `Hi ${name},\n\nThank you for using our estimator! Your estimated price is ${estimate}.\n\nWe’ll follow up shortly with more details.\n\n– Arzonic Agency`,
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for using our estimator! Your estimated price is <strong>${estimate}</strong>.</p>
      <p>We’ll follow up shortly with more details.</p>
      <br/>
      <p>– Arzonic Agency</p>
    `,
  });
}
