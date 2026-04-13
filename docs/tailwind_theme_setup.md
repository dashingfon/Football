how can i implement light mode and dark mode in tailwind v4 using custom themes instead of the dark variant

I’m checking the current Tailwind v4 docs so I can give you the right pattern rather than a legacy v3 answer.

Thought for 21s

Yes. In Tailwind v4, the cleanest approach is to make your colors semantic tokens and swap the token values with a selector like [data-theme="dark"], instead of styling with dark: everywhere. Tailwind’s @theme directive is what creates utility classes from your design tokens, and regular CSS variables are still the right tool for values you want to override per theme.

@import "tailwindcss";

/* Tailwind utilities generated from semantic tokens */
@theme {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-surface: var(--surface);
  --color-border: var(--border);
}

/* Default theme */
:root {
  --bg: oklch(0.98 0 0);
  --fg: oklch(0.20 0 0);
  --surface: oklch(1 0 0);
  --border: oklch(0.92 0 0);
}

/* Dark theme */
[data-theme="dark"] {
  --bg: oklch(0.14 0 0);
  --fg: oklch(0.96 0 0);
  --surface: oklch(0.18 0 0);
  --border: oklch(0.28 0 0);
}

Then use the semantic utilities in markup:

<html data-theme="light">
  <body class="bg-bg text-fg">
    <div class="bg-surface border border-border">
      ...
    </div>
  </body>
</html>

This works because @theme-defined color tokens generate utilities like bg-* and text-*, while the actual values can come from CSS variables that you override per theme. Tailwind also notes that theme variables must be defined at the top level, and that plain CSS variables are appropriate when you want theme-specific values without creating more utilities.

If you also want a utility-based selector for special cases, Tailwind v4 lets you define custom variants with @custom-variant, including a data-theme-based one. That is optional; it is only needed when you still want a theme-dark:* style API.

For native form controls, add a color-scheme utility to the root element so inputs and scrollbars match the active theme. Tailwind includes scheme-light, scheme-dark, and scheme-light-dark for that.

<html data-theme="dark" class="scheme-dark">

If you want, I can 
turn this into a ready-to-paste app.css plus a tiny theme toggle script.

scheme-light-dark works with "data-theme"

Short answer: no, scheme-light-dark does not react to your data-theme attribute automatically.

What scheme-light-dark actually does

The Tailwind utility scheme-light-dark maps to the CSS:

color-scheme: light dark;

This tells the browser:

“I support both light and dark UI — you choose based on the user's OS preference.”

So the browser decides using prefers-color-scheme, not your [data-theme="dark"] toggle.

Why it doesn’t follow data-theme

Your custom theming setup (with [data-theme="dark"]) is purely CSS-variable driven, while color-scheme is a browser-level hint. There’s no automatic linkage between the two.

Correct way to sync it with your theme

You need to explicitly switch the color-scheme based on your attribute:

:root {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}

Or using Tailwind utilities in your markup:

<html data-theme="light" class="scheme-light">

Then toggle both:

document.documentElement.dataset.theme = "dark";
document.documentElement.classList.remove("scheme-light");
document.documentElement.classList.add("scheme-dark");
Cleaner pattern (recommended)

Avoid duplicating logic in JS. Let CSS handle everything:

:root {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}

Then your toggle only does:

document.documentElement.dataset.theme = "dark";
When to use scheme-light-dark

Use it only if:

You are not manually controlling theme
You want automatic OS-based theming fallback
Key takeaway
scheme-light-dark → OS-driven
[data-theme="dark"] → app-driven
To combine them, you must wire them manually

If you want, I can 
show a fully integrated Tailwind v4 theme system (tokens + toggle + SSR-safe script) that avoids flashes and keeps everything in sync.