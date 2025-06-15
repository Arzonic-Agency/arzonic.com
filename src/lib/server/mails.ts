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
  const adminText = `You’ve received a new message:
Name: ${name}
Email: ${email}

${message}`;

  const adminHtml = `
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 32px 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); font-family: Arial, sans-serif; color: #333;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
      <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="40" style="display: block;" />
      <span style="font-size: 22px; padding-left: 5px; padding-top: 1px; font-weight: bold; color: #111;">Arzonic</span>
    </div>
    <p style="margin-bottom: 16px;">A new customer has submitted the contact form on <strong>arzonic.com</strong>.</p>
    <a href="https://arzonic.com/admin/messages" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 500;">
      View Customer Message
    </a>
    <p style="font-size: 12px; color: #888; margin-top: 32px;">This is an automated notification from Arzonic Agency.</p>
  </div>`;

  const userText = `Hi ${name},

Thanks for reaching out! We’ll be in touch shortly.

– Arzonic`;

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

  let adminTextTr = adminText;
  let adminHtmlTr = adminHtml;
  let userTextTr = userText;
  let userHtmlTr = userHtml;

  console.log("[sendContactEmail] selected lang=", lang);

  if (lang !== "en") {
    [adminTextTr, userTextTr] = await Promise.all([
      translateText(adminText, lang),
      translateText(userText, lang),
    ]);

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
    from: `"Arzonic" <${process.env.FROM_EMAIL!}>`,
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
    <p>Hi ${name},</p>
    <p>Thanks for using our project estimator – we’re excited to learn more about your vision!</p>
    <p><strong>Selected package:</strong> ${packageLabel}<br/>
      <strong>Estimated price:</strong> ${estimate}</p>
    <p style="font-size:12px; background:#f9f9f9; padding:8px; border-radius:4px;">Please note this is a <strong>non-binding estimate</strong> based on your input.</p>
    <p>We’ll carefully review your submission and get back to you — no matter what.</p>
    <p>If you have any additional information or questions, feel free to reply directly or <a href="mailto:mail@arzonic.com" style="color: #2563eb;">contact us</a>.</p>
    <p>Best regards,<br/><strong>The Arzonic Team</strong></p>
        <div style="text-align: start; margin-bottom: 24px;">
      <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="80" style="display: block;" />
    </div>
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
    from: `"Arzonic" <${process.env.FROM_EMAIL!}>`,
    to: email,
    subject:
      lang === "da"
        ? `Dit forslag er klar, ${name}!`
        : `Your project estimate is ready, ${name}`,
    text: userTextTr,
    html: userHtmlTr,
  });
}

/**
 * Sends job application confirmation emails to admin and applicant.
 * @param name - applicant's name
 * @param mail - applicant's email address
 * @param title - title of the job applied for
 * @param lang - target language code (e.g., 'en' or 'da')
 */
export async function sendJobApplicationConfirmEmail(
  name: string,
  mail: string,
  title: string,
  lang: "en" | "da" = "en"
): Promise<void> {
  const adminText = `New job application received:
  Name: ${name}
  Email: ${mail}
  Job Title: ${title}
  `;

  const adminHtml = `
  <h2>New Job Application</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Mail:</strong> ${mail}</p>
  <p><strong>Job Post:</strong> ${title}</p>
  `;

  const userText = `Hi ${name},

  Thank you for applying for the ${title} position at Arzonic. We’ve received your application and will review it shortly.

  Best regards,
  The Arzonic Team`;

  const userHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 32px 24px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); color: #333; text-align: start;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
      <img src="https://arzonic.com/icon-512x512.png" alt="Arzonic Logo" width="40" style="display: block;" />
      <span style="font-size: 22px; padding-left: 5px; padding-top: 1px; font-weight: bold; color: #111;">Arzonic</span>
    </div>
    <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 16px;">Thanks for applying, ${name}!</h2>
    <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0; font-size: 16px;">
        We’ve received your application for the <strong>${title}</strong> position. We’ll get back to you — no matter what.
      </p>
    </div>
    <p style="font-size: 14px; color: #555;">Have questions or want to update your application? Just reply to this email or contact us at <a href="mailto:mail@arzonic.com" style="color: #2563eb;">mail@arzonic.com</a>.</p>
    <p style="margin-top: 32px;">Best regards,<br/><strong>The Arzonic Team</strong></p>
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

  // Send to admin
  await transporter.sendMail({
    from: `"Job Application" <${process.env.FROM_EMAIL!}>`,
    to: process.env.ADMIN_EMAIL!,
    subject:
      lang === "da"
        ? `Ny jobansøgning fra ${name}`
        : `New job application from ${name}`,
    text: adminTextTr,
    html: adminHtmlTr,
  });

  // Send to applicant
  await transporter.sendMail({
    from: `"Arzonic" <${process.env.FROM_EMAIL!}>`,
    to: mail,
    subject:
      lang === "da"
        ? `Tak for din ansøgning, ${name}`
        : `Thank you for your application, ${name}`,
    text: userTextTr,
    html: userHtmlTr,
  });
}
