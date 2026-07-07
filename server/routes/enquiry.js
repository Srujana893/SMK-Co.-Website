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
};

router.post("/enquiry", async (req, res) => {
  const body = req.body || {};

  // Honeypot — pretend success, do not touch the DB.
  if (typeof body.company === "string" && body.company.trim().length > 0) {
    return res.status(200).json({ ok: true, id: null });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const service_interest = typeof body.service_interest === "string" ? body.service_interest.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) return res.status(400).json({ ok: false, error: "Name is required." });
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "A valid email is required." });

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

  // Best-effort email — never fail the request if this errors.
  try {
    await sendEnquiryEmail({
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
    });
  } catch (mailErr) {
    console.error(`[enquiry] email failed for id=${row.id}`, mailErr);
  }

  return res.status(201).json({ ok: true, id: row.id });
});

module.exports = router;
