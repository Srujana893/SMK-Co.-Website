/* ============================================================
   SMK & Co — Insights: featured note · topic chips · the grid · article view
   Posts come from window.blogPosts (see js/config.js).
   Listing: the note flagged featured (else the newest) as a wide card with
   its photograph, topic chips, then every other note as a card in a grid of
   three, six at a time. Photographs are <image-slot>s keyed img-<id> and
   are filled from image-slots.state.json. Article: a reading column with a
   side rail that carries the note's facts and a list of its sections, the
   photograph above the text. #<id> in the address opens that note, so a
   note can be linked to.
   ============================================================ */
(function () {
  "use strict";
  var posts = (window.blogPosts || []).slice();
  var cats = (window.blogCategories || ["All"]).slice();
  if (cats[0] !== "All") cats.unshift("All");
  var PAGE = 6, shown = PAGE, activeCat = "All";
  var featuredWrap = document.getElementById("featured");
  var filterWrap = document.getElementById("filter");
  var gridWrap = document.getElementById("postGrid");
  var loadWrap = document.getElementById("loadMore");
  var listView = document.getElementById("listView");
  var articleView = document.getElementById("articleView");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function slug(c) { return String(c || "").toLowerCase().replace(/[^a-z]+/g, ""); }
  function when(p) { var d = new Date(p.date); return isNaN(d) ? null : d; }
  posts.sort(function (a, b) { return (when(b) || 0) - (when(a) || 0); });
  var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];

  /* per-topic hint shown in an empty photograph slot */
  var HINTS = {
    technology: "Drop a technology / IT-systems photo",
    compliance: "Drop a compliance / regulation photo",
    taxation: "Drop a taxation / finance photo",
    forensic: "Drop a forensic / investigation photo",
    audit: "Drop an audit / ledger photo"
  };
  function phHTML(post, extra) {
    var hint = HINTS[slug(post.category)] || "Drop a relevant photo";
    return '<image-slot class="ph-slot' + (extra ? " " + extra : "") + '" id="img-' + esc(post.id) +
      '" shape="rect" fit="cover" placeholder="' + esc(hint) + '"></image-slot>';
  }
  function metaHTML(p) {
    return '<div class="post-meta"><span>' + esc(p.date) + '</span><span class="dot"></span><span>' +
      esc(p.read) + '</span><span class="dot"></span><span>' + esc(p.author) + '</span></div>';
  }

  /* ---- featured: the flagged note, or the newest ---- */
  function renderFeatured() {
    if (!featured || !featuredWrap) return;
    featuredWrap.setAttribute("data-id", featured.id);
    featuredWrap.innerHTML =
      phHTML(featured, "ph--feat") +
      '<div class="featured__body">' +
        '<span class="cat-tag">' + esc(featured.category) + '</span>' +
        '<h2 class="featured__title"><a href="#' + esc(featured.id) + '" data-open="' + esc(featured.id) + '">' + esc(featured.title) + '</a></h2>' +
        '<p class="featured__excerpt">' + esc(featured.excerpt) + '</p>' +
        metaHTML(featured) +
      '</div>';
  }

  /* ---- topic chips ---- */
  function renderFilter() {
    if (!filterWrap) return;
    filterWrap.innerHTML = cats.map(function (c) {
      return '<button class="filter__btn' + (c === activeCat ? " is-active" : "") + '" type="button" aria-pressed="' + (c === activeCat ? "true" : "false") + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join("");
    filterWrap.querySelectorAll(".filter__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        activeCat = b.getAttribute("data-cat");
        shown = PAGE;
        renderFilter();
        renderGrid();
      });
    });
  }

  /* ---- the grid: every other note, six at a time ---- */
  function filtered() {
    return posts.filter(function (p) { return p !== featured && (activeCat === "All" || p.category === activeCat); });
  }
  function renderGrid() {
    if (!gridWrap) return;
    var list = filtered();
    gridWrap.innerHTML = list.slice(0, shown).map(function (p) {
      return '<article class="post" data-id="' + esc(p.id) + '">' +
        phHTML(p) +
        '<div class="post__body">' +
          '<span class="cat-tag">' + esc(p.category) + '</span>' +
          '<h3 class="post__title"><a href="#' + esc(p.id) + '" data-open="' + esc(p.id) + '">' + esc(p.title) + '</a></h3>' +
          '<p class="post__excerpt">' + esc(p.excerpt) + '</p>' +
          '<div class="post__foot"><span class="post__date">' + esc(p.date) + '</span>' +
            '<span class="post__more">Read more <span class="arr">&rarr;</span></span></div>' +
        '</div></article>';
    }).join("") + (list.length ? "" : '<p class="blog-empty">No notes under this topic yet.</p>');
    if (loadWrap) loadWrap.style.display = list.length > shown ? "flex" : "none";
  }
  if (loadWrap) loadWrap.querySelector("button").addEventListener("click", function () { shown += PAGE; renderGrid(); });

  /* ---- article: reading column, side rail, the photograph above the text ---- */
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
        '<div class="article__hero">' + phHTML(p, 'ph--feat') + '</div>' +
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

  renderFeatured();
  renderFilter();
  renderGrid();
  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var a = e.target.closest("[data-open]");
    var card = e.target.closest(".post, .featured");
    if (!a && !card) return;
    if (e.target.closest(".filter, .loadmore")) return;
    e.preventDefault();
    openArticle(byId(a ? a.getAttribute("data-open") : card.getAttribute("data-id")));
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
