import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const MAIL_FROM =
  process.env.SMTP_FROM ?? "Sanctified Studio <sanctifiedstudiojbp@gmail.com>";

/** Returns a configured transporter, or null if SMTP env vars are missing. */
export function getTransport() {
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface SendMailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: MailAttachment[];
}

/**
 * Sends an email. Throws if SMTP is not configured so callers can surface a
 * clear "email not configured" error to the admin UI.
 */
export async function sendMail({
  to,
  subject,
  html,
  text,
  attachments,
}: SendMailArgs) {
  const transport = getTransport();
  if (!transport) {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in your environment.",
    );
  }
  return transport.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    html,
    text,
    attachments,
  });
}
