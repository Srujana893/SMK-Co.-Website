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
    phone: "+91 34578 76543",
    lines: [
      "63/B, 3rd Floor, Chirag Plaza,",
      "10th Main, 4th Block, Rajaji Nagar,",
      "Bengaluru, Karnataka — 560 010"
    ],
    /* Google Maps embed for 63/B, 3rd Floor, Chirag Plaza, 10th Main, 4th Block,
       Rajaji Nagar, Bengaluru — 560 010. The iframe's src URL only; the map
       container on /contact renders only while this is non-empty. The pin is
       Google's listing "Sachin Mahendra & Co" at the Rajaji Nagar address. */
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.729629415279!2d77.55360947550595!3d12.989137014492709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d3bb4da6d57%3A0xd64052fc50178605!2sSachin%20Mahendra%20%26%20Co!5e0!3m2!1sen!2sus!4v1790844592072!5m2!1sen!2sus"
  },
  branchOffice: {
    label: "Branch Office",
    city: "Shivamogga",
    phone: "+91 76890 65432",
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
   CLIENT REVIEWS — homepage, after the closing CTA, directly above the footer.
   Enable only with client-approved testimonials, after confirming ICAI
   advertising/website guidelines permit them.
   THE THREE ENTRIES BELOW ARE PLACEHOLDERS FOR LAYOUT, NOT REAL CLIENTS.
   Replace every quote and name with the client's approved words before
   publishing, or empty the array: with no entries the section is not
   rendered at all, heading included. Each entry:
     { quote: "…", name: "Client or company", role: "Role or industry" }
   `role` is optional. No star ratings, no photos, no results.
   ============================================================ */
window.testimonials = [
  {
    quote: "They explained what the accounts meant for the decision we were weighing up, not only what had to be filed.",
    name: "Sample client 1 (placeholder)",
    role: "Managing director · Manufacturing"
  },
  {
    quote: "The same partner has handled our audit and our GST notices from the start. Nothing is handed down a chain.",
    name: "Sample client 2 (placeholder)",
    role: "Founder · Technology services"
  },
  {
    quote: "Working papers that held up when the bank asked questions.",
    name: "Sample client 3 (placeholder)",
    role: "Partner · Professional services"
  }
];

/* ============================================================
   CLIENT LOGOS — homepage, a quiet band of its own labelled "Our clients",
   between Industries and the client reviews band. A slow strip moving left
   to right; pauses on hover and keyboard focus; still under reduced motion.
   Logos are shown in their official colours at one shared visual height.
   Nothing renders while `items` is empty.
   Every file in assets/clients/ is the company's own published asset, copied
   byte-for-byte from its official website; provenance for each is in
   assets/clients/README.md. None is redrawn, traced or generated. Keep it
   that way: add a client only with a file the client supplied or that its
   official site publishes.
   Each item:
     { name: "Company", logo: "assets/clients/….png", url: "", scale: 1 }
   `name` is the accessible label. `url` is optional. `scale` (optional,
   default 1) nudges one logo's height so lockups with stacked bilingual text
   read at the same visual weight as single-line marks; it never changes a
   logo's proportions.
   These are CLIENTS of the firm, not partners; the band's copy must not say
   otherwise. Confirm ICAI website guidelines permit naming clients before
   this goes live.
   ============================================================ */
window.clients = {
  items: [
    { name: "Way2Wealth",            logo: "assets/clients/way2wealth.png" },
    { name: "ABB",                   logo: "assets/clients/abb.svg", scale: 0.8 },
    { name: "Brilyant",              logo: "assets/clients/brilyant.png" },
    { name: "Indian Bank",           logo: "assets/clients/indian-bank.jpg" },
    { name: "Union Bank of India",   logo: "assets/clients/union-bank-of-india.png" },
    { name: "Indian Overseas Bank",  logo: "assets/clients/indian-overseas-bank.png", scale: 1.15 }
    /* PENDING — add only when the client supplies an official file:
       { name: "Ezon Electricals Pvt. Ltd.", logo: "assets/clients/ezon-electricals.svg" },
         Exact Ezon Electricals Pvt. Ltd. logo could not be verified; client asset required.
       { name: "Ryder Mobility Pvt. Ltd.",   logo: "assets/clients/ryder-mobility.svg" },
         Ryder Mobility Pvt. Ltd. logo could not be verified from an official public source; client asset required.
       { name: "Canara Bank",              logo: "assets/clients/canara-bank.svg" },
         Only a white-on-transparent header logo is published; a colour-on-light
         file is needed from the bank. Not confirmed yet, do not add: Weathox, Mediaberry. */
  ]
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
