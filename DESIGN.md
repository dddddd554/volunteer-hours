# Design Brief

## Direction

Warm Giving — a minimalist, textured off-white/light beige volunteer-hours dashboard anchored by a striking deep-red accent.

## Tone

Refined, warm minimalism: soft beige surfaces and generous rounding create calm, while the deep red delivers a confident, giving-focused emotional anchor.

## Differentiation

A volunteer dashboard that feels like a warm, tactile journal — textured beige surfaces, a single deep-red status card, and bold geometric display numerals instead of generic grey dashboards.

## Color Palette

| Token      | OKLCH          | Role                               |
| ---------- | -------------- | ---------------------------------- |
| background | 0.97 0.018 75  | textured off-white/light beige     |
| foreground | 0.2 0.02 40    | warm dark text                     |
| card       | 0.985 0.015 75 | slightly lighter beige card        |
| primary    | 0.44 0.19 25   | deep red accent / status card      |
| accent     | 0.44 0.19 25   | deep red (icons, active states)    |
| muted      | 0.93 0.02 75   | off-white action tiles             |
| border     | 0.88 0.02 75   | warm hairline borders              |

## Typography

- Display: Space Grotesk — headings, hero "Welcome back!", big "24" metric
- Body: DM Sans — labels, sub-text, navigation
- Scale: hero `text-3xl md:text-4xl font-bold tracking-tight`, h2 `text-xl font-semibold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Warm beige surfaces layered over a textured background; soft warm shadows (`shadow-subtle` on tiles, `shadow-elevated` on the status card) create gentle depth without hard edges.

## Structural Zones

| Zone    | Background            | Border   | Notes                                   |
| ------- | --------------------- | -------- | --------------------------------------- |
| Header  | transparent over bg   | —        | status bar + welcome + user row         |
| Content | bg-background texture | —        | status card (primary), 2x3 tile grid    |
| Footer  | bg-card               | border-t | bottom tab bar, red active Home tab     |

## Spacing & Rhythm

Mobile-first: p-5 page padding, gap-4 between sections, gap-3 within the 2x3 grid, tight micro-spacing inside cards for a dense-but-calm rhythm.

## Component Patterns

- Buttons/tiles: `rounded-2xl`, `bg-secondary`, `text-accent` icon + label, hover `shadow-subtle`
- Cards: `rounded-3xl`, `bg-card`, `shadow-subtle`; status card `bg-primary text-primary-foreground shadow-elevated`
- Badges/avatars: `rounded-full`, `bg-primary` red circle with white silhouette

## Motion

- Entrance: subtle fade/slide-up on load (~300ms)
- Hover: gentle lift via `shadow-subtle` + `transition-smooth` (300ms)
- Decorative: `float-soft` 6s on the status-card heart illustration

## Constraints

- Token-only styling — no raw hex/rgb in components
- Deep red reserved for accent + status card, not page backgrounds
- AA+ contrast in light and dark modes
- Exact copy: '8.31', 'Welcome back!', 'Student', 'Let's make a difference!', 'Total Hours', '24', 'hrs', six action labels

## Signature Detail

The deep-red "Total Hours" status card with white line-art hands-holding-a-heart illustration — a warm, human centerpiece that makes the whole dashboard feel like giving, not tracking.
