/* ============================================================
   BACKEND API BASE URL
   Fill in the Railway service URL (no trailing slash), e.g.
   "https://smk-api-production.up.railway.app"
   ============================================================ */
window.API_BASE = "https://smk-enquiry-api-production.up.railway.app";

/* ============================================================
   EDIT YOUR CONTACT DETAILS HERE
   Everything you'll routinely change lives in this one object.
   Replace the [BRACKETED] placeholders before publishing.
   ============================================================ */
window.siteConfig = {
  /* Firm-name table. Trading name is used everywhere the firm is named:
     <title>, OG/Twitter titles, nav, logo alt text. Legal name is used only
     in the footer copyright and on the About page. */
  legalName: "[Placeholder — confirm exact ICAI record]",
  tradingName: "SMK & Co.",
  shortName: "SMK & Co.",
  tagline: "Where Traditional Expertise Meets Modern Technology",

  email: "contactsachinandco@gmail.com",            // e.g. connect@smkco.in
  phone: "99026 02692",            // e.g. +91 80 1234 5678
  domain: "[DOMAIN]",               // e.g. smkco.in
  year: "2026",                   // e.g. 2026  (used in © line)

  social: {
    /* Paste the full public URLs here. Any entry left as "#" is hidden
       in the footer rather than rendered as a dead link. */
    linkedin: "#",
    facebook: "#",
    instagram: "#",
  },

  registeredOffice: {
    label: "Registered Office",
    city: "Bengaluru",
    lines: [
      "63/B, 3rd Floor, Chirag Plaza,",
      "10th Main, 4th Block, Rajaji Nagar,",
      "Bengaluru, Karnataka — 560 010"
    ],
    /* Awaiting verified Google Maps embed for 63/B, 3rd Floor, Chirag Plaza,
       10th Main, 4th Block, Rajaji Nagar, Bengaluru, Karnataka — 560 010.
       Paste the iframe's src URL only (https://www.google.com/maps/embed?pb=…).
       The map container on /contact renders only while this is non-empty. */
    map: ""
  },
  branchOffice: {
    label: "Branch Office",
    city: "Shivamogga",
    lines: [
      "Sri Manjunatha Complex, 1st Floor,",
      "Opp. Cauvery Ford Motors, Shankaramutt Road,",
      "Shivamogga, Karnataka — 577 201"
    ],
    /* Awaiting verified Google Maps embed for Sri Manjunatha Complex, 1st Floor,
       Opp. Cauvery Ford Motors, Shankaramutt Road, Shivamogga, Karnataka — 577 201.
       Paste the iframe's src URL only. Renders only while non-empty. */
    map: ""
  }
};

/* ============================================================
   TESTIMONIALS — homepage, before the closing CTA.
   Enable only with client-approved testimonials, after confirming ICAI
   advertising/website guidelines permit them.
   Empty by default: with no entries the section is not rendered at all,
   heading included. Each entry:
     { quote: "…", name: "Client or company", role: "Role or industry" }
   `role` is optional. No star ratings, no photos, no results.
   ============================================================ */
window.testimonials = [];

/* ============================================================
   NETWORK / TIE-UPS RAIL — homepage, after Industries and before Insights.
   Confirm the relationship wording with each organisation, and confirm ICAI
   guidelines permit displaying it.
   Empty by default: with no items the rail is not rendered at all. Supply
   real, approved logo files (monochrome or ink-tinted, consistent height)
   under assets/ — nothing here is invented or recreated. Each item:
     { name: "Organisation", logo: "assets/….svg", descriptor: "", url: "" }
   `descriptor` and `url` are optional. The heading must match the actual
   relationship: "Working with" or "Our network", not "Partners", unless a
   formal partnership is confirmed. assets/ca-india-mark.png is not a
   network logo and must not be listed here.
   ============================================================ */
window.network = {
  heading: "Working with",
  items: []
};

/* ============================================================
   BLOG POSTS — add / edit articles in one place.
   image: null renders the striped placeholder graphic.
   ============================================================ */
window.blogPosts = [
  {
    id: "itgc-rbi",
    featured: true,
    category: "Technology",
    title: "Understanding ITGC reviews under RBI guidelines",
    excerpt: "General IT controls sit at the centre of every modern audit. A practical look at scoping access, change and operations controls for regulated entities.",
    date: "Jun 2, 2026",
    read: "7 min read",
    author: "ACA Kiran K",
    image: null
  },
  {
    id: "dpdp-sme",
    category: "Compliance",
    title: "What the DPDP Act means for SME data controls",
    excerpt: "India's data protection law reshapes how smaller businesses handle personal data. The governance basics worth putting in place now.",
    date: "May 24, 2026",
    read: "6 min read",
    author: "ACA Kiran K",
    image: null
  },
  {
    id: "gst-recon",
    category: "Taxation",
    title: "GST reconciliation: common mismatches and how to resolve them",
    excerpt: "From 2A/2B gaps to credit-note timing, a field guide to the reconciliation issues that most often delay filings.",
    date: "May 15, 2026",
    read: "8 min read",
    author: "FCA Sachin U",
    image: null
  },
  {
    id: "forensic-redflags",
    category: "Forensic",
    title: "Reading the early red flags in financial statements",
    excerpt: "Forensic technique applied to routine reviews — the ratio shifts and ledger patterns that warrant a closer look.",
    date: "May 3, 2026",
    read: "6 min read",
    author: "ACA Kiran K",
    image: null
  },
  {
    id: "bank-audit-prep",
    category: "Audit",
    title: "Preparing for a statutory bank branch audit",
    excerpt: "A structured walkthrough of advances classification, IRAC norms and documentation that keeps branch audits on schedule.",
    date: "Apr 21, 2026",
    read: "9 min read",
    author: "FCA Mahendra",
    image: null
  },
  {
    id: "ai-close",
    category: "Technology",
    title: "Where AI genuinely speeds up the monthly close",
    excerpt: "Beyond the hype: the specific reconciliation and classification tasks where automation earns its place in an accounting workflow.",
    date: "Apr 9, 2026",
    read: "5 min read",
    author: "ACA Kiran K",
    image: null
  },
  {
    id: "internal-controls",
    category: "Audit",
    title: "Designing internal controls that scale with a growing firm",
    excerpt: "Controls that fit a 20-person company rarely fit a 200-person one. How to build a framework that grows without friction.",
    date: "Mar 28, 2026",
    read: "7 min read",
    author: "FCA Sachin U",
    image: null
  },
  {
    id: "presumptive-tax",
    category: "Taxation",
    title: "Presumptive taxation: who it suits and who it doesn't",
    excerpt: "Sections 44AD and 44ADA simplify compliance for many — but not all. A clear-eyed look at when the scheme actually helps.",
    date: "Mar 14, 2026",
    read: "6 min read",
    author: "FCA Sachin U",
    image: null
  },
  {
    id: "tech-due-diligence",
    category: "Compliance",
    title: "Financial due diligence for early-stage acquisitions",
    excerpt: "What buyers should verify before signing — revenue quality, working-capital normalisation and the off-balance-sheet items that bite.",
    date: "Feb 27, 2026",
    read: "8 min read",
    author: "FCA Mahendra",
    image: null
  }
];

window.blogCategories = ["All", "Audit", "Taxation", "Technology", "Compliance", "Forensic"];
