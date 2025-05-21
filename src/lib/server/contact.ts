import nodemailer from "nodemailer";
import { translateText, translateHtml } from "./deepl";

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
  message: string,
  lang: "en" | "da" = "en"
): Promise<void> {
  // Default English content
  const adminText = `You’ve received a new message:
Name: ${name}
Email: ${email}

${message}`;

  const adminHtml = `
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 32px 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); font-family: Arial, sans-serif; color: #333;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
      <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="36" style="display: block;" />
      <span style="font-size: 20px; font-weight: bold;">New Contact Submission</span>
    </div>
    <p style="margin-bottom: 16px;">A new customer has submitted the contact form on <strong>arzonic.com</strong>.</p>
    <a href="https://arzonic.com/admin/messages" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 500;">
      View Customer Message
    </a>
    <p style="font-size: 12px; color: #888; margin-top: 32px;">This is an automated notification from Arzonic Agency.</p>
  </div>`;

  const userText = `Hi ${name},

Thanks for reaching out! We’ll be in touch shortly.

– Arzonic Agency`;

  const userHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 32px 24px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); color: #333; text-align: start;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
      <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="40" style="display: block;" />
      <span style="font-size: 22px; padding-left: 5px; padding-top: 1px; font-weight: bold; color: #111;">Arzonic</span>
    </div>
    <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 16px;">Thanks for your message, ${name}!</h2>
    <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0; font-size: 16px; font-weight: 500;">
        We’ve received your inquiry and will get back to you shortly.
      </p>
    </div>
    <p>If you're curious already, feel free to try our project estimator and get a quick price range for your next idea:</p>
    <div style="margin: 16px 0;">
      <a href="https://arzonic.com/get-started" style="background-color: #2563eb; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
        Try our price estimator
      </a>
    </div>
    <p style="font-size: 14px; color: #555;">Have questions or want to add more details? Just reply to this email or <a href="mailto:mail@arzonic.com" style="color: #2563eb;">contact us directly</a>.</p>
    <p style="margin-top: 32px;">Best regards,<br/><strong>Arzonic Agency</strong></p>
  </div>`;

  // Default to English if no translation
  let adminTextTr = adminText;
  let adminHtmlTr = adminHtml;
  let userTextTr = userText;
  let userHtmlTr = userHtml;

  console.log("[sendContactEmail] selected lang=", lang);

  if (lang !== "en") {
    // translate plain text
    [adminTextTr, userTextTr] = await Promise.all([
      translateText(adminText, lang),
      translateText(userText, lang),
    ]);

    // translate HTML with tag handling
    [adminHtmlTr, userHtmlTr] = await Promise.all([
      translateHtml(adminHtml, lang),
      translateHtml(userHtml, lang),
    ]);

    console.log("[sendContactEmail] adminHtmlTr=", adminHtmlTr);
  }

  // Send to admin
  await transporter.sendMail({
    from: `"Website Contact" <${process.env.FROM_EMAIL!}>`,
    to: process.env.ADMIN_EMAIL!,
    subject:
      lang === "da"
        ? `Ny kontaktbesked fra ${name}`
        : `New contact form submission from ${name}`,
    text: adminTextTr,
    html: adminHtmlTr,
  });

  // Send to user
  await transporter.sendMail({
    from: `"Arzonic Agency" <${process.env.FROM_EMAIL!}>`,
    to: email,
    subject:
      lang === "da"
        ? `Vi har modtaget din besked, ${name}`
        : `We’ve received your message, ${name}!`,
    text: userTextTr,
    html: userHtmlTr,
  });
}

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

  let adminTextTr = adminText;
  let adminHtmlTr = adminHtml;
  let userTextTr = userText;
  let userHtmlTr = userHtml;

  if (lang !== "en") {
    [adminTextTr, userTextTr] = await Promise.all([
      translateText(adminText, lang),
      translateText(userText, lang),
    ]);
    [adminHtmlTr, userHtmlTr] = await Promise.all([
      translateHtml(adminHtml, lang),
      translateHtml(userHtml, lang),
    ]);
  }

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
