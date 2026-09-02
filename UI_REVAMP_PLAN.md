# UI Revamp Plan — general-chatbot

> **STATUS: implemented (all 6 phases).** `npm run build` passes; all 33 routes
> compile. Verified in-browser in both themes with zero indigo pixels remaining.
> Deviations from this plan are listed under "As-built notes" at the end.

> A visual rebuild of every surface that changes **no behavior**. The product
> works; it just doesn't look like anyone decided how it should look.

**Scope:** 8,409 lines of TSX across 73 UI files · 0 features changed

---

## 1. What's actually wrong

Not taste — **structure**. The app has no component layer, so every button was
written from scratch and drifted. These are real counts from the current
codebase, not estimates:

| Count | Symptom | Why it reads as unfinished |
|------:|---------|----------------------------|
| **205** | Hardcoded brand colors | `indigo-600`, `violet`, `purple`, `cyan` pasted across 57 files, bypassing the theme tokens that already exist in `app/globals.css` |
| **27** | Copies of one button | The literal string `bg-indigo-600 hover:bg-indigo-500` repeated instead of a `<Button>`. No two are quite identical. |
| **47** | Copies of one card | `hover:bg-accent/50 bg-muted/30` — note this applies a **hover state to non-interactive cards**, a find-and-replace artifact |
| **6** | Competing corner radii | `xl` (138×), `2xl` (62×), `lg` (25×), `md`, `3xl`, `[1rem]` — no rule about which means what |
| **7** | Shadow scales | Colored glows (`shadow-indigo-500/25`) mixed with `shadow-2xl`; depth doesn't track elevation |
| **4** | Leftover codemod scripts | `refactor-theme.js`, `refactor-hovers.js`, `refactor-theme-text.js`, `refactor-cleanup.js` in the repo root — the evidence of styling by regex |

That last row is the tell. Those scripts are what produced the duplicated
strings — including the nonsensical hover-on-static-card pattern.

**Every one of these is a consistency defect, not a layout defect.** That's good
news: the fix is mostly mechanical, and mechanical changes are the safe kind to
make when features must not move.

### Reproduce these counts

```bash
# 205 hardcoded brand colors across 57 files
grep -rn "indigo-\|violet-\|purple-\|cyan-" app components --include=*.tsx | wc -l
grep -rln "indigo-\|violet-\|purple-\|cyan-" app components --include=*.tsx | wc -l

# 27 duplicated buttons / 47 duplicated cards
grep -rn "bg-indigo-600 hover:bg-indigo-500" app components --include=*.tsx | wc -l
grep -rn "hover:bg-accent/50 bg-muted/30" app components --include=*.tsx | wc -l

# radius + shadow sprawl
grep -rho "rounded-[a-z0-9]*" app components --include=*.tsx | sort | uniq -c | sort -rn
grep -rho "shadow-[a-z0-9/]*" app components --include=*.tsx | sort | uniq -c | sort -rn
```

---

## 2. The direction

Away from the indigo-gradient-and-glow look that every AI product shipped in
2024, toward something that reads as **dependable infrastructure**. Closer to
Linear or Stripe than to an AI startup landing page. Restraint is the
differentiator now.

### Palette

One accent, used sparingly. Neutrals biased slightly cool so they sit *with* the
accent instead of fighting it. Semantic colors stay separate from brand color —
a green means "healthy," never "on brand."

| Role | Hex | Use |
|------|-----|-----|
| Ink | `#0E1414` | Primary text, sidebar ground |
| Paper | `#F7F6F3` | App background (light) |
| Accent | `#0F6E68` | Primary buttons, data marks, active state — *sparingly* |
| Muted | `#5C6B6A` | Secondary text, labels |
| Warning | `#B4531F` | Semantic only, never decorative |

> **Open decision:** the teal is a real departure from the current indigo, and it
> propagates through every later phase. Worth confirming before phase 01 starts.
> Staying on a refined indigo is a legitimate alternative — the structural fixes
> below matter far more than the hue.

### Type

Inter **stays** — right call for dense UI, already loaded, no reason to churn it.
What changes is the *scale*: six fixed sizes instead of the current free-for-all,
with headings that step down properly instead of jumping from `text-7xl` to
`text-xl` with nothing between.

### Density

The dashboard currently pads to `p-12` on wide screens and floats cards in space.
Tightening to a real 4px spacing scale gets roughly a third more content above the
fold without anything feeling cramped.

---

## 3. What changes, surface by surface

Same routes, same data, same handlers. Different clothes.

### Landing page

**Now**
- Three blurred color orbs behind the hero, *plus* a `hero-gradient` of three more radial gradients
- Gradient text on the headline **and** on the stats row
- Fabricated numbers — "10K+ Websites indexed," "99.9% Uptime guaranteed"
- A browser mockup with a floating widget hardcoded to `bg-white`, so it breaks in light mode
- Five staggered `animate-fade-in-up` delays firing on load

