# Draft: the SMK & Co. logo in the header

Taken out of the header bar and the mobile menu on 15 Oct 2026, replaced by the
name "Sachin Mahendra & Co." set as text. Kept here so it can go back.

The image itself, `assets/smk-logo-lockup-reversed.png`, stays where it is: the
footer still uses it.

To restore, put these back in every page (index, about, team, services, blog,
contact, careers) in place of the `brand__name` spans.

Header bar, inside `<a href="/" class="nav__brand" ...>`:

```html
<a href="/" class="nav__brand" aria-label="SMK &amp; Co. — home">
  <img class="brand__logo" src="assets/smk-logo-lockup-reversed.png" alt="SMK &amp; Co. — Chartered Accountants" />
</a>
```

Mobile menu, inside `<div class="mnav__head">`:

```html
<img class="brand__logo brand__logo--mnav" src="assets/smk-logo-lockup-reversed.png" alt="SMK &amp; Co. — Chartered Accountants" />
```

The `.brand__logo` rules in `css/styles.css` and `css/system.css` were left in
place, so no CSS needs to come back.
