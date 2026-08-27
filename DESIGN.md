# Design Brief

## Direction

Warm Giving — a volunteer-hours productivity app (photo-evidence logging) with a phone-style mobile shell (status bar + bottom nav) that expands to a full-screen side/top-nav layout on tablet/desktop.

## Tone

Refined, warm minimalism: soft beige surfaces and generous rounding stay calm and trustworthy, while the deep red delivers a confident giving-focused anchor — now extended to frame photo evidence capture and previews.

## Differentiation

A volunteer journal that makes every logged hour feel verifiable and human: warm tactile beige surfaces with a deep-red evidence system — photo preview frames, a camera viewfinder Scan tab, and gallery capture — that turns proof-of-service into a warm, personal ritual.

## Color Palette

| Token      | OKLCH          | Role                              |
| ---------- | -------------- | --------------------------------- |
| background | 0.97 0.018 75  | textured off-white/light beige    |
| foreground | 0.2 0.02 40    | warm dark text                    |
| card       | 0.985 0.015 75 | slightly lighter beige card       |
| primary    | 0.44 0.19 25   | deep red accent / status card     |
| accent     | 0.44 0.19 25   | deep red (icons, active states)   |
| muted      | 0.93 0.02 75   | off-white action tiles            |
| border     | 0.88 0.02 75   | warm hairline borders             |
| photo-frame| 0.985 0.015 75 | photo preview surface             |
| photo-border| 0.82 0.03 75 | photo frame hairline              |
| viewfinder | 0.12 0.02 40   | camera viewfinder backdrop        |
| success    | 0.52 0.14 150  | evidence-captured confirmation    |
| destructive| 0.55 0.22 25   | remove photo / errors             |

## Typography

- Display: Space Grotesk — headings, hero "Welcome back!", big "24" metric, tab titles
- Body: DM Sans — labels, sub-text, navigation, form fields
- Scale: hero `text-3xl md:text-4xl font-bold tracking-tight`, h2 `text-xl font-semibold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Warm beige surfaces layered over a textured background; soft warm shadows (`shadow-subtle` on tiles, `shadow-elevated` on the status card and photo previews, `shadow-nav` on the desktop nav) create gentle depth; the Scan viewfinder is a dark recessed well that makes captured photos pop.

## Structural Zones

| Zone         | Background            | Border   | Notes                                    |
| ------------ | --------------------- | -------- | ---------------------------------------- |
| Mobile header| transparent over bg  | —        | status bar + welcome + user row          |
| Desktop nav  | bg-card              | border-b | top nav (`shadow-nav`), hidden on mobile |
| Content      | bg-background texture | —        | status card, action/stat grids, forms    |
| Photo zone   | photo-frame/drop      | photo-border | evidence previews, dashed drop target |
| Scan tab     | viewfinder (dark)     | —        | camera viewfinder + scan grid + shutter  |
| Footer       | bg-card              | border-t | bottom tab bar on mobile, hidden ≥ md    |

## Spacing & Rhythm

Mobile-first: p-5 page padding, gap-4 sections, gap-3 within grids; gaps and padding scale up at `md`/`lg` via `--grid-gap-md` and `--shell-pad-*`; photo frames use a consistent 4:3 aspect with a 12px gap rhythm to keep evidence uniform.

## Component Patterns

- Buttons/tiles: `rounded-2xl`, `bg-secondary`, `text-accent` icon + label, hover `shadow-subtle`; primary CTA `bg-primary` or `bg-gradient-primary`
- Cards: `rounded-3xl`, `bg-card`, `shadow-subtle`; status card `bg-primary text-primary-foreground shadow-elevated`
- Photo evidence: `photo-frame` (4:3, `rounded-2xl`, hairline `photo-border`); empty state `photo-drop` dashed target
- Camera: `viewfinder` dark backdrop, `scan-grid` overlay, `scan-sweep` animated line, `rounded-full` shutter button
- Badges/avatars: `rounded-full`, `bg-primary` red circle with white silhouette
- Nav: `rounded-full` active pill in deep red on desktop top/side nav

## Motion

- Entrance: subtle fade/slide-up on load (~300ms); desktop nav `slide-down` 300ms
- Hover: gentle lift via `shadow-subtle` + `transition-smooth` (300ms)
- Decorative: `float-soft` 6s on the status-card heart illustration
- Camera: `scan-sweep` 2.4s across the viewfinder; `shutter` 180ms flash on capture

## Constraints

- Token-only styling — no raw hex/rgb in components
- Deep red reserved for accent + status card + evidence CTAs, not page backgrounds
- AA+ contrast in light and dark modes
- Mobile keeps phone-style (status bar + bottom nav); ≥ md hides status bar and shows desktop nav
- Photo evidence is required before saving an activity; preview shown before save
- Photos are stored on the signed-in user's account cloud, never mixed between users
- doNotBuild: editing/deleting saved activity photos, sharing evidence to other apps
- Action grid and stat cards expand to use available space on tablet/desktop

## Signature Detail

The deep-red "Total Hours" status card stays the human centerpiece, now paired with a warm photo-evidence system — 4:3 beige preview frames and a dark camera viewfinder Scan tab — so every logged hour is both counted and visibly proven.