**After**
- Flat ground, one faint accent wash. No orbs.
- Solid headline; the accent appears once, on the primary action
- Honest proof or none — replace invented stats with the real demo, which the app already has
- A live `DemoChat` as the hero object instead of a fake screenshot
- One entrance, respecting `prefers-reduced-motion`

### Dashboard

**Now**
- Active nav item is a saturated indigo pill with a colored glow
- Inactive items *also* carry a `bg-muted/30` fill, so nothing reads as selected at a glance
- Stat cards float with no grouping; 99 separate `className` strings on the analytics page alone
- Sidebar and content sit on different backgrounds (`bg-background` vs `bg-card`) for no reason

**After**
- Selection shown by ground + weight, not glow. Quieter and clearer.
- Inactive items transparent; hover is the only fill
- Stats in one bordered row; charts inherit a single axis and grid style
- One page shell — sticky header carrying title, breadcrumb, and page actions

### Chat widget

**Now**
- Bubbles at `rounded-2xl` with a tail, on a tinted ground
- Customer's `primaryColor` applied to bubbles, header, and button alike
- Typing state is three bouncing dots

**After**
- Assistant text unbubbled on the panel ground; only the user's turn gets a bubble
- Customer color confined to the launcher and send button — their brand, not a wash
- Streaming text with a cursor. It's already streaming; show it.

> ⚠️ The widget renders on **customer websites** and honors a per-chatbot
> `primaryColor`. It changes last, behind the same props it takes today, so no
> embed on any live site breaks.

---

## 4. How it gets done

Bottom-up. The token layer lands first so every later phase is a **deletion**
rather than an addition. Each phase is independently shippable.

### Phase 01 — Tokens
Rewrite the theme variables, collapse radii to three, replace colored glows with a
neutral elevation scale, define the spacing and type scales. No component touched
yet — but the whole app shifts color.

`app/globals.css`

### Phase 02 — Primitives
Build the component layer the project never had: Button, Card, Input, Select,
Badge, Modal, Table, Skeleton, EmptyState. **Modal matters most** — there are
eight hand-rolled dialogs with eight different overlays and no shared focus trap
or Escape handling.

`components/ui/*`

### Phase 03 — Shell
Sidebar, dashboard layout, and a new PageHeader. This is where the product starts
feeling different, and it's cheap — three files.

`components/Sidebar.tsx` · `app/dashboard/layout.tsx`

### Phase 04 — Dashboard pages
Swap hand-built markup for primitives, page by page. Analytics is the big one —
99 class strings and Recharts styling to unify. Overview, conversations, data
sources, settings, embed, usage follow the same pattern.

`app/dashboard/**`

### Phase 05 — Landing & auth
Hero, features, how-it-works, testimonials, FAQ, footer, plus login, signup, and
the eight-step onboarding flow — which is the first thing a new user sees and
currently the least consistent.

`components/landing/*` · `app/onboarding/**` · `app/login` · `app/signup`

### Phase 06 — Widget & cleanup
Restyle the embedded widget against the same tokens while keeping its props and
per-customer color. Then delete the four `refactor-*.js` scripts and `scratch/`.

`components/ChatWidget.tsx` · `app/widget/[id]` · `refactor-*.js`

---

## 5. What stays untouched

The line I'll hold, so "UI only" means something specific:

- **No route changes.**
- **No API handler changes** — all 19 endpoints under `app/api` keep their contracts.
- **No Prisma schema or query changes.**
- **No auth or middleware changes.**
- **No prop or state-shape changes** — a restyled component takes exactly the props it takes today.
- **Not in scope:** RAG, scraping, embeddings, Pinecone, Cloudinary, PostHog.

**The check that proves it:** `npm run build` runs `check-types`, so a type error
anywhere is the signal that a change went further than styling.

---

## 6. Prompt for image generation

Paste into Midjourney, DALL·E, or similar to visualize the dashboard as it would
look after phase 04. The negative list at the end matters — those are exactly
what image models default to for "AI dashboard."

