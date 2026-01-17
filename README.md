# Highline Financial Coaching

A modern, conversion-focused financial coaching website for Matt Dehart.

## Tech Stack
- Astro (static/SSR)
- TypeScript (strict)
- Tailwind CSS
- React (for islands only)
- pnpm

## Structure
- public/ (assets, robots.txt, sitemap.xml)
- src/components/ (Button, SectionHeading, Card, TestimonialCard, FAQItem, PricingCard)
- src/layouts/BaseLayout.astro
- src/pages/ (index.astro, services.astro, about.astro, resources/index.astro, resources/[slug].md, contact.astro)
- src/styles/global.css
- astro.config.mjs
- tailwind.config.ts
- tsconfig.json

## Setup

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Branding
- Logo color: #4d648e
- Coach: Matt Dehart
- Calendly: https://go.highlinefinancialcoaching.com/widget/booking/IzVvZ4MhTaD8eZiRlBrk

## Notes
- Pricing: "Starting at $X" (no explicit pricing)
- Testimonials: Realistic placeholders
- Logo: Text-based placeholder
- All content is placeholder and should be replaced as needed.
