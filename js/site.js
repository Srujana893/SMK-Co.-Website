/* ============================================================
   SMK & Co — shared site behaviours
   nav state · smooth scroll · scroll-reveal · count-up ·
   hero parallax · mobile menu · contact form · config injection
   (rect-based scroll detection — resilient across environments)
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var cfg = window.siteConfig || {};

  /* ---- inject config into [data-cfg] slots ---- */
  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var v = getPath(cfg, el.getAttribute("data-cfg"));
    if (v == null) return;
    if (el.hasAttribute("data-cfg-href")) {
      el.setAttribute("href", el.getAttribute("data-cfg-href") + v);
    } else {
      el.textContent = v;
    }
  });

  var nav = document.querySelector(".nav");
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  var sections = spyLinks.map(function (l) { return document.querySelector(l.getAttribute("href")); });
  var heroBg = document.querySelector("[data-parallax]");

  if (reduce) reveals.forEach(function (el) { el.classList.add("in"); });

  /* ---- count-up ---- */
  function countUp(el) {
    if (el.__done) return; el.__done = true;
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 1300, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- main scroll-driven update (reveal · counters · spy · nav · parallax) ---- */
  var vh = window.innerHeight;
  function update() {
    var y = window.scrollY || window.pageYOffset;
    vh = window.innerHeight;

    if (nav) nav.classList.toggle("is-solid", y > 40);

    if (!reduce) {
      for (var i = reveals.length - 1; i >= 0; i--) {
        var el = reveals[i];
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) { el.classList.add("in"); reveals.splice(i, 1); }
      }
    }

    for (var c = counters.length - 1; c >= 0; c--) {
      var ce = counters[c], cr = ce.getBoundingClientRect();
      if (cr.top < vh * 0.85 && cr.bottom > 0) { countUp(ce); counters.splice(c, 1); }
    }

    if (sections.length) {
      var active = 0, mid = vh * 0.45;
      for (var s = 0; s < sections.length; s++) {
        if (sections[s] && sections[s].getBoundingClientRect().top <= mid) active = s;
      }
      spyLinks.forEach(function (l, j) { l.classList.toggle("is-active", j === active); });
    }

    if (heroBg && !reduce && y < vh) heroBg.style.transform = "translate3d(0," + (y * 0.18) + "px,0)";
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
  // failsafe: if anything is still hidden shortly after load, reveal it
  setTimeout(function () {
    update();
    reveals.forEach(function (el) { el.classList.add("in"); });
    reveals.length = 0;
  }, 1800);

  /* ---- smooth-scroll anchor links ---- */
  document.querySelectorAll('a[data-scroll]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top;
      if (id === "#top" || getComputedStyle(t).position === "fixed") {
        top = 0;
      } else {
        top = t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 64;
      }
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
      closeMenu();
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ---- mobile menu ---- */
  var mnav = document.querySelector(".mnav");
  var burger = document.querySelector(".nav__burger");
  function openMenu() { if (mnav) { mnav.classList.add("is-open"); document.body.style.overflow = "hidden"; } }
  function closeMenu() { if (mnav) { mnav.classList.remove("is-open"); document.body.style.overflow = ""; } }
  if (burger) burger.addEventListener("click", openMenu);
  document.querySelectorAll("[data-close-menu]").forEach(function (b) { b.addEventListener("click", closeMenu); });
  if (mnav) mnav.querySelector(".mnav__scrim").addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---- contact form (compliant pull-model, client-side only) ---- */
  var form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[data-required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim().length > 0;
        if (input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (ok) {
        form.reset();
        var note = form.querySelector(".form__ok");
        if (note) { note.classList.add("show"); setTimeout(function () { note.classList.remove("show"); }, 6000); }
      }
    });
    form.querySelectorAll("[data-required]").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field.classList.contains("invalid")) field.classList.remove("invalid");
      });
    });
  }
})();
