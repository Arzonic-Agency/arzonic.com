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
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 24px; border-radius: 8px; font-family: Arial, sans-serif; color: #333333;">
  
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://arzonic.com/arzonic-logo.png" width="100" alt="Arzonic Logo" style="display: block; margin: 0 auto;">
        </div>
  
        <h2 style="text-align: center; font-size: 20px; margin: 0 0 24px;">Ny besked fra kontaktformularen</h2>
  
        <div style="text-align: center;">
          <a href="https://arzonic.com/admin/messages"
            style="display: inline-block; background-color: #048179; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Gå til beskeder
          </a>
        </div>
      </div>
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

// src/lib/server/contact.ts  (or wherever you keep sendEstimatorEmail)

export async function sendEstimatorEmail(
  name: string,
  email: string,
  estimate: string,
  details: string,      // optional breakdown or summary
  packageLabel: string  // ← new!
): Promise<void> {
  // 1) Notify admin 
  await transporter.sendMail({
    from: `"Estimator" <${process.env.FROM_EMAIL!}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `New estimate request from ${name}`,
    text: `Estimate request details:
Name: ${name}
Email: ${email}
Selected package: ${packageLabel}
Estimated Price: ${estimate}

${details}`,
    html: `
      <h2>New Estimate Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Selected package:</strong> ${packageLabel}</p>
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
    text: `Hi ${name},

Thank you for using our estimator!
Selected package: ${packageLabel}
Your estimated price is ${estimate}.

We’ll follow up shortly with more details.

– Arzonic Agency`,
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for using our estimator!</p>
      <p><strong>Package:</strong> ${packageLabel}</p>
      <p><strong>Estimated Price:</strong> ${estimate}</p>
      <p>We’ll follow up shortly with more details.</p>
      <br/>
      <p>– Arzonic Agency</p>
    `,
  });
}
