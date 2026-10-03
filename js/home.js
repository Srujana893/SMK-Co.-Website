/* ============================================================
   SMK & Co — homepage data-driven blocks
   client reviews · client logos
   Reads window.testimonials and window.clients from
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

  /* ---- client reviews: after the closing CTA, directly above the footer.
     Nothing renders, heading included, while window.testimonials is empty.
     Enable only with client-approved testimonials, after confirming ICAI
     advertising/website guidelines permit them. ---- */
  var quotes = (Array.isArray(window.testimonials) ? window.testimonials : [])
    .filter(function (t) { return t && t.quote && t.name; });
  if (quotes.length && closing) {
    var sec = el("section", "hx-quotes");
    sec.id = "testimonials";
    sec.setAttribute("data-screen-label", "Testimonials");
    var head = el("header", "hx-sec",
      '<p class="hx-sec-label">What clients say</p>' +
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
    closing.parentNode.insertBefore(sec, closing.nextSibling);
  }

  /* ---- client logos: inside the reviews band, above the quotes. A belt of
     two identical tracks moves left to right; the second track is aria-hidden
     so each name is read once. Nothing renders while window.clients.items is
     empty. Confirm with each client, and against ICAI website guidelines,
     before real logos go live. ---- */
  var cl = window.clients || {};
  var logos = (Array.isArray(cl.items) ? cl.items : []).filter(function (n) { return n && n.name && n.logo; });
  var band = document.getElementById("testimonials");
  if (logos.length && band) {
    function track(hidden) {
      var ul = el("ul", "hx-net__track");
      if (hidden) ul.setAttribute("aria-hidden", "true");
      logos.forEach(function (n) {
        var li = el("li", "hx-net__item");
        var img = '<img class="hx-net__logo" src="' + esc(n.logo) + '" alt="' + (hidden ? '' : esc(n.name)) + '" decoding="async" />';
        li.innerHTML = (n.url && !hidden)
          ? '<a href="' + esc(n.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(n.name) + '">' + img + '</a>'
          : img;
        ul.appendChild(li);
      });
      return ul;
    }
    var belt = el("div", "hx-net__belt");
    belt.appendChild(track(false));
    belt.appendChild(track(true));
    belt.style.setProperty("--dur", Math.max(28, logos.length * 5) + "s");
    var railWrap = el("div", "hx-net__rail");
    railWrap.setAttribute("aria-label", "Clients");
    railWrap.appendChild(belt);
    var row = band.querySelector(".hx-quotes__row");
    row.parentNode.insertBefore(railWrap, row);
    /* The loop needs each track at least as wide as the rail. Measure once the
       logo images have loaded (they are lazy, so they have no width before),
       and repeat the items until the track fills; repeats are aria-hidden so
       each name is still read once. A set that cannot fill is shown still. */
    function fit() {
      var tracks = belt.querySelectorAll(".hx-net__track"), guard = 0;
      while (tracks[0].offsetWidth < railWrap.offsetWidth && guard++ < 4) {
        tracks.forEach(function (t) {
          Array.prototype.slice.call(t.children).slice(0, logos.length).forEach(function (li) {
            var copy = li.cloneNode(true); copy.setAttribute("aria-hidden", "true");
            copy.querySelectorAll("a").forEach(function (a) { a.tabIndex = -1; });
            t.appendChild(copy);
          });
        });
      }
      belt.classList.toggle("is-static", tracks[0].offsetWidth < railWrap.offsetWidth);
    }
    var pending = Array.prototype.slice.call(belt.querySelectorAll("img")).filter(function (i) { return !(i.complete && i.naturalWidth); });
    if (!pending.length) fit();
    else { var left = pending.length; pending.forEach(function (i) { i.addEventListener("load", function () { if (--left === 0) fit(); }); i.addEventListener("error", function () { if (--left === 0) fit(); }); }); }
    window.addEventListener("load", fit);
  }
})();
