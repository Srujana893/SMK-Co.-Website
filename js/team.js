/* ============================================================
   SMK & Co — Leadership: render partner cards · profile route
   ============================================================ */
(function () {
  "use strict";

  var partners = [
    {
      id: "sachin-u",
      name: "FCA Sachin U",
      role: "FCA · Partner",
      membership: "247584",
      years: "8 Years",
      expertise: "Compliance, accounting, audits & taxation.",
      qualifications: ["CA", "ISA 3.0", "AICA L2"],
      photo: "uploads/partners/sachin-u.jpg",
      initials: "SU",
      summary: "Sachin U anchors the firm's compliance and assurance practice, bringing eight years of disciplined audit work across statutory, tax and internal engagements. His approach pairs traditional CA rigour with the technology-integrated workflow that defines SMK & Co.",
      areas: [
        "Statutory and tax audits",
        "Direct and indirect taxation",
        "Corporate and regulatory compliance",
        "Financial reporting under Ind AS / AS"
      ],
      responsibilities: [
        "Partner-in-charge for statutory and tax audit engagements",
        "Oversight of GST and income-tax compliance for the firm's client roster",
        "Leading finalisation and Ind AS financial-reporting mandates",
        "Client relationship lead for mid-market and family-owned businesses"
      ]
    },
    {
      id: "mahendra",
      name: "FCA Mahendra",
      role: "FCA · Partner",
      membership: "253510",
      years: "7 Years",
      expertise: "Bank audits, PSU audits & accounting.",
      qualifications: ["CA", "ISA 3.0"],
      photo: "uploads/partners/mahendra.jpg",
      initials: "M",
      summary: "Mahendra leads the firm's bank and public-sector audit practice, drawing on seven years of concurrent, statutory and revenue-audit assignments across nationalised banks, cooperative banks and PSU undertakings.",
      areas: [
        "Bank statutory, concurrent and revenue audits",
        "PSU and government-entity audits",
        "Accounting and finalisation",
        "Internal audit and process reviews"
      ],
      responsibilities: [
        "Partner-in-charge for bank and PSU audit engagements",
        "Managing audit teams across concurrent and statutory bank branch audits",
        "Overseeing accounting and finalisation for corporate clients",
        "Quality review lead for regulated-sector assurance work"
      ]
    },
    {
      id: "kiran-k",
      name: "ACA Kiran K",
      role: "ACA · Partner",
      membership: "280660",
      years: "2 Years",
      expertise: "IS audit, forensic accounting & AI.",
      qualifications: ["CA", "CS", "CC", "ISA 3.0", "FAFD", "DPCAC", "AICA L2"],
      photo: "uploads/partners/kiran-k.jpg",
      initials: "KK",
      summary: "Kiran K leads the firm's technology-integrated practice — information-systems audit under ISA 3.0, forensic accounting and AI automation. A multi-credentialled professional (CA, CS, CC, FAFD, DPCAC, AICA L2), Kiran brings a modern discipline to compliance and investigation work.",
      areas: [
        "Information-systems and cybersecurity audit (ISA 3.0)",
        "Forensic accounting and fraud examination (FAFD)",
        "AI automation for finance and audit workflows",
        "Data-protection and DPDP readiness (DPCAC)"
      ],
      responsibilities: [
        "Partner-in-charge for IS audit and cybersecurity engagements",
        "Leading forensic accounting and investigation mandates",
        "Designing AI-driven automation for reconciliation and reporting",
        "Advising clients on DPDP compliance and data-protection readiness"
      ]
    }
  ];

  var listView = document.getElementById("teamListView");
  var profileView = document.getElementById("teamProfileView");
  var grid = document.getElementById("partnerGrid");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  function cardPhotoHTML(p) {
    return '<div class="partner-card__photo">' +
      '<span class="partner-card__initials" aria-hidden="true">' + esc(p.initials) + '</span>' +
      '<img src="' + esc(p.photo) + '" alt="Portrait of ' + esc(p.name) + '" loading="lazy" onerror="this.style.display=\'none\'" />' +
    '</div>';
  }

  function cardHTML(p) {
    return '<article class="partner-card" data-id="' + esc(p.id) + '" tabindex="0" role="button" aria-label="View profile of ' + esc(p.name) + '">' +
      cardPhotoHTML(p) +
      '<div class="partner-card__body">' +
        '<span class="partner-card__role">' + esc(p.role) + '</span>' +
        '<h3 class="partner-card__name">' + esc(p.name) + '</h3>' +
        '<div class="partner-card__meta"><span>Memb. ' + esc(p.membership) + '</span><span class="dot"></span><span>' + esc(p.years) + '</span></div>' +
        '<p class="partner-card__focus">' + esc(p.expertise) + '</p>' +
        '<div class="partner-card__cta"><span>View Profile <span class="arr">&rarr;</span></span><span class="partner-plus" aria-hidden="true">+</span></div>' +
      '</div>' +
    '</article>';
  }

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = partners.map(cardHTML).join("");
    grid.querySelectorAll(".partner-card").forEach(function (el) {
      var open = function () {
        var p = partners.filter(function (x) { return x.id === el.getAttribute("data-id"); })[0];
        if (p) openProfile(p);
      };
      el.addEventListener("click", open);
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }

  function profilePhotoHTML(p) {
    return '<div class="partner-profile__photo">' +
      '<span class="partner-profile__initials" aria-hidden="true">' + esc(p.initials) + '</span>' +
      '<img src="' + esc(p.photo) + '" alt="Portrait of ' + esc(p.name) + '" onerror="this.style.display=\'none\'" />' +
    '</div>';
  }

  function profileHTML(p) {
    return '<button class="partner-profile__back" id="partnerBack" type="button"><span class="arr">&larr;</span> Back to Leadership</button>' +
      '<div class="partner-profile__head">' +
        profilePhotoHTML(p) +
        '<div>' +
          '<span class="partner-profile__role">' + esc(p.role) + '</span>' +
          '<h1 class="partner-profile__name">' + esc(p.name) + '</h1>' +
          '<div class="partner-profile__chips">' +
            p.qualifications.map(function (q) { return '<span class="chip">' + esc(q) + '</span>'; }).join("") +
          '</div>' +
          '<div class="partner-profile__meta"><span>Memb. ' + esc(p.membership) + '</span><span class="dot"></span><span>' + esc(p.years) + ' of practice</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="partner-profile__body">' +
        '<h3>Professional summary</h3>' +
        '<p>' + esc(p.summary) + '</p>' +
        '<h3>Areas of expertise</h3>' +
        '<ul>' + p.areas.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join("") + '</ul>' +
        '<h3>Key responsibilities</h3>' +
        '<ul>' + p.responsibilities.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join("") + '</ul>' +
      '</div>';
  }

  function openProfile(p) {
    if (!profileView || !listView) return;
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    profileView.querySelector(".partner-profile").innerHTML = profileHTML(p);
    profileView.querySelector("#partnerBack").addEventListener("click", closeProfile);
    profileView.setAttribute("aria-hidden", "false");
    function swap() {
      listView.style.display = "none";
      profileView.style.display = "block";
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { profileView.classList.remove("is-leaving"); });
    }
    if (reduce) { swap(); return; }
    listView.classList.add("is-leaving");
    setTimeout(swap, 280);
  }

  function closeProfile() {
    if (!profileView || !listView) return;
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    profileView.setAttribute("aria-hidden", "true");
    function swap() {
      profileView.style.display = "none";
      listView.style.display = "block";
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { listView.classList.remove("is-leaving"); });
    }
    if (reduce) { swap(); return; }
    profileView.classList.add("is-leaving");
    setTimeout(swap, 280);
  }

  renderGrid();
})();
