/* ============ Leadership — profile route switch ============ */
(function () {
  "use strict";
  var PARTNERS = {
    sachin: {
      badge: "FCA · Partner", name: "FCA Sachin U", desig: "Fellow Chartered Accountant",
      memb: "247584", exp: "8 Years", focus: "Compliance, accounting, audits & taxation",
      photo: "partner-sachin",
      summary: "Sachin leads the firm's assurance and compliance practice, bringing eight years of hands-on experience across statutory audit, financial accounting and direct and indirect taxation. He partners closely with clients to keep their reporting accurate, their filings timely and their obligations under Indian regulation fully met.",
      resp: [
        "Planning and delivery of statutory and tax audits",
        "Direct and indirect tax advisory and return filings",
        "Financial reporting and accounting oversight",
        "Regulatory compliance, ROC and statutory filings"
      ]
    },
    mahendra: {
      badge: "FCA · Partner", name: "FCA Mahendra", desig: "Fellow Chartered Accountant",
      memb: "253510", exp: "7 Years", focus: "Bank audits, PSU audits & accounting",
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
      memb: "280660", exp: "2 Years", focus: "IS audit, forensic accounting & AI",
      photo: "partner-kiran",
      summary: "Kiran drives the firm's technology-integrated practice, combining information-systems audit, forensic accounting and applied AI. Certified across IS audit, forensic and fraud detection, and digital compliance, Kiran brings modern analytics and automation to traditional assurance work.",
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
            '<div class="pprofile__metacell"><dt>Membership No.</dt><dd>' + esc(p.memb) + '</dd></div>' +
            '<div class="pprofile__metacell"><dt>Experience</dt><dd>' + esc(p.exp) + '</dd></div>' +
            '<div class="pprofile__metacell" style="grid-column:1/-1"><dt>Areas of Expertise</dt><dd>' + esc(p.focus) + '</dd></div>' +
          '</dl>' +
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
