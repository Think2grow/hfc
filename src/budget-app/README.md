# Budget App (Embeddable, Privacy-First)

A modern, privacy-first, browser-based budgeting app designed for embeddability and performance. No sign-up, no tracking, no bank linking. All data is stored locally in the browser.

## Features
- Create, edit, and save multiple monthly budgets
- Real-time calculations and live summary panel
- 50/30/20 rule guidance and visualizations
- Deficit helper and simple financial benchmarks
- Export to PDF and Excel (.xlsx)
- Import/export JSON for backup
- Works offline after initial load
- Accessible and mobile-friendly
- Designed for embedding in existing sites

## Tech Stack
- Svelte (SPA, embeddable)
- TypeScript
- jsPDF, xlsx (for exports)

## Usage
1. Add the `budget.astro` page to your site.
2. The app will mount in the `#budget-app-root` div.
3. All calculations and data storage are local to the browser.

## Customization
- Accent color: #4d648e
- Modern, motivating UI with mountain motif

## Development
- All source code is in `src/budget-app/`
- To extend, add new Svelte components or update logic in the TypeScript modules

## License
MIT
