# Fair Value — Project Structure

## Expected Layout

```
/src
├── app/                    # Next.js App Router
│   ├── (public)/           # Public routes (home, inventory, events, how-it-works)
│   ├── (auth)/             # Login, register pages
│   ├── (buyer)/            # Buyer dashboard, watchlist, offers, profile, verification, chat
│   ├── (dealer)/           # Dealer dashboard, vehicles, documents, leads, chat
│   └── (admin)/            # Admin dashboard, users, dealers, vehicles, events, offers, leads, content, settings, audit
├── components/             # Reusable UI components
│   ├── ui/                 # Design system primitives (Button, Input, Card, Badge, Modal, etc.)
│   └── shared/             # Domain components (VehicleCard, Gallery, Chat, Navigation, etc.)
├── data/                   # Centralized mock data (users, vehicles, dealers, events, offers, leads, messages)
├── types/                  # TypeScript interfaces for all entities
├── lib/                    # Utilities (Image Provider, lead scoring, helpers)
├── hooks/                  # Custom React hooks
└── styles/                 # Global styles and Tailwind config extensions
```

## Routing Conventions

- Route groups `(public)`, `(auth)`, `(buyer)`, `(dealer)`, `(admin)` segment by role/context
- Navigation adapts based on auth state and user role
- Admin uses sidebar navigation; buyer/dealer/public use top navigation bar

## Data Layer

- All mock data is centralized in `/src/data/` — one file per entity type
- No API calls; components import data directly or via helper functions
- State changes are in-memory only (localStorage for session continuity)

## Component Guidelines

- Design system primitives live in `components/ui/`
- Domain-specific composites (VehicleCard, Gallery, Hero) live in `components/shared/`
- Components should be reusable across roles where applicable
- Image URLs are resolved exclusively through the Image Provider utility in `/src/lib/`
