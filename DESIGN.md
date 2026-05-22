# Design Brief — TRIPNEX Airline Booking Platform

## Direction
Premium aviation booking platform. Deep ocean navy foundation with warm sunset gold accents. Professional, trustworthy, luxurious — refined minimalism for high-confidence travel transactions.

## Tone
Aviator-class professionalism: calm authority, precision, trust. Every detail reinforces reliability and first-class travel experience.

## Differentiation
Navy + gold aviation aesthetic. Glass-morphism flight search cards with refined blur. Trust-forward design with generous breathing room. Signature detail: gold accent line under primary CTAs.

## Color Palette

| Token | OKLCH | Role |
| --- | --- | --- |
| background | 0.08 0.01 255 | Deep navy night — aviation foundation |
| foreground | 0.98 0.002 60 | Pure white — premium contrast |
| card | 0.15 0.012 250 | Dark blue — elevated surfaces |
| primary | 0.22 0.08 250 | Steel blue — secondary accents |
| secondary | 0.72 0.22 50 | Sunset gold — primary CTA, luxury |
| accent | 0.85 0.12 70 | Champagne — premium highlights |
| destructive | 0.52 0.24 25 | Deep red — errors, cancellations |

## Typography
- Display: Fraunces (serif) — editorial aviation elegance, tracking -0.04em
- Body: General Sans (sans-serif) — clean, legible, professional
- Mono: Geist Mono — technical details
- Scale: h1 text-4xl/5xl bold tracking-tight, h2 text-3xl bold, h3 text-lg semibold, body text-base leading-relaxed

## Structural Zones

| Zone | Background | Border | Notes |
| --- | --- | --- | --- |
| Header | bg-card | border-b border-secondary/20 | TRIPNEX logo, nav, account |
| Hero | bg-background | — | Flight search card, headline, hero image |
| Services | bg-background | — | 4 booking cards grid (flights, hotels, packages, corporate) |
| Plan Journey | bg-background | — | Flight/hotel filter cards, search results placeholder |
| Trust | bg-muted/10 | border-t border-secondary/15 | Badges, partner logos, testimonials |
| Footer | bg-card | border-t border-secondary/10 | Contact, links, tagline |

## Component Patterns
- Buttons: bg-secondary with smooth hover, text-secondary-foreground, 0.75rem padding
- Cards: aviation-card class (backdrop-blur-12px, border gold/25%, shadow-card)
- Flight search: flight-search-box (gradient bg, gold border, glass effect)
- Headings: heading-display (Fraunces, -0.04em tracking)
- Trust badges: trust-badge class (muted bg, gold border)

## Motion
Smooth fade-in-up (0.6s ease-out), fade-in-left/right (0.6s), scale-in (0.5s). Button hover: 0.3s cubic-bezier(0.4, 0, 0.2, 1). No bounce — refined, controlled motion.

## Spacing & Rhythm
Generous luxury spacing: 4rem section padding desktop, 2.5rem mobile. Card internals: 2rem. Gold dividers with 2rem margins. Line-height 1.8 body, 1.2 display.

## Constraints
- Navy + gold only — no secondary colors
- Maximize trust through clarity, spacing, typography
- Glass cards for premium feel, not novelty
- Border-radius: 0.5rem (refined, professional)
- Shadows: layered for depth, never neon

## Signature Detail
Deep navy background with warm sunset gold CTAs and champagne highlights. Glass-morphism flight search creates premium, trustworthy booking interface. Refined serif headlines and generous spacing signal first-class travel brand.
