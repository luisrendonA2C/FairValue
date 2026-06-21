# Fair Value — Tech Stack & Build System

## Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Data**: Centralized mock data (static JSON/TS files, in-memory state)
- **Auth**: Simulated via local state / localStorage (no real providers)

## Design System

- Color tokens: deep navy (#1B2A4A), white (#FFFFFF), carbon gray (#2D2D2D), light gray (#F5F5F5), gold accent (#C9A84C), silver accent (#A8A8A8), emerald green (#2E8B57)
- Typography: sans-serif family with defined H1-H4, body, caption, label scales
- Spacing: 4px base grid system
- Components: Button (primary/secondary/outline/ghost), Input, Select, Card, Badge, Modal, Tabs, Table, Avatar, Skeleton, Tooltip, Progress Bar
- Style: rounded corners, subtle shadows, smooth transitions

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Conventions

- Use Next.js App Router with route groups for public, buyer, dealer, and admin sections
- All mock data lives in `/src/data/` with separate files per entity
- TypeScript interfaces for all entities go in a shared types directory
- Use a centralized Image Provider utility — never hardcode image URLs in components
- Responsive breakpoints: mobile (<768px), tablet (768-1279px), desktop (1280px+)
- Prioritize desktop fidelity; maintain usable mobile layouts
- Display skeleton loaders on page transitions to simulate data fetching