```text
A high-fidelity UI design screenshot of a modern SaaS analytics dashboard for an
AI chatbot platform, shown on a desktop browser at 16:9.

Layout: a narrow left sidebar in near-black (#0E1414) with small line icons and
grouped nav labels, the selected item marked only by a subtle raised ground and
heavier text weight — no glowing pill. Main area on warm off-white paper
(#F7F6F3) with generous margins. A sticky page header with the title "Overview"
in medium-weight sans, a breadcrumb above it, and a single deep-teal (#0F6E68)
primary button on the right.

Content: a row of four flat metric cards separated by hairline dividers rather
than shadows, each with a small uppercase label in muted grey-green, a large
tabular-number value, and a tiny teal sparkline. Below, a wide area chart with a
soft teal gradient fill, faint horizontal gridlines, and one emphasized endpoint
dot. To the right, a compact list of recent conversations with small avatar dots
and timestamps.

Style: restrained enterprise design, Inter typeface, precise 4px spacing rhythm,
6px corner radii, hairline #DDDAD3 borders, near-flat surfaces with barely-there
shadows. Exactly one accent color (deep teal) used sparingly on the primary
button and data marks. Cool-grey neutrals throughout.

Explicitly avoid: purple or indigo, glowing colored shadows, gradient text,
glassmorphism, blurred color orbs, neon, dark-mode-with-neon-accent, heavy drop
shadows, 3D illustrations.

Mood: calm, dependable infrastructure tooling — closer to Linear or Stripe than
to a 2024 AI startup landing page. Crisp, flat, sharp, screenshot-realistic.
```

**Landing-page variant:** swap the Content paragraph for —

```text
Content: a centered hero with a short two-line headline in near-black, one line
of muted subtext, a single teal button beside a quiet ghost button, and a live
chat panel below showing a real conversation — on flat paper ground with no
background gradients.
```

### On the hex codes in that prompt

The prompt names five: `#0E1414` (sidebar), `#F7F6F3` (paper), `#0F6E68`
(accent), `#DDDAD3` (borders), and the landing variant inherits them.

**Image models don't read hex codes reliably.** They're not a color picker — the
model tokenizes `#0F6E68` as text and will drift, often badly. So the codes are
doing two jobs, and only one is for the model:

1. A weak nudge to the generator — better than nothing, not dependable
2. **A record for you** — when you hand the output to a designer, or return to
   this in a month, the intended palette is written down

What actually steers the result is the plain-language description sitting beside
each code, which is why they're written as pairs — "deep-teal (#0F6E68)", "warm
off-white (#F7F6F3)" — rather than codes alone. The qualitative phrases and the
negative list carry far more weight: *"exactly one accent color used sparingly,"
"near-flat surfaces," "no purple or indigo," "no glowing colored shadows."*

**If the output comes back off-palette,** lean harder on words instead of codes.
Replace `deep-teal (#0F6E68)` with something like:

> dark desaturated blue-green, the color of oxidized copper — muted, not bright
> or tropical

The same trick works for the neutrals: "warm off-white, like uncoated paper
stock" beats `#F7F6F3` every time.

---

## Open decisions

1. **Teal vs. refined indigo.** The accent propagates through every phase; confirm before phase 01.
2. **The invented landing stats.** `HeroSection.tsx` claims "10K+ Websites indexed" and "99.9% Uptime guaranteed." I'd replace them with the real `DemoChat`. Say if they're aspirational placeholders you want kept.


---

## As-built notes

What shipped differently from the plan above, and why.

**Removed `SocialProof` from the landing page.** It listed "Acme Corp",
"TechFlow", "DataSync", "CloudBase", "NovaSoft" under the heading "Trusted by
teams at" — fake customer logos, the same category of problem as the invented
stats. Restyling it would have kept the false claim.

**`TestimonialsSection` was left in place and still contains invented
testimonials** — named people ("Sarah Chen, Head of CX at TechFlow") with
fabricated quotes and 5-star ratings. It was restyled but not removed, because
deleting it is a content decision, not a styling one. **This needs your call.**

**`DemoSection` was removed as a separate section** because `DemoChat` now lives
in the hero; keeping both rendered the same component twice on one page. The
`#demo` anchor now points at the hero demo.

**Charts were rewired to a shared theme** (`lib/chart-theme.ts`) rather than
restyled inline. The old axis color `#475569` was invisible on light paper —
charts previously only worked in dark mode.

**Legacy shims** (`.gradient-text`, `.glass`, `.glass-light`) were added in
phase 01 so phases 03–05 could convert incrementally, then deleted in phase 06
once nothing referenced them. `.hero-gradient` survives as a real style (one
faint accent wash).

**Two bugs found and fixed during the work, both caught by browser
verification rather than typechecking:**

- `ThemeToggle` had a hydration mismatch — `aria-label` was computed from
  `resolvedTheme`, which is undefined server-side. Now gated on `mounted`.
- Form inputs used `bg-background`, which rendered grey against a white card in
  light mode and read as disabled. Now `bg-card`.

**Widget (`ChatWidget.tsx`) keeps its own literal palette** rather than app
tokens, because it renders inside customer pages where the app's CSS variables
do not exist. Per-customer `primaryColor` is unchanged and still flows from the
database through inline styles — verified against two live chatbots (one
`#6366f1`, one `#10b981`), both rendering their own color.
