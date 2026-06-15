/* ============================================================
   SMK & Co — Blog: render posts · category filter · article route
   Posts come from window.blogPosts (see js/config.js).
   ============================================================ */
(function () {
  "use strict";
  var posts = window.blogPosts || [];
  var cats = window.blogCategories || ["All"];
  var PAGE = 6;
  var shown = PAGE;
  var activeCat = "All";

  var featuredWrap = document.getElementById("featured");
  var filterWrap = document.getElementById("filter");
  var gridWrap = document.getElementById("postGrid");
  var loadWrap = document.getElementById("loadMore");
  var listView = document.getElementById("listView");
  var articleView = document.getElementById("articleView");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function slug(c) { return String(c || "").toLowerCase().replace(/[^a-z]+/g, ""); }

  /* per-topic hint shown in the empty image drop-zone */
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

  /* ---- featured (first post flagged featured, else first) ---- */
  var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];
  function renderFeatured() {
    if (!featured || !featuredWrap) return;
    featuredWrap.innerHTML =
      phHTML(featured, 'ph--feat') +
      '<div class="featured__body">' +
        '<span class="cat-tag">' + esc(featured.category) + '</span>' +
        '<h2 class="featured__title">' + esc(featured.title) + '</h2>' +
        '<p class="featured__excerpt">' + esc(featured.excerpt) + '</p>' +
        '<div class="post-meta"><span>' + esc(featured.date) + '</span><span class="dot"></span><span>' +
          esc(featured.read) + '</span><span class="dot"></span><span>' + esc(featured.author) + '</span></div>' +
      '</div>';
    featuredWrap.onclick = function () { openArticle(featured); };
  }

  /* ---- filter chips ---- */
  function renderFilter() {
    if (!filterWrap) return;
    filterWrap.innerHTML = cats.map(function (c) {
      return '<button class="filter__btn' + (c === activeCat ? ' is-active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
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

  /* ---- grid (exclude featured from list) ---- */
  function filtered() {
    return posts.filter(function (p) {
      if (p === featured) return false;
      return activeCat === "All" || p.category === activeCat;
    });
  }
  function renderGrid() {
    if (!gridWrap) return;
    var list = filtered();
    var slice = list.slice(0, shown);
    gridWrap.innerHTML = slice.map(function (p, i) {
      return '<article class="post" data-id="' + esc(p.id) + '">' +
        phHTML(p) +
        '<div class="post__body">' +
          '<span class="cat-tag">' + esc(p.category) + '</span>' +
          '<h3 class="post__title">' + esc(p.title) + '</h3>' +
          '<p class="post__excerpt">' + esc(p.excerpt) + '</p>' +
          '<div class="post__foot"><span class="post__date">' + esc(p.date) + '</span>' +
            '<span class="post__more">Read more <span class="arr">&rarr;</span></span></div>' +
        '</div></article>';
    }).join("");
    gridWrap.querySelectorAll(".post").forEach(function (el) {
      el.addEventListener("click", function () {
        var p = posts.filter(function (x) { return x.id === el.getAttribute("data-id"); })[0];
        if (p) openArticle(p);
      });
    });
    if (loadWrap) loadWrap.style.display = list.length > shown ? "flex" : "none";
  }
  if (loadWrap) {
    loadWrap.querySelector("button").addEventListener("click", function () {
      shown += PAGE; renderGrid();
    });
  }

  /* ---- article route (view switch w/ fade) ---- */
  function articleHTML(p) {
    return '' +
      '<button class="article__back" id="articleBack"><span class="arr">&larr;</span> All insights</button>' +
      '<span class="cat-tag">' + esc(p.category) + '</span>' +
      '<h1>' + esc(p.title) + '</h1>' +
      '<div class="post-meta"><span>' + esc(p.date) + '</span><span class="dot"></span><span>' +
        esc(p.read) + '</span><span class="dot"></span><span>By ' + esc(p.author) + '</span></div>' +
      '<div class="article__hero">' + phHTML(p, 'ph--feat') + '</div>' +
      '<div class="article__body">' +
        '<p>' + esc(p.excerpt) + '</p>' +
        '<p>This is a placeholder article layout, ready for your editorial team to replace with full content. It demonstrates the reading experience: a single measured column, a comfortable line length, and typography tuned for sustained reading. Add your sections, figures and references in this space.</p>' +
        '<h2>Why it matters</h2>' +
        '<p>Use this section to set out the practical context for readers — what has changed, who is affected, and the obligations or opportunities involved. Keep the tone informative and educational, consistent with professional standards.</p>' +
        '<blockquote class="article__pull">Clear, factual writing builds trust. Lead with what a reader needs to know, then support it with specifics.</blockquote>' +
        '<h2>What to do next</h2>' +
        '<p>Close with measured, practical guidance. Avoid promises of outcomes; instead, point readers toward the considerations and steps that apply to their situation, and invite them to get in touch for advice specific to their circumstances.</p>' +
      '</div>' +
      '<div class="article__share"><span>Share</span>' +
        '<a href="#" aria-label="Share on LinkedIn"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v0M11 17v-4a2 2 0 014 0v4"/></svg></a>' +
        '<a href="#" aria-label="Copy link"><svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 005.6 0l2.8-2.8a4 4 0 00-5.6-5.6L11 7"/><path d="M14 10a4 4 0 00-5.6 0L5.6 12.8a4 4 0 005.6 5.6L13 17"/></svg></a>' +
      '</div>';
  }
  function openArticle(p) {
    if (!articleView) return;
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    articleView.querySelector(".article").innerHTML = articleHTML(p);
    articleView.querySelector("#articleBack").addEventListener("click", closeArticle);
    function swap() {
      listView.style.display = "none";
      articleView.style.display = "block";
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { articleView.classList.remove("is-leaving"); });
    }
    if (reduce) { swap(); return; }
    listView.classList.add("is-leaving");
    setTimeout(swap, 280);
  }
  function closeArticle() {
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    function swap() {
      articleView.style.display = "none";
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
})();
