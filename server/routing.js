/**
 * SINGLE SOURCE OF TRUTH for service -> category routing.
 *
 * Keys are the slug values submitted by the <select name="service"> in contact.html.
 * To reassign a service to a different specialist, change its value here.
 *
 * Categories:
 *   'cyber'   -> TECH_EMAIL    (cybersecurity / tech / forensics)
 *   'finance' -> FINANCE_EMAIL (audit / tax / compliance / advisory / everything else)
 *
 * Fallback: unknown, blank, unmapped, or "something else" resolve to 'finance'.
 * FINANCE_EMAIL is the safe default so no enquiry silently reaches nobody.
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

  "something-else": "finance",
};

function resolveRecipients(serviceSlug) {
  const key = (serviceSlug || "").trim();
  const category = SERVICE_CATEGORY_MAP[key] || "finance";

  const tech = (process.env.TECH_EMAIL || "").trim();
  const finance = (process.env.FINANCE_EMAIL || "").trim();

  const recipients = (category === "cyber" ? [tech] : [finance]).filter(Boolean);
  return { category, recipients };
}

module.exports = { SERVICE_CATEGORY_MAP, resolveRecipients };
