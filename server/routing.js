/**
 * SINGLE SOURCE OF TRUTH for service -> category routing.
 *
 * Keys are the slug values submitted by the <select name="service"> in contact.html.
 * To reassign a service to a different specialist, change its value here.
 *
 * Categories:
 *   'cyber'   -> TECH_EMAIL    (Person A: cybersecurity / tech / forensics)
 *   'finance' -> FINANCE_EMAIL (Person B: audit / tax / compliance / advisory)
 *   'both'    -> both recipients (fallback for unknown / blank / "something else")
 */
const SERVICE_CATEGORY_MAP = {
  "is-cybersecurity-audit": "cyber",
  "ai-automation-technology": "cyber",
  "forensic-accounting": "cyber",

  "audit-assurance": "finance",
  "taxation": "finance",
  "accounting-reporting": "finance",
  "corporate-regulatory-compliance": "finance",
  "business-advisory": "finance",
  "internal-controls": "finance",
  "specialised-sector": "finance",

  "something-else": "both",
};

function resolveRecipients(serviceSlug) {
  const key = (serviceSlug || "").trim();
  const category = SERVICE_CATEGORY_MAP[key] || "both";

  const tech = (process.env.TECH_EMAIL || "").trim();
  const finance = (process.env.FINANCE_EMAIL || "").trim();

  let recipients;
  if (category === "cyber") recipients = [tech];
  else if (category === "finance") recipients = [finance];
  else recipients = [tech, finance];

  recipients = recipients.filter(Boolean);
  return { category, recipients };
}

module.exports = { SERVICE_CATEGORY_MAP, resolveRecipients };
