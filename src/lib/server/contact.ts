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
    from: `"Arzonic Agency" <${process.env.FROM_EMAIL!}>`,
    to: email,
    subject: `We’ve received your message, ${name}!`,
    text: `Hi ${name},\n\nThanks for reaching out! We’ll be in touch shortly.\n\n– Arzonic Agency`,
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 32px 24px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); color: #333333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="100" style="display: block; margin: 0 auto;" />
    </div>
    <p>Hi ${name},</p>
    <p>Thanks for reaching out to us – we appreciate your interest!</p>
    <p>Our team will review your message and get back to you shortly.</p>
    <p>If you have any further questions or details you'd like to add, feel free to reply directly to this email or <a href="mailto:mail@arzonic.com">contact us</a>.</p>
    <p>Best regards,<br/><strong>The Arzonic Team</strong></p>
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
     <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="100" style="display: block; margin: 0 auto;" />
  </div>
      <p>Hi ${name},</p>
      <p>Thanks for reaching out! We’ll be in touch shortly.</p>
      <p>– Arzonic Agency</p>
    `,
  });
}

import { translate } from "./deepl";

/**
 * Sends estimate emails to admin and user, translating content via DeepL if needed.
 * @param name - recipient name
 * @param email - user email address
 * @param estimate - formatted estimate string
 * @param details - breakdown or summary details
 * @param packageLabel - human-readable package name
 * @param lang - target language code (e.g. 'en' or 'da')
 */
export async function sendEstimatorEmail(
  name: string,
  email: string,
  estimate: string,
  details: string,
  packageLabel: string,
  lang: "en" | "da" = "en"
): Promise<void> {
  // 1) Build English templates
  const adminText = `Estimate request details:
Name: ${name}
Email: ${email}
Selected package: ${packageLabel}
Estimated Price: ${estimate}

${details}`;
  const adminHtml = `<h2>New Estimate Request</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Selected package:</strong> ${packageLabel}</p>
<p><strong>Estimated Price:</strong> ${estimate}</p>
<hr/>
<p>${details.replace(/\n/g, "<br/>")}</p>`;

  const userText = `Hi ${name},

Thanks for using our project estimator – we're excited to learn more about your vision!

Selected package: ${packageLabel}
Estimated price: ${estimate}

This is a non-binding, preliminary estimate based on the details you provided.
We’ll be in touch shortly to discuss your project further.

If you have any questions, ideas, or just want to chat, reply directly to this email.

Best,
The Arzonic Team`;
  const userHtml = `<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 32px 24px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); color: #333333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="100" style="display: block; margin: 0 auto;" />
  </div>
  <p>Hi ${name},</p>
  <p>Thanks for using our project estimator – we’re excited to learn more about your vision!</p>
  <p><strong>Selected package:</strong> ${packageLabel}<br/>
     <strong>Estimated price:</strong> ${estimate}</p>
  <p style="font-size:12px; background:#f9f9f9; padding:8px; border-radius:4px;">Please note this is a <strong>non-binding estimate</strong> based on your details.</p>
  <p>We’ll be in touch shortly to explore your project in more detail.</p>
  <p>In the meantime, feel free to reply or <a href="mailto:mail@arzonic.com">contact us</a>.</p>
  <p>Best regards,<br/><strong>The Arzonic Team</strong></p>
</div>`;

  // 2) Translate if not English
  const [adminTextTr, adminHtmlTr, userTextTr, userHtmlTr] = await Promise.all([
    translate(adminText, lang),
    translate(adminHtml, lang),
    translate(userText, lang),
    translate(userHtml, lang),
  ]);

  // 3) Admin notification (subject localized)
  await transporter.sendMail({
    from: `"New Client Request - Price Estimator" <${process.env.FROM_EMAIL!}>`,
    to: process.env.ADMIN_EMAIL!,
    subject:
      lang === "da"
        ? `Ny tilbudsanmodning fra ${name}`
        : `New estimate request from ${name}`,
    text: adminTextTr,
    html: adminHtmlTr,
  });

  // 4) User email (subject localized)
  await transporter.sendMail({
    from: `"Arzonic Agency" <${process.env.FROM_EMAIL!}>`,
    to: email,
    subject:
      lang === "da"
        ? `Dit forslag er klar, ${name}!`
        : `Your project estimate is ready, ${name}`,
    text: userTextTr,
    html: userHtmlTr,
  });
}
