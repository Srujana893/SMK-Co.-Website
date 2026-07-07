const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[mailer] SMTP env vars missing — email sending will fail.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  return transporter;
}

async function sendEnquiryEmail({ to, enquiry }) {
  if (!to || to.length === 0) {
    throw new Error("No recipients resolved for this enquiry.");
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const svc = enquiry.service_interest_label || enquiry.service_interest || "(no service selected)";
  const subject = `[SMK enquiry — ${svc}] ${enquiry.name}`;

  const lines = [
    `New enquiry received via smkindia.com`,
    ``,
    `Name:    ${enquiry.name}`,
    `Email:   ${enquiry.email}`,
    `Phone:   ${enquiry.phone || "(not provided)"}`,
    `Service: ${svc}`,
    `Routed:  ${enquiry.category}`,
    ``,
    `Message:`,
    enquiry.message || "(no message)",
    ``,
    `— Enquiry #${enquiry.id} · ${enquiry.created_at}`,
  ];

  const info = await getTransporter().sendMail({
    from,
    to: to.join(", "),
    replyTo: enquiry.email,
    subject,
    text: lines.join("\n"),
  });

  return info;
}

module.exports = { sendEnquiryEmail };
