/* ============================================================
   SMK & Co — Insights: lead and archive · article view
   Posts come from window.blogPosts (see js/config.js).
   Listing: the latest note on ink, then every other note as a dated row under
   plain word filters. Article: a reading column with a side rail
   that carries the note's facts and a list of its sections. #<id> in the
   address opens that note, so a note can be linked to.
   ============================================================ */
(function () {
  "use strict";
  var posts = (window.blogPosts || []).slice();
  var leadWrap = document.getElementById("jrLead");
  var listView = document.getElementById("listView");
  var articleView = document.getElementById("articleView");
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function when(p) { var d = new Date(p.date); return isNaN(d) ? null : d; }
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  posts.sort(function (a, b) { return (when(b) || 0) - (when(a) || 0); });
  var lead = posts.filter(function (p) { return p.featured; })[0] || posts[0];

  /* ---- the lead: the latest, or the one flagged featured; it sits on ink ---- */
  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function stamp(p) { var d = when(p); return d ? MON[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear() : esc(p.date); }
  function renderLead() {
    if (!lead || !leadWrap) return;
    leadWrap.innerHTML =
      '<h2 class="jr-lead__t"><a href="#' + esc(lead.id) + '" data-open="' + esc(lead.id) + '">' + esc(lead.title) + '</a></h2>' +
      '<p class="jr-lead__x">' + esc(lead.excerpt) + '</p>' +
      '<p class="jr-lead__m"><span>' + esc(lead.category) + '</span><span>' + esc(lead.date) + '</span><span>' + esc(lead.read) + '</span><span>' + esc(lead.author) + '</span></p>' +
      '<a class="hx-cta" href="#' + esc(lead.id) + '" data-open="' + esc(lead.id) + '">Read the note <span class="arr">&rarr;</span></a>';
    var meta = document.getElementById("jrLeadMeta");
    if (meta) { var d = when(lead); meta.textContent = (d ? MONTHS[d.getMonth()] + " " + d.getFullYear() : lead.date) + " \u00b7 " + lead.category + " \u00b7 " + lead.read; }
  }

  /* ---- the index: every other note, newest first, under plain word filters ---- */
  var filterWrap = document.getElementById("jrFilters");
  var rowsWrap = document.getElementById("jrRows");
  var cats = (window.blogCategories || ["All"]).slice();
  if (cats[0] !== "All") cats.unshift("All");
  var activeCat = "All";
  function renderFilters() {
    if (!filterWrap) return;
    filterWrap.innerHTML = cats.map(function (c) {
      return '<button class="jr-filter" type="button" aria-pressed="' + (c === activeCat ? "true" : "false") + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join("");
    filterWrap.querySelectorAll(".jr-filter").forEach(function (b) {
      b.addEventListener("click", function () {
        activeCat = b.getAttribute("data-cat");
        filterWrap.querySelectorAll(".jr-filter").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        applyFilter();
      });
    });
  }
  function renderIndex() {
    if (!rowsWrap) return;
    var rest = posts.filter(function (p) { return p !== lead; });
    rowsWrap.innerHTML = rest.map(function (p, i) {
      return '<li class="jr-row" data-cat="' + esc(p.category) + '" data-reveal data-d="' + Math.min(i + 1, 6) + '">' +
        '<span class="jr-row__date">' + stamp(p) + '</span>' +
        '<span class="jr-row__cat">' + esc(p.category) + '</span>' +
        '<span class="jr-row__body"><h3 class="jr-row__t"><a href="#' + esc(p.id) + '" data-open="' + esc(p.id) + '">' + esc(p.title) + '</a></h3>' +
        '<p class="jr-row__x">' + esc(p.excerpt) + '</p></span>' +
      '</li>';
    }).join("") + '<li class="jr-empty" hidden>No notes under this topic yet.</li>';
  }
  function applyFilter() {
    if (!rowsWrap) return;
    var shown = 0;
    rowsWrap.querySelectorAll(".jr-row").forEach(function (li) {
      var on = activeCat === "All" || li.getAttribute("data-cat") === activeCat;
      li.hidden = !on; if (on) shown++;
    });
    var empty = rowsWrap.querySelector(".jr-empty"); if (empty) empty.hidden = shown > 0;
  }

  /* ---- article: reading column, side rail ---- */
  function articleHTML(p) {
    var sections = [
      { id: "why", h: "Why it matters", t: "Use this section to set out the practical context for readers — what has changed, who is affected, and the obligations or opportunities involved. Keep the tone informative and educational, consistent with professional standards." },
      { id: "next", h: "What to do next", t: "Close with measured, practical guidance. Avoid promises of outcomes; instead, point readers toward the considerations and steps that apply to their situation, and invite them to get in touch for advice specific to their circumstances." }
    ];
    return '<div class="art">' +
      '<aside class="art__rail">' +
        '<button class="article__back" id="articleBack" type="button"><span class="arr">&larr;</span> All insights</button>' +
        '<dl class="art__meta">' +
          '<div><dt>Topic</dt><dd>' + esc(p.category) + '</dd></div>' +
          '<div><dt>Published</dt><dd>' + esc(p.date) + '</dd></div>' +
          '<div><dt>Reading time</dt><dd>' + esc(p.read) + '</dd></div>' +
          '<div><dt>Author</dt><dd>' + esc(p.author) + '</dd></div>' +
        '</dl>' +
        '<nav class="art__toc" aria-label="In this note"><p class="art__toc-h">In this note</p><ol>' +
          sections.map(function (s) { return '<li><a href="#' + esc(p.id) + '-' + s.id + '">' + esc(s.h) + '</a></li>'; }).join("") +
        '</ol></nav>' +
      '</aside>' +
      '<div class="art__main">' +
        '<h1>' + esc(p.title) + '</h1>' +
        '<div class="article__body">' +
          '<p class="art__lede">' + esc(p.excerpt) + '</p>' +
          '<p>This is a placeholder article layout, ready for your editorial team to replace with full content. It demonstrates the reading experience: a single measured column, a comfortable line length, and typography tuned for sustained reading. Add your sections, figures and references in this space.</p>' +
          sections.map(function (s, i) {
            return '<h2 id="' + esc(p.id) + '-' + s.id + '">' + esc(s.h) + '</h2><p>' + esc(s.t) + '</p>' +
              (i === 0 ? '<blockquote class="article__pull">Clear, factual writing builds trust. Lead with what a reader needs to know, then support it with specifics.</blockquote>' : '');
          }).join("") +
        '</div>' +
        '<div class="article__share"><span>Share</span>' +
          '<a href="#" aria-label="Share on LinkedIn"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v0M11 17v-4a2 2 0 014 0v4"/></svg></a>' +
          '<a href="#" aria-label="Copy link"><svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 005.6 0l2.8-2.8a4 4 0 00-5.6-5.6L11 7"/><path d="M14 10a4 4 0 00-5.6 0L5.6 12.8a4 4 0 005.6 5.6L13 17"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  function byId(id) { return posts.filter(function (p) { return p.id === id; })[0]; }
  /* the hash is either a note's id or "<id>-<section>"; ids contain hyphens, so match the longest id that fits */
  function byHash(h) {
    var hit = null;
    posts.forEach(function (p) { if ((h === p.id || h.indexOf(p.id + "-") === 0) && (!hit || p.id.length > hit.id.length)) hit = p; });
    return hit;
  }
  function openArticle(p, keepHash) {
    if (!articleView || !p) return;
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    articleView.querySelector(".article").innerHTML = articleHTML(p);
    articleView.querySelector("#articleBack").addEventListener("click", function () { closeArticle(); });
    if (!keepHash && history.replaceState) history.replaceState(null, "", "#" + p.id);
    function swap() {
      listView.style.display = "none";
      articleView.style.display = "block"; articleView.setAttribute("aria-hidden", "false");
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { articleView.classList.remove("is-leaving"); });
    }
    if (reduce) { swap(); return; }
    listView.classList.add("is-leaving");
    setTimeout(swap, 280);
  }
  function closeArticle() {
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (history.replaceState) history.replaceState(null, "", location.pathname);
    function swap() {
      articleView.style.display = "none"; articleView.setAttribute("aria-hidden", "true");
      listView.style.display = "block";
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { listView.classList.remove("is-leaving"); });
    }
    if (reduce) { swap(); return; }
    articleView.classList.add("is-leaving");
    setTimeout(swap, 280);
  }

  renderLead();
  renderFilters();
  renderIndex();
  document.addEventListener("click", function (e) {
    var a = e.target.closest && (e.target.closest("[data-open]") || (e.target.closest(".jr-row") && e.target.closest(".jr-row").querySelector("[data-open]")));
    if (!a) return;
    e.preventDefault();
    openArticle(byId(a.getAttribute("data-open")));
  });
  function fromHash() {
    var id = (location.hash || "").slice(1), p = id && byHash(id);
    if (p) openArticle(p, true);
  }
  fromHash();
  window.addEventListener("hashchange", function () {
    var id = (location.hash || "").slice(1);
    if (!id) { if (articleView.style.display === "block") closeArticle(); return; }
    var p = byHash(id);
    if (p && articleView.style.display !== "block") openArticle(p, true);
  });
})();
