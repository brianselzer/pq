# brianselzer.com

The personal brand platform for **Brian Selzer** — Strategic Advisor for Participation, Retention & Emerging Platforms.

Static HTML / CSS / vanilla JS. No frameworks, no build step, no dependencies. Drop it on any static host.

## Files

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, credibility strip, core insight, the problem, Participation Systems™, assessment CTA, selected work, Resonant Signal™, contact CTA |
| `assessment.html` | Markets the Participation Quotient™ — what it measures, the Participation Engine™, the five archetypes, CTA to `/pq` |
| `insights.html` | Resonant Signal™ — featured essays, speaking topics, media appearances, newsletter |
| `contact.html` | Book a conversation, Calendly placeholder, email, LinkedIn |
| `styles.css` | All styling + design tokens (dark-first navy, teal + coral, Cormorant / DM Sans / Space Grotesk) |
| `app.js` | Nav scroll state, mobile menu, scroll reveals, and the animated **Resonant Signal** hero graphic (a 3:2 Lissajous curve inside participation orbits) |

## Deploy to GitHub Pages

1. Put the contents of this `website/` folder at the **root** of your repository (or in `/docs`).
2. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` (or `/docs`).
3. Save. Your site publishes at `https://<user>.github.io/<repo>/`.

For a custom domain (`brianselzer.com`): add a `CNAME` file containing `brianselzer.com` and point your DNS at GitHub Pages.

### Note on the `/pq` assessment link
Every "Take the Assessment" button links to **`/pq`** (the existing, separately-hosted assessment). This is an absolute path, so it resolves to `https://brianselzer.com/pq` on the custom domain. If you deploy under a project subpath instead (`github.io/<repo>/`), change these `href="/pq"` links to the assessment's full URL.

## Things to wire up before launch

- **`/pq`** — confirm the assessment lives at this path (or update the links).
- **Calendly** — replace the placeholder block in `contact.html` (`.calendly__slot`) with your real scheduling embed.
- **Email** — `hello@brianselzer.com` is used throughout; swap for the real address.
- **LinkedIn** — replace `https://www.linkedin.com/` with the real profile URL (appears in nav-less footer + contact).
- **Newsletter** — the email inputs are inert (`onsubmit="return false"`); connect to your provider (ConvertKit, Beehiiv, etc.).
- **Client / press logos** — the credibility strip and media row use clean typographic wordmarks (not the companies' trademarked logos), which is the safe, premium default. Swap for licensed logo assets only if you have rights.
- **Real photography** — the design currently leads with the geometric Resonant Signal graphic rather than a portrait. If you want Brian's headshot featured, send it and we'll integrate.

## Brand system

This site is built on the **BlueSe7en design system** in the project root (`/colors_and_type.css`, `/README.md`, `/SKILL.md`). `styles.css` here is a self-contained production copy so the site has zero external project dependencies.
