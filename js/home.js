/* ============================================================
   SMK & Co — homepage data-driven blocks
   Insights preview · testimonials · network rail
   Reads window.blogPosts, window.testimonials and window.network from
   js/config.js. Loads before js/site.js so anything inserted here with
   data-reveal is picked up by the scroll-reveal handler.
   ============================================================ */
(function () {
  "use strict";
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  var closing = document.querySelector(".hx-close");

  /* ---- insights: one lead post, then three titles with dates. Links go to
     /blog: articles open by click on the listing, so there is no deep link. ---- */
  var ins = document.getElementById("insights");
  var posts = Array.isArray(window.blogPosts) ? window.blogPosts : [];
  if (ins) {
    var lead = ins.querySelector("[data-ins-lead]");
    var list = ins.querySelector("[data-ins-list]");
    var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];
    var rest = posts.filter(function (p) { return p !== featured; }).slice(0, 3);
    if (!featured || !lead || !list) {
      ins.remove();
    } else {
      lead.innerHTML =
        '<p class="hx-ins__meta"><span>' + esc(featured.category) + '</span><span>' + esc(featured.date) + '</span></p>' +
        '<h3>' + esc(featured.title) + '</h3>' +
        '<p class="hx-ins__x">' + esc(featured.excerpt) + '</p>';
      list.innerHTML = rest.map(function (p) {
        return '<a href="/blog"><span>' + esc(p.date) + ' · ' + esc(p.category) + '</span><h4>' + esc(p.title) + '</h4></a>';
      }).join("");
    }
  }

  /* ---- testimonials: before the closing CTA. Nothing renders, heading
     included, while window.testimonials is empty.
     Enable only with client-approved testimonials, after confirming ICAI
     advertising/website guidelines permit them. ---- */
  var quotes = (Array.isArray(window.testimonials) ? window.testimonials : [])
    .filter(function (t) { return t && t.quote && t.name; });
  if (quotes.length && closing) {
    var sec = el("section", "hx-quotes hx-band");
    sec.id = "testimonials";
    sec.setAttribute("data-screen-label", "Testimonials");
    var head = el("header", "hx-sec",
      '<p class="hx-sec-label">Clients</p>' +
      '<h2 class="hx-sec-title">Trusted by the businesses we work with.</h2>');
    head.setAttribute("data-reveal", "");
    var row = el("div", "hx-quotes__row" + (quotes.length > 3 ? " is-many" : ""));
    quotes.forEach(function (t, i) {
      var fig = el("figure", "hx-quote",
        '<blockquote><p>' + esc(t.quote) + '</p></blockquote>' +
        '<figcaption><span class="hx-quote__who">' + esc(t.name) + '</span>' +
        (t.role ? '<span class="hx-quote__role">' + esc(t.role) + '</span>' : '') +
        '</figcaption>');
      fig.setAttribute("data-reveal", "");
      fig.setAttribute("data-d", String(Math.min(i + 1, 6)));
      row.appendChild(fig);
    });
    var wrap = el("div", "hx-wrap");
    wrap.appendChild(head); wrap.appendChild(row); sec.appendChild(wrap);
    closing.parentNode.insertBefore(sec, closing);
  }

  /* ---- network rail: after Industries, before Insights. Nothing renders
     while window.network.items is empty.
     Confirm the relationship wording with each organisation, and confirm ICAI
     guidelines permit displaying it. ---- */
  var net = window.network || {};
  var items = (Array.isArray(net.items) ? net.items : []).filter(function (n) { return n && n.name; });
  var before = ins || closing;
  if (items.length && before) {
    var rail = el("section", "hx-net");
    rail.id = "network";
    rail.setAttribute("data-screen-label", "Network");
    rail.setAttribute("aria-labelledby", "network-heading");
    var h = el("h2", "hx-net__h", esc(net.heading || "Working with"));
    h.id = "network-heading";
    function track(hidden) {
      var ul = el("ul", "hx-net__track");
      if (hidden) ul.setAttribute("aria-hidden", "true");
      items.forEach(function (n) {
        var li = el("li", "hx-net__item");
        var inner =
          (n.logo ? '<img class="hx-net__logo" src="' + esc(n.logo) + '" alt="" loading="lazy" />' : '') +
          '<span class="hx-net__name">' + esc(n.name) + '</span>' +
          (n.descriptor ? '<span class="hx-net__d">' + esc(n.descriptor) + '</span>' : '');
        if (n.url && !hidden) {
          li.innerHTML = '<a href="' + esc(n.url) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
        } else {
          li.innerHTML = inner;
        }
        ul.appendChild(li);
      });
      return ul;
    }
    var belt = el("div", "hx-net__belt");
    belt.appendChild(track(false));
    belt.appendChild(track(true));
    belt.style.setProperty("--dur", Math.max(24, items.length * 6) + "s");
    var railWrap = el("div", "hx-net__rail");
    railWrap.appendChild(belt);
    var nw = el("div", "hx-wrap");
    nw.appendChild(h); nw.appendChild(railWrap); rail.appendChild(nw);
    before.parentNode.insertBefore(rail, before);
    /* a set too short to fill the rail is shown as a still row rather than
       a marquee with a gap in it */
    requestAnimationFrame(function () {
      var first = belt.firstElementChild;
      if (first && first.offsetWidth < railWrap.offsetWidth) belt.classList.add("is-static");
    });
  }
})();
