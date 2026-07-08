/* ============ Leadership — profile route switch ============ */
(function () {
  "use strict";
  var PARTNERS = {
    sachin: {
      badge: "FCA · Partner", name: "FCA Sachin U", desig: "Fellow Chartered Accountant",
      exp: "8 Years", focus: "Compliance, accounting, audits & taxation",
      photo: "partner-sachin",
      linkedin: "https://www.linkedin.com/in/sachinuday/",
      summary: "Sachin is Partner at Sachin Mahendra & Co, Bengaluru, with eight years of experience serving startups, MSMEs and growing businesses. His core focus is Income Tax — strategic planning, return filing and defence in assessments and notices — alongside statutory and internal audit. He also acts as Virtual CFO to founders, covering MIS, cash-flow management, budgeting and fundraising support, and leads end-to-end compliance across GST, TDS, ROC and other statutory filings. DISA-qualified and AICA Level 2 certified, Sachin brings a tech-forward, proactive approach to every engagement.",
      resp: [
        "Planning and delivery of statutory and tax audits",
        "Direct and indirect tax advisory and return filings",
        "Financial reporting and accounting oversight",
        "Regulatory compliance, ROC and statutory filings"
      ]
    },
    mahendra: {
      badge: "FCA · Partner", name: "FCA Mahendra", desig: "Fellow Chartered Accountant",
      exp: "7 Years", focus: "Bank audits, PSU audits & accounting",
      photo: "partner-mahendra",
      summary: "Mahendra heads the firm's banking and public-sector audit engagements, with seven years of specialised experience in bank branch, concurrent and PSU audits. He is known for methodical audit planning, disciplined risk assessment and a rigorous approach to controls and accounting systems.",
      resp: [
        "Bank branch, concurrent and statutory bank audits",
        "Public-sector undertaking (PSU) and statutory audits",
        "Accounting systems, controls and reconciliations",
        "Audit planning and risk assessment"
      ]
    },
    kiran: {
      badge: "ACA · Partner", name: "ACA Kiran K", desig: "Associate Chartered Accountant",
      exp: "2 Years", focus: "IS audit, forensic accounting & AI",
      photo: "partner-kiran",
      linkedin: "https://www.linkedin.com/in/kiran-krishna-46b22516a/",
      email: "ca.kirankrishna@gmail.com",
      summary: "Kiran K is a qualified Chartered Accountant and Company Secretary with specialised credentials across information systems audit, cybersecurity, forensic accounting, digital compliance and financial investigations. As Managing Partner at Kiran K & Associates, he brings a technology-driven approach to audit, compliance and advisory engagements. His professional focus spans IS audit, forensic accounting, cybersecurity controls, digital process assurance and helping organisations strengthen governance, risk and technology-enabled compliance.",
      resp: [
        "Information systems (IS) audit and IT-controls review",
        "Forensic accounting and fraud examination",
        "AI-driven audit automation and data analytics",
        "Digital compliance and data-protection advisory"
      ]
    }
  };

  var listView = document.getElementById("teamListView");
  var profileView = document.getElementById("profileView");
  var wrap = document.getElementById("pprofile");

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c];});}

  function ctaButtonsHTML(p){
    var linked = p.linkedin ? '<a class="pprofile__cta pprofile__cta--linkedin" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + esc(p.name) + '\u2019s LinkedIn profile in a new tab">' +
      '<svg class="pprofile__cta-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.49v6.25zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z"/></svg>' +
      '<span>LinkedIn Profile</span>' +
    '</a>' : '';
    var mail = p.email ? '<a class="pprofile__cta pprofile__cta--email" href="mailto:' + esc(p.email) + '" aria-label="Email ' + esc(p.name) + ' at ' + esc(p.email) + '">' +
      '<svg class="pprofile__cta-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3 6.5h18v11H3zM3 7l9 6 9-6"/></svg>' +
      '<span>Email</span>' +
    '</a>' : '';
    if (!linked && !mail) return '';
    return '<div class="pprofile__ctas">' + linked + mail + '</div>';
  }

  function profileHTML(p){
    return '' +
      '<button class="pprofile__back" id="pprofileBack"><span class="arr">&larr;</span> All partners</button>' +
      '<div class="pprofile__head">' +
        '<div class="pprofile__hero"><image-slot class="ph-slot" id="' + esc(p.photo) + '" shape="rect" fit="cover" placeholder="Drop ' + esc(p.name) + '\u2019s portrait"></image-slot></div>' +
        '<div class="pprofile__id">' +
          '<span class="pprofile__badge">' + esc(p.badge) + '</span>' +
          '<h1 class="pprofile__name">' + esc(p.name) + '</h1>' +
          '<p class="pprofile__desig">' + esc(p.desig) + '</p>' +
          '<dl class="pprofile__meta">' +
            '<div class="pprofile__metacell" style="grid-column:1/-1"><dt>Experience</dt><dd>' + esc(p.exp) + '</dd></div>' +
            '<div class="pprofile__metacell" style="grid-column:1/-1"><dt>Areas of Expertise</dt><dd>' + esc(p.focus) + '</dd></div>' +
          '</dl>' +
          ctaButtonsHTML(p) +
        '</div>' +
      '</div>' +
      '<div class="pprofile__body">' +
        '<p class="pprofile__lead">' + esc(p.summary) + '</p>' +
        '<h2 class="pprofile__subhead">Key Responsibilities</h2>' +
        '<ul class="pprofile__resp">' + p.resp.map(function(r){return '<li>' + esc(r) + '</li>';}).join("") + '</ul>' +
      '</div>';
  }

  function openProfile(key){
    var p = PARTNERS[key];
    if (!p || !profileView) return;
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    wrap.innerHTML = profileHTML(p);
    wrap.querySelector("#pprofileBack").addEventListener("click", closeProfile);
    function swap(){
      listView.style.display = "none";
      profileView.style.display = "block";
      profileView.setAttribute("aria-hidden","false");
      window.scrollTo(0,0);
      requestAnimationFrame(function(){ profileView.classList.remove("is-leaving"); });
    }
    if (reduce){ swap(); return; }
    listView.classList.add("is-leaving");
    setTimeout(swap, 280);
  }

  function closeProfile(){
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    function swap(){
      profileView.style.display = "none";
      profileView.setAttribute("aria-hidden","true");
      listView.style.display = "block";
      window.scrollTo(0,0);
      requestAnimationFrame(function(){ listView.classList.remove("is-leaving"); });
    }
    if (reduce){ swap(); return; }
    profileView.classList.add("is-leaving");
    setTimeout(swap, 280);
  }

  document.querySelectorAll(".pcard").forEach(function(card){
    var key = card.getAttribute("data-partner");
    card.addEventListener("click", function(){ openProfile(key); });
    card.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openProfile(key); }
    });
  });
})();
