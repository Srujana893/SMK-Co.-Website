const express = require("express");
const { pool } = require("../db");
const { resolveRecipients, SERVICE_CATEGORY_MAP } = require("../routing");
const { sendEnquiryEmail } = require("../mailer");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_LABELS = {
  "is-cybersecurity-audit": "IS & Cybersecurity Audit",
  "ai-automation-technology": "AI Automation & Technology",
  "forensic-accounting": "Forensic Accounting",
  "audit-assurance": "Audit & Assurance",
  "taxation": "Taxation",
  "accounting-reporting": "Accounting & Reporting",
  "corporate-regulatory-compliance": "Corporate & Regulatory Compliance",
  "business-advisory": "Business Advisory",
  "internal-controls": "Internal Controls",
  "specialised-sector": "Specialised / Sector-Specific",
  "something-else": "Something else",
  "other": "Other — unspecified",
};

/* The <select> submits option TEXT, not a slug, because its options carry no
   value attribute. Accept both spellings and normalise to the slug, so the
   routing table in routing.js finally matches. Anything else becomes "other"
   and can never reach a mail header. */
const LABEL_TO_SLUG = Object.fromEntries(
  Object.entries(SERVICE_LABELS).map(([slug, label]) => [label.toLowerCase(), slug])
);

function normaliseService(raw) {
  const v = typeof raw === "string" ? raw.trim() : "";
  if (!v) return "";
  if (Object.prototype.hasOwnProperty.call(SERVICE_LABELS, v)) return v;
  const bySlug = LABEL_TO_SLUG[v.toLowerCase()];
  return bySlug || "other";
}

/* Strip CR and LF before a value can reach a mail header. */
const oneLine = (s) => String(s).replace(/[\r\n]+/g, " ").trim();

const LIMITS = { name: 120, email: 254, phone: 32, message: 5000 };

/* Record the outcome of the send. Never throws — the caller is detached from
   the request, so an unhandled rejection here would take the process down. */
async function recordEmailOutcome(id, sent, error) {
  try {
    await pool.query(
      `UPDATE enquiries SET email_sent = $1, email_error = $2 WHERE id = $3`,
      [sent, error ? String(error).slice(0, 500) : null, id]
    );
  } catch (err) {
    console.error(`[enquiry] could not record email outcome for id=${id}`, err);
  }
}

router.post("/enquiry", async (req, res) => {
  // A browser always sends Origin on POST. Its absence means a non-browser
  // client. CORS cannot enforce this; the route can.
  if (!req.get("origin")) {
    return res.status(403).json({ ok: false, error: "Forbidden." });
  }

  const body = req.body || {};

  // Honeypot — pretend success, do not touch the DB.
  if (typeof body.company === "string" && body.company.trim().length > 0) {
    return res.status(200).json({ ok: true, id: null });
  }

  const name = oneLine(typeof body.name === "string" ? body.name : "");
  const email = oneLine(typeof body.email === "string" ? body.email : "");
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const service_interest = normaliseService(body.service_interest);
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) return res.status(400).json({ ok: false, error: "Name is required." });
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "A valid email is required." });
  if (!phone) return res.status(400).json({ ok: false, error: "Phone is required." });
  if (!message) return res.status(400).json({ ok: false, error: "A message is required." });

  for (const [field, max] of Object.entries(LIMITS)) {
    const value = { name, email, phone, message }[field];
    if (value.length > max) {
      return res.status(400).json({ ok: false, error: `${field} must be ${max} characters or fewer.` });
    }
  }

  const { category, recipients } = resolveRecipients(service_interest);
  const assigned_to = recipients.join(", ");

  let row;
  try {
    const result = await pool.query(
      `INSERT INTO enquiries (name, phone, email, service_interest, category, assigned_to, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [name, phone || null, email, service_interest || null, category, assigned_to || null, message || null]
    );
    row = result.rows[0];
  } catch (dbErr) {
    console.error("[enquiry] DB insert failed", dbErr);
    return res.status(500).json({ ok: false, error: "Could not save enquiry. Please try again." });
  }

  // The row is committed. The visitor is done — answer now and send after.
  res.status(201).json({ ok: true, id: row.id });

  // Detached from the request. Every path is caught; nothing can reject
  // unhandled, and nothing here can reach the visitor.
  sendEnquiryEmail({
    to: recipients,
    enquiry: {
      id: row.id,
      created_at: row.created_at,
      name,
      email,
      phone,
      service_interest,
      service_interest_label: SERVICE_LABELS[service_interest],
      category,
      message,
    },
  })
    .then(() => recordEmailOutcome(row.id, true, null))
    .catch((mailErr) => {
      console.error(`[enquiry] email failed for id=${row.id}`, mailErr);
      return recordEmailOutcome(row.id, false, mailErr && mailErr.message ? mailErr.message : mailErr);
    })
    .catch((err) => console.error(`[enquiry] post-response handler failed for id=${row.id}`, err));
});

module.exports = router;
