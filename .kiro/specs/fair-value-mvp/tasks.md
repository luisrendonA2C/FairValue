# Implementation Plan: Fair Value MVP

## Overview

This plan implements a frontend-only MVP prototype for the Fair Value premium vehicle offers/auction platform using Next.js App Router, TypeScript, React, and Tailwind CSS. The implementation follows a bottom-up approach: foundational types and data first, then design system primitives, shared domain components, utility libraries, hooks, and finally page-level route implementations for each role (Public, Auth, Buyer, Dealer, Admin). All data is mocked and centralized.

### Design Direction — Premium & Luxury

- **Aesthetic**: Glassmorphism (frosted glass panels), vivid accents, generous whitespace, luxury automotive feel
- **Color Palette**: Navy #00335E, White #FFFFFF, Forest #3E442B, Sage #6A7062, Amber #ECA72C
- **Components**: Glass cards, floating labels, glow effects, smooth animations, premium typography (Inter/Montserrat)
- **Images**: Real high-quality stock vehicle photos (Unsplash), Costa Rica location imagery
- **Inspiration**: Copart's functional layout (sidebar filters, vehicle grids, dashboards) combined with a SaaS-premium luxury visual identity
- **Location**: Costa Rica — hero images and "Operando desde Costa Rica" branding panel on landing page

## Tasks

- [x] 1. Set up project structure, types, and mock data
  - [x] 1.1 Initialize Next.js project with App Router, TypeScript, Tailwind CSS, and create directory structure
    - Create `/src/app/` with route groups: `(public)`, `(auth)`, `(buyer)`, `(dealer)`, `(admin)`
    - Create `/src/components/ui/`, `/src/components/shared/`
    - Create `/src/data/`, `/src/types/`, `/src/lib/`, `/src/hooks/`, `/src/styles/`
    - Create `/public/images/` for static assets (hero images, Costa Rica dealership photo, branding)
    - Configure `tailwind.config.ts` with UPDATED premium color palette:
      - Primary navy: #00335E (deep blue — headers, nav, primary backgrounds)
      - White: #FFFFFF (cards, text on dark, clean backgrounds)
      - Forest: #3E442B (dark olive green — accents, secondary panels)
      - Sage: #6A7062 (gray-green — muted text, borders, subtle backgrounds)
      - Amber/Gold: #ECA72C (CTA buttons, highlights, active states, premium accents)
    - Configure spacing scale (4px grid) and premium typography scale (Inter/Montserrat font family)
    - Configure glassmorphism utility classes: `backdrop-blur-md`, `bg-white/10`, `border border-white/20`, `shadow-xl`
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 30.1_

  - [x] 1.2 Define all TypeScript interfaces in `/src/types/`
    - Create `user.ts`, `vehicle.ts`, `dealer.ts`, `event.ts`, `offer.ts`, `lead.ts`, `message.ts`, `scoring.ts`
    - Each interface must include all fields specified in the design data models section
    - Export all types from a barrel `index.ts`
    - _Requirements: 30.2_

  - [x] 1.3 Create centralized mock data in `/src/data/`
    - Create `users.ts` (minimum 8 buyers + dealer users + admin), `vehicles.ts` (minimum 12), `dealers.ts` (minimum 4), `events.ts` (minimum 3), `offers.ts` (minimum 20), `leads.ts` (minimum 10), `messages.ts`
    - All arrays must be typed and conform to interfaces
    - Include vehicles with varying statuses, events with varying statuses, leads with varying scores/levels
    - _Requirements: 30.1, 30.6, 30.7_

  - [x] 1.4 Implement Image Provider utility in `/src/lib/imageProvider.ts`
    - Implement `getImageUrl(entityType, entityId, index?)`, `getImageUrls(entityType, entityId)`, `getFallbackUrl(entityType)`
    - Use professional vehicle stock images from Unsplash API (`https://source.unsplash.com`) for luxury/premium car photos:
      - Map vehicle IDs to curated Unsplash URLs by car type (SUV, sedan, coupe, truck, etc.)
      - Use search queries like "luxury sedan", "premium SUV", "sports car showroom" for realistic results
      - Alternative: use `/public/images/vehicles/` directory with downloaded high-res stock photos
    - Include Costa Rica dealership hero image (provided by client) in `/public/images/hero-costa-rica.jpg`
    - Return fallback URL for unknown entity IDs (never undefined/null/empty) — fallback should be a stylish dark gradient placeholder with Fair Value logo
    - _Requirements: 30.3, 30.4, 30.5_

  - [x] 1.5 Implement Lead Scoring functions in `/src/lib/leadScoring.ts`
    - Implement `calculateLeadScore(input, weights?)` returning score, level, and reasons
    - Implement sub-score functions: `calculateOfferAmountSubScore`, `calculateVerificationSubScore`, `calculateProfileSubScore`, `calculateTimingSubScore`
    - Implement `getLeadLevel(score)` with ranges: Cold 0-39, Medium 40-59, Hot 60-79, Priority 80-100
    - Apply default weights: offer 40, verification 25, profile 20, timing 15
    - Populate reasons array based on profile state
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.7_

  - [x]* 1.6 Write property tests for Lead Scoring (Properties 12, 16, 17, 18)
    - **Property 12: Lead score level assignment** — verify getLeadLevel maps score ranges correctly
    - **Property 16: Scoring weights validation** — verify weights accepted iff all 0-100 and sum=100
    - **Property 17: Lead score calculation correctness** — verify weighted sum clamped 0-100 with correct level
    - **Property 18: Scoring reasons correspond to profile state** — verify reasons array matches profile flags
    - **Validates: Requirements 28.1, 28.2, 28.3, 28.4, 27.3, 27.4**

  - [x]* 1.7 Write property test for Image Provider (Property 21)
    - **Property 21: Image Provider fallback** — verify returns valid string URL for any entity type/ID, never undefined/null/empty
    - **Validates: Requirements 30.3, 30.4, 30.5**

- [x] 2. Implement design system primitives (`components/ui/`) — Premium Glassmorphism Design
  - [x] 2.1 Create Button component with variants (primary, secondary, outline, ghost, glass)
    - Props: variant, size, disabled, loading, icon, onClick
    - Primary: solid amber (#ECA72C) background with white text, hover darkens
    - Secondary: navy (#00335E) background with white text
    - Glass: glassmorphism effect (backdrop-blur-md, bg-white/10, border-white/20)
    - Apply design tokens: border-radius 8-16px, transitions 200-300ms, subtle glow shadows on hover
    - _Requirements: 2.4, 2.5_

  - [x] 2.2 Create form components: Input, Select — with premium floating labels
    - Input: text, email, password, number, tel types with floating label animation, placeholder, error, maxLength
    - Style: transparent/glass backgrounds on dark panels, solid white on light panels, amber focus ring
    - Select: single-select with dropdown animation, glass panel dropdown on dark backgrounds
    - _Requirements: 2.4_

  - [x] 2.3 Create Card, Badge, Modal, and Tooltip components — glassmorphism variants
    - Card: default, elevated, outlined, **glass** variants
      - Glass card: backdrop-blur-xl, bg-white/5 or bg-navy/80, border border-white/10, rounded-2xl
      - Elevated: shadow-2xl with subtle ambient light effect
    - Badge: status, level, count variants with vivid color-coded styles (amber=active, navy=scheduled, sage=closed)
    - Modal: glassmorphism overlay with backdrop-blur-sm on background, rounded-2xl panel
    - Tooltip: glass panel with subtle shadow
    - _Requirements: 2.4, 2.5, 6.2_

  - [x] 2.4 Create Tabs, Table, Avatar, Skeleton, and ProgressBar components
    - Tabs: glass-style tab bar with amber active indicator and smooth slide animation
    - Table: alternating row transparency, glass header row, hover highlight with amber-left-border
    - Avatar: image/initials variant with gradient ring border (navy-to-amber)
    - Skeleton: animated shimmer effect with glass-like appearance
    - ProgressBar: gradient fill (navy to amber), glass track background
    - _Requirements: 2.4, 31.3_

  - [x] 2.5 Create GlassPanel and premium layout components
    - GlassPanel: reusable glassmorphism container (backdrop-blur, semi-transparent bg, glow border)
    - StatCard: KPI card with glass background, large number, label, subtle icon, gradient accent
    - SectionDivider: elegant divider with gradient line and optional centered label
    - GradientBackground: full-page gradient utility (navy-to-forest, navy-to-dark)
    - _Requirements: 2.4, 2.5_

  - [x]* 2.6 Write unit tests for design system primitives
    - Test all variants render correctly
    - Test interactive states (hover, focus, disabled)
    - Test responsive behavior
    - _Requirements: 2.4, 2.5_

- [x] 3. Implement shared domain components (`components/shared/`)
  - [x] 3.1 Create VehicleCard component
    - Display: high-quality vehicle image (16:9 from Image Provider — real stock car photos), title "[year] [make] [model]", price/starting bid, status badge with color coding, specs (mileage, fuel, transmission), favorite toggle icon with amber fill
    - Card style: rounded-2xl, subtle shadow, hover scale-up animation (transform scale 1.02), image zoom on hover
    - Glass overlay on image bottom for text readability on dark variant
    - Props: vehicle, onFavorite, isFavorited, showStatus, variant ("default" | "dark")
    - _Requirements: 4.7_

  - [x] 3.2 Create Gallery component
    - Display 1-20 images with left/right navigation, wrap from last to first
    - Show placeholder image when no images available
    - Props: images[], fallbackImage
    - _Requirements: 5.1, 5.9_

  - [x] 3.3 Create HeroSection, EventCard, CountdownTimer, and StepIndicator components
    - HeroSection: full-viewport hero with Costa Rica dealership photo as background (provided image), dark gradient overlay (navy to transparent), glassmorphism search bar, headline in white, amber CTA button
    - EventCard: glass card with event summary, countdown, status badge (amber glow for active), vehicle count
    - CountdownTimer: live countdown display from targetDate in days/hours/minutes, styled with mono font and glass background
    - StepIndicator: status progression visualization with steps[], currentStep, amber active dot with glow
    - _Requirements: 3.1, 6.1, 6.3, 15.5_

  - [x] 3.4 Create Navigation component (role-adaptive) — premium glass navigation
    - Public: sticky top navbar with glassmorphism on scroll (transparent → glass effect), Fair Value logo, amber CTA button
    - Buyer/Dealer: top navbar with glass background, breadcrumbs, role indicator badge
    - Admin: dark navy sidebar with amber active indicator, collapsed icon mode on tablet
    - Hamburger menu on mobile (<768px) with full-screen glass overlay
    - Role-based route display, smooth transitions between nav states
    - _Requirements: 1.8, 31.1_

  - [x] 3.5 Create FilterPanel, EmptyState, PrivacyNotice, and SkeletonPage components
    - FilterPanel: composable filter controls with values, onChange, onClear, active count
    - EmptyState: title, message, action CTA
    - PrivacyNotice: context-aware data protection disclosure ("offer" | "lead" | "vehicle")
    - SkeletonPage: page-level loading placeholder (grid, table, detail variants)
    - _Requirements: 4.6, 4.8, 5.5, 29.6, 31.3_

  - [x] 3.6 Create ChatThread and LeadRow components
    - ChatThread: message thread display with input/send, locked state with lock icon
    - LeadRow: lead table row with score, level badge, offer amount, action buttons (unlock, select, chat, export)
    - _Requirements: 13.1, 13.5, 17.2_

  - [x]* 3.7 Write property test for VehicleCard (Property 6)
    - **Property 6: VehicleCard renders all required fields** — verify all required fields present for any valid Vehicle
    - **Validates: Requirements 4.7**

- [x] 4. Implement custom hooks and context providers
  - [x] 4.1 Implement AuthContext and useAuth hook
    - Provide currentUser, role, isAuthenticated, login, logout, switchRole, register
    - Persist session (role, userId) in localStorage
    - Support role switching for demo purposes
    - _Requirements: 1.2, 8.4, 8.7_

  - [x] 4.2 Implement DataContext and useMockData hook
    - Provide vehicles, offers, leads, events, dealers, users with in-memory mutations
    - Implement addOffer, updateLeadStatus, updateEventStatus, addVehicle, updateVerificationStatus
    - No persistence across page reloads (localStorage only for session)
    - _Requirements: 1.3, 30.7_

  - [x] 4.3 Implement useWatchlist hook with localStorage persistence
    - Provide watchlist (vehicle IDs array), isFavorited(id), toggleFavorite(id)
    - Persist in localStorage for session continuity
    - Toggle twice returns to original state (idempotence)
    - _Requirements: 11.2, 11.3, 11.5_

  - [x] 4.4 Implement useFilters hook for reusable filter/sort/search logic
    - Accept items array and filter config
    - Provide filtered results, setFilter, setSearch (2+ chars), setSort, clearAll, activeCount
    - Case-insensitive partial matching for search
    - Support multiple filter criteria with AND logic
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [x] 4.5 Implement useChat hook for mock messaging
    - Provide messages[], sendMessage(text), isLocked
    - Pre-seed mock messages, append new messages with timestamp
    - Reject empty/whitespace-only messages
    - No persistence across page reloads
    - _Requirements: 13.2, 13.3, 13.4, 13.6_

  - [x]* 4.6 Write property tests for hooks (Properties 2, 3, 4, 5, 9, 10, 11)
    - **Property 2: Vehicle filter correctness** — every filtered vehicle satisfies all active criteria
    - **Property 3: Case-insensitive search matching** — search results contain query as substring
    - **Property 4: Sort ordering invariant** — consecutive pairs correctly ordered
    - **Property 5: Active filter count accuracy** — count equals non-default filter fields
    - **Property 9: Watchlist toggle idempotence** — toggle twice returns original state
    - **Property 10: Offer amount validation** — accepts 0.01–999,999,999.99 with ≤2 decimals
    - **Property 11: Chat message whitespace rejection** — rejects empty/whitespace, accepts valid
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.8, 11.2, 11.3, 12.2, 13.6**

  - [x]* 4.7 Write property test for pagination (Property 1)
    - **Property 1: Pagination invariant** — page P has min(24, N-(P-1)*24) items, no duplicates/missing across pages
    - **Validates: Requirements 4.1**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement public pages
  - [x] 6.1 Implement Home/Landing page at `/app/(public)/page.tsx`
    - Full-viewport HeroSection with Costa Rica dealership image background, dark navy gradient overlay, glassmorphism search bar centered, headline ("Fair Value — Premium Vehicle Marketplace"), subheadline (intermediary model text in white/sage), amber CTA to inventory
    - "How It Works" section with 5 sequential steps on glass cards against dark background
    - "Featured Vehicles" grid of 4-8 VehicleCards (with real car stock photos) on clean white section
    - "Upcoming Events" section with up to 3 EventCards with countdowns on dark section with glass panels
    - Trust/credibility section: 3+ stats in GlassPanel StatCards with amber accent numbers
    - "Costa Rica" panel: full-width image panel showcasing the Costa Rica location with overlay text "Operando desde Costa Rica" and brief location description, glass-effect text container
    - Dealer CTA section: split panel with gradient navy-to-forest background, amber button to dealer registration
    - Footer with navigation links, contact info, legal links, social icons on dark navy background
    - Intermediary disclaimer text in Hero and How It Works sections
    - **Design direction**: alternating dark/light sections, glassmorphism panels on dark sections, vivid amber accents, premium white-space, luxury aesthetic
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [x] 6.2 Implement Inventory/Catalog page at `/app/(public)/inventory/page.tsx`
    - Paginated vehicle grid (24 per page) showing active/upcoming vehicles with premium VehicleCards (real car photos)
    - FilterPanel in left sidebar (desktop) / collapsible top drawer (mobile): make, model, year range, price range, mileage range, fuel type, transmission, body type, location — glass panel on dark sidebar
    - Text search input (2+ chars, case-insensitive partial match on make/model/description) — prominent search bar at top
    - Sort options: price low-high/high-low, year newest/oldest, date added (default) — dropdown with glass style
    - Updates within 300ms without full page reload
    - Empty state with premium illustration + "Clear All Filters" amber button
    - Active filter summary: amber pill badges showing count and "Clear All" action
    - **Copart-inspired layout**: left filter sidebar + right vehicle grid, top bar with search/sort/view-toggle
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.8_

  - [x] 6.3 Implement Vehicle Detail page at `/app/(public)/vehicle/[id]/page.tsx`
    - Gallery component with vehicle images
    - Specifications panel (make, model, year, mileage, fuel, transmission, engine, color, VIN masked, body type)
    - Offer panel with highest offer, total offers, event status, time remaining countdown
    - Anonymous offer history (last 20 offers with amounts/timestamps, no identities)
    - Privacy notice about Buyer/Dealer data protection
    - "Similar Vehicles" section (up to 6 matching body type or make)
    - Offer button: enabled for verified buyers, redirects unauth visitors to login with return URL
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

  - [x] 6.4 Implement Events page at `/app/(public)/events/page.tsx`
    - Event list sorted by start date (active first, then scheduled, then closed/finished)
    - Color-coded status badges
    - Countdown timer for active events
    - Event detail view with vehicle grid
    - Timeline visualization of event lifecycle phases
    - Empty state when no events exist
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 6.5 Implement How It Works page at `/app/(public)/how-it-works/page.tsx`
    - 8 sequential numbered steps with labels and descriptions
    - Dedicated disclaimer section (intermediary model, external payment)
    - Two benefit sections: "For Buyers" and "For Dealers" with listed benefits
    - FAQ section with 5+ expandable/collapsible items
    - Visible statement that offers generate leads, not binding purchases
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. Implement authentication pages
  - [x] 7.1 Implement Login page at `/app/(auth)/login/page.tsx`
    - Full-viewport split layout: left side with Costa Rica/cars background image + dark overlay + Fair Value logo; right side with centered glass login form
    - Email input (max 254 chars), password input (max 128 chars) with floating labels
    - "Sign in with Google" mock button (glass variant)
    - Inline validation: required field messages on empty email/password (amber error highlight)
    - On valid submit: store mock session, redirect based on role (buyer/dealer/admin dashboard)
    - Mock login shortcut buttons for one-click access to each role dashboard (3 role cards with icons)
    - Premium design: glass form panel, amber submit button, navy background gradient on left
    - _Requirements: 8.1, 8.3, 8.4, 8.7, 8.8_

  - [x] 7.2 Implement Register page at `/app/(auth)/register/page.tsx`
    - Same split layout as login (Costa Rica image left, form right)
    - Name (max 100), email (max 254), phone (max 20), password (max 128) inputs with floating labels
    - "Sign up with Google" mock button (glass variant)
    - Terms acceptance checkbox with validation
    - On valid submit with terms accepted: store mock user, redirect to buyer dashboard
    - Validation messages for missing fields and unchecked terms
    - Premium: progress step indicator (1. Info → 2. Verify → 3. Done)
    - _Requirements: 8.2, 8.5, 8.6, 8.8_

  - [x]* 7.3 Write property test for role-based redirect (Property 7)
    - **Property 7: Role-based authentication redirect** — verify login redirects to correct dashboard per role
    - **Validates: Requirements 8.4**

- [x] 8. Implement Buyer pages
  - [x] 8.1 Implement Buyer Dashboard at `/app/(buyer)/buyer/dashboard/page.tsx`
    - Summary cards: active offers count, watchlist count, verification status, Lead_Score with level label, up to 3 upcoming events
    - Recent activity: 5 most recent actions with description and timestamp
    - _Requirements: 9.1, 9.2_

  - [x] 8.2 Implement Buyer Profile page at `/app/(buyer)/buyer/profile/page.tsx`
    - View/edit: name, email, phone, profile photo, budget range, preferred location, vehicle preferences
    - Mock save with success confirmation
    - Lead_Score display with numeric score, level label, color indicator, reasons list
    - Profile completion progress indicator with prompts for missing required fields
    - _Requirements: 9.3, 9.4, 9.5, 9.6_

  - [x] 8.3 Implement Buyer Verification page at `/app/(buyer)/buyer/verification/page.tsx`
    - Document upload areas: government ID (front/back), passport, or driver's license (JPEG/PNG/PDF, max 5MB)
    - Proof of address upload (utility bill, bank statement, gov correspondence, JPEG/PNG/PDF, max 5MB)
    - Verification status display (not_started → documents_uploaded → under_review → verified → rejected)
    - Auto-transition to "under_review" within 2 seconds after both docs uploaded
    - File validation: reject >5MB or wrong format with error message
    - Email/phone verification mock: 6-digit code input with verified indicator
    - Rejected state allows re-upload
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.8, 10.9_

  - [x]* 8.4 Write property test for file upload validation (Property 8)
    - **Property 8: File upload validation** — verify accepts valid files, rejects oversized/wrong format
    - **Validates: Requirements 10.9, 16.4**

  - [x] 8.5 Implement Buyer Watchlist page at `/app/(buyer)/buyer/watchlist/page.tsx`
    - Display all favorited vehicles as VehicleCards, ordered by most recently added
    - Favorite toggle works from any VehicleCard context (inventory, detail, event, watchlist)
    - Empty state with message and link to inventory
    - Persist in localStorage
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 8.6 Implement Buyer Offers page at `/app/(buyer)/buyer/offers/page.tsx`
    - Offer form on Vehicle Detail: numeric amount input, submit button (enabled only for verified buyers during active event)
    - Validate amount: 0.01–999,999,999.99, ≤2 decimals; inline error on failure
    - Success confirmation with vehicle name and amount
    - Offers list: vehicle name, amount, date, status (received/surpassed/in_review/selected/not_selected)
    - Disable form when event closed with "offer period ended" message
    - Disclaimer: offer ≠ binding purchase commitment
    - Empty state when no offers placed
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

  - [x] 8.7 Implement Buyer Chat page at `/app/(buyer)/buyer/chat/page.tsx`
    - Chat interface unlocked when buyer's lead is selected by dealer
    - Pre-seeded mock thread (2+ messages with sender, text, timestamp "MMM DD, YYYY HH:MM")
    - Text input (max 500 chars) with send button
    - Append sent messages with current mock timestamp, no page reload persistence
    - Locked state: lock icon + "awaiting Dealer selection" message, input/button disabled
    - Reject empty/whitespace-only messages
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement Dealer pages
  - [x] 10.1 Implement Dealer Dashboard at `/app/(dealer)/dealer/dashboard/page.tsx`
    - KPI summary cards: glass StatCards with amber accent numbers — active vehicles, total offers received, leads generated, leads selected, conversion rate %
    - Vehicle table: glass table with alternating transparency rows, up to 10 vehicles with status badge, offer count, event assignment
    - Chart placeholder: glass panel "Offers Analytics — Coming Soon" with animated chart icon
    - Recent leads ranking: top 5 by Lead_Score with colored level badge and offer amount, glass rows
    - Recent activity: 5 most recent events with timestamps on dark panel
    - Quick action buttons: amber outline buttons — Add Vehicle, View Leads, View Offers, Upload Documents
    - **Copart-inspired layout**: sidebar stats + main content grid, professional panel arrangement
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [x] 10.2 Implement Dealer Vehicles page at `/app/(dealer)/dealer/vehicles/page.tsx`
    - Vehicle list: thumbnail, title, status badge, offers count, views count (sorted by most recent)
    - "Add Vehicle" form: make, model, year, mileage, fuel type, transmission, price, description, images (up to 10, JPEG/PNG)
    - On valid submit: add to mock list with "pending_approval" status, success message
    - Validation: highlight invalid fields, preserve entered data
    - Vehicle status step indicator: draft → pending_approval → active → assigned_to_event → closed
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 10.3 Implement Dealer Documents page at `/app/(dealer)/dealer/documents/page.tsx`
    - Document list per vehicle: file name, upload date, type, processing status (uploaded/under_review/reviewed/approved)
    - Upload areas: vehicle title, inspection report, spec sheet, + 5 additional (PDF/PNG/JPG, max 10MB)
    - On valid upload: display file name with "uploaded" status
    - Reject >10MB or wrong format with error message
    - Status indicator badge per document
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 10.4 Implement Dealer Leads page at `/app/(dealer)/dealer/leads/page.tsx`
    - Leads table after Event_Close: lead ID, offer amount, level badge, Lead_Score, buyer budget, intent, location, verification, contact status, action buttons
    - Ranked by Lead_Score descending, offer amount as tiebreaker
    - Lead levels color-coded: Cold/Medium/Hot/Priority
    - Unlock action: reveal buyer info (name, phone, email), enable chat (max 10 unlocks per vehicle/event)
    - Lead status transitions: selected, contacted, appointment_scheduled, not_interested, closed_externally
    - "Export Leads" button simulating CSV download
    - Locked state during active event: message + disabled actions
    - Empty state when no leads generated
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9_

  - [x] 10.5 Implement Dealer Chat page at `/app/(dealer)/dealer/chat/page.tsx`
    - Chat interface per selected lead (buyer-dealer pair)
    - Display buyer's unlocked profile info (name, phone) in header
    - Mock message thread with sender, text, timestamp
    - Text input and send button; append messages with mock timestamp
    - Locked state when lead not yet selected
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [x]* 10.6 Write property test for lead ranking (Property 13)
    - **Property 13: Lead ranking order** — verify descending score with offer amount as tiebreaker
    - **Validates: Requirements 17.3**

- [x] 11. Implement Admin pages (Part 1: Dashboard, Users, Dealers, Vehicles)
  - [x] 11.1 Implement Admin Dashboard at `/app/(admin)/admin/dashboard/page.tsx`
    - Summary cards: glass StatCards with large amber numbers — total users, dealers, vehicles, active events, offers, leads
    - Recent platform activity feed: 10 most recent actions on glass panel with description, actor, timestamp
    - Quick action buttons: amber primary buttons — Create Event, Approve Dealer, Manage Vehicles, Review Leads
    - Mock analytics section: glass chart placeholder panels "Analytics — Coming Soon" with gradient borders
    - Review alerts: amber warning badges — pending dealer approvals, vehicle approvals, document reviews, events approaching close
    - **Layout**: full sidebar navigation (navy dark), main content with white/light background, panels with subtle glass effects
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

  - [x] 11.2 Implement Admin Users page at `/app/(admin)/admin/users/page.tsx`
    - Users table: name, email, role, registration date, verification status, active status (20 per page, paginated)
    - Filters: role, verification status, active status (AND logic)
    - Search: partial match on name/email (2+ chars)
    - User detail panel: full info + activate/deactivate/verify action buttons
    - Toggle active status and verify user via buttons
    - Empty state when no users match filters
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

  - [x]* 11.3 Write property test for user filter AND logic (Property 14)
    - **Property 14: User filter AND logic** — every filtered user satisfies all active conditions
    - **Validates: Requirements 20.2**

  - [x] 11.4 Implement Admin Dealers page at `/app/(admin)/admin/dealers/page.tsx`
    - Dealers table: business name, email, phone, registration date, approval status, vehicle count, lead count (20 per page)
    - Approve/Reject buttons for pending_approval dealers
    - Suspend button (with confirmation dialog) for approved dealers
    - On suspend: hide dealer's vehicles from public inventory
    - "Create Dealer" form with validation
    - Success notifications within 1 second
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8_

  - [x] 11.5 Implement Admin Vehicles page at `/app/(admin)/admin/vehicles/page.tsx`
    - Vehicles table: thumbnail, title, dealer name, status, event assignment, submission date (20 per page)
    - Filters: status, dealer, event, make/model (immediate update)
    - Approve/Reject actions for pending vehicles
    - Create/edit vehicle form (make, model, year, mileage, price, description, status, photos 1-15)
    - Assign vehicles to events via dropdown/modal
    - Update photos (add/remove, prevent removing last photo)
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8_

- [x] 12. Implement Admin pages (Part 2: Documents, Events, Offers, Leads)
  - [x] 12.1 Implement Admin Documents page at `/app/(admin)/admin/documents/page.tsx`
    - Document list: dealer name, vehicle, document type, upload date, review status (20 per page)
    - Approve/Reject actions for pending documents
    - "Generate Vehicle Specs from Document" action: pre-populate vehicle form with mock values within 2 seconds
    - Filter by review status and dealer name
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

  - [x] 12.2 Implement Admin Events page at `/app/(admin)/admin/events/page.tsx`
    - Events table: name, start/end dates, status, vehicle count, offer count (20 per page, sorted by start date desc)
    - "Create Event" form: name (max 100), description (max 500), start date, end date, vehicle selection
    - Validation: end > start, start not in past, inline errors
    - Edit event details while status is "scheduled"
    - Sequential status transitions only: scheduled → active → closed → in_review → finished
    - Associate/disassociate vehicles (max 50) while scheduled/active
    - On close: run calculateLeadScore, show summary (offers scored, leads generated)
    - On finish: finalize leads, display closing prices, prevent further changes
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8, 24.9_

  - [x]* 12.3 Write property test for event status transitions (Property 15)
    - **Property 15: Event status transition validity** — only next sequential status allowed, others rejected
    - **Validates: Requirements 24.6**

  - [x] 12.4 Implement Admin Offers page at `/app/(admin)/admin/offers/page.tsx`
    - Offers table: buyer identifier (anonymized during active events, name after closed), vehicle, amount, date, event, dealer, Lead_Score, status
    - Filters: event, vehicle, user, dealer, amount range, score range, status
    - Audit log section: offer state transitions in reverse chronological order (prev status, new status, timestamp, actor)
    - _Requirements: 25.1, 25.2, 25.3_

  - [x] 12.5 Implement Admin Leads page at `/app/(admin)/admin/leads/page.tsx`
    - Leads table: buyer name, vehicle, dealer, Lead_Score, lead level, offer amount, Lead_Status, release status, action buttons (sorted by score desc)
    - "Release Leads" action: update all event leads from unreleased → released, show to dealer, success confirmation
    - "Generate Leads" action: run calculateLeadScore, create lead entries with status "generated"
    - Warning when regenerating existing leads (require confirmation)
    - Filters: event, vehicle, dealer, score range, level, Lead_Status
    - _Requirements: 25.4, 25.5, 25.6, 25.7, 25.8_

- [x] 13. Implement Admin pages (Part 3: Content, Settings) and Privacy model
  - [x] 13.1 Implement Admin Content page at `/app/(admin)/admin/content/page.tsx`
    - Editable fields: homepage headline (max 100), subheadline (max 200), hero banner URL, featured vehicle IDs (up to 8), How It Works steps (5 pairs)
    - Catalog page title (max 100), event descriptions (max 500 each), promotional banner text (max 200) + toggle
    - Save changes: update mock state, success confirmation, reflect on public pages in session
    - Character count indicator, prevent submission when exceeded
    - _Requirements: 26.1, 26.2, 26.3, 26.4_

  - [x] 13.2 Implement Admin Settings page at `/app/(admin)/admin/settings/page.tsx`
    - Platform settings: name (max 100), contact email (email format), notification toggles, operational params (event duration, max offers/buyer/event, lead unlock limit)
    - Scoring configuration: 4 weight inputs (0-100 each), validate sum = 100
    - Inline error when sum ≠ 100, disable save
    - On save: persist in memory, success confirmation within 1 second
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

  - [x] 13.3 Implement Admin Audit Log page at `/app/(admin)/admin/settings/audit/page.tsx`
    - Display 20 most recent entries: admin actions, registrations, approvals, event transitions
    - Each entry: timestamp (YYYY-MM-DD HH:mm), description, actor
    - Sorted descending chronological
    - _Requirements: 27.6_

  - [x] 13.4 Implement Privacy and Data Unlock model across components
    - During active/upcoming events: anonymize buyers as "Buyer #N", hide dealer identity as "Verified Dealer"
    - Dealer views leads before selection: show score/amount/badge without buyer PII
    - On lead selection: unlock buyer info (name, email, phone) within 2 seconds; reveal dealer to buyer
    - Privacy notices on Vehicle Detail, offer forms, lead pages
    - Locked data: blur/overlay + lock icons; Unlocked: full visibility + unlock icons
    - Maintain anonymization for closed events where leads not yet selected
    - Handle duplicate unlock gracefully (show existing data)
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7, 29.8, 29.9_

  - [x]* 13.5 Write property tests for privacy model (Properties 19, 20)
    - **Property 19: Privacy anonymization invariant** — PII never exposed during active/upcoming events
    - **Property 20: Privacy unlock reveals data** — selected leads reveal full contact info
    - **Validates: Requirements 29.1, 29.2, 29.3, 29.4, 29.5, 29.8**

- [x] 14. Implement responsive design, visual states, and skeleton loaders
  - [x] 14.1 Implement responsive layouts across all pages
    - Desktop (1280px+): full multi-column layouts as primary design target, generous whitespace, large hero images
    - Tablet (768-1279px): reduced columns (max 2), same element ordering, glassmorphism maintained
    - Mobile (<768px): single-column stacking, hamburger menu, no horizontal scroll, glass panels stack vertically
    - Ensure all interactive elements reachable, text readable without zooming
    - Premium responsive behavior: image-heavy sections remain impactful on all breakpoints
    - _Requirements: 2.6, 2.7, 2.8, 31.1, 31.2_

  - [x] 14.2 Implement skeleton loading and visual state system
    - Skeleton loaders: glass-shimmer animation (amber gradient sweep) on page transitions, 300ms min, 1500ms max
    - Visual states: loading (glass skeleton shapes), empty (premium illustration + message), locked (frosted glass blur + lock icon), unlocked (full visibility + glow unlock icon), active (amber badge with glow), closed (sage badge), verified (checkmark badge with amber ring)
    - Hover effects: scale transforms, amber glow on buttons, underline animations on links
    - Focus indicators: 2px amber outline offset, visible on all interactive elements
    - CSS transitions: smooth 200-300ms on all state changes
    - _Requirements: 31.3, 31.4, 31.5_

  - [x] 14.3 Implement graceful mock failure states
    - For actions requiring real services (payment, OCR, AI): display styled glass modal with amber icon
    - Show simulated success response with premium animation (checkmark with confetti or pulse)
    - No JavaScript errors, console warnings, or broken UI
    - _Requirements: 1.9_

- [x] 15. Integration, wiring, and navigation completeness
  - [x] 15.1 Wire all route group layouts with role-adaptive navigation
    - Public layout: top navbar + footer
    - Auth layout: minimal centered
    - Buyer layout: top navbar + breadcrumbs
    - Dealer layout: top navbar + breadcrumbs
    - Admin layout: sidebar + top bar
    - Ensure all navigation links resolve to valid routes (no dead-end routes)
    - _Requirements: 1.8, 31.1_

  - [x] 15.2 Wire AuthContext through the app and implement route protection
    - Wrap app with AuthContext and DataContext providers
    - Buyer/Dealer/Admin routes require mock auth check
    - Unauthorized access redirects to login
    - Role switching updates navigation and accessible routes
    - _Requirements: 1.2, 8.4_

  - [x] 15.3 Wire DataContext with mock data and mutations across all pages
    - Connect all pages to centralized DataContext for reads and mutations
    - Ensure offer placement updates offer lists in all views
    - Ensure lead status changes propagate to dealer/admin/buyer views
    - Ensure vehicle status changes reflect across inventory, admin, and dealer pages
    - Admin verification approval updates buyer verification status
    - _Requirements: 1.3, 10.5, 30.7_

  - [x] 15.4 Wire Lead Scoring integration with Event close flow
    - When admin transitions event to "closed": run calculateLeadScore on all event offers
    - Generate lead entries with calculated scores and levels
    - Display scoring results with color-coded progress bars
    - Connect scoring weights from Admin Settings
    - _Requirements: 24.8, 28.1, 28.5, 28.6_

  - [x]* 15.5 Write integration tests for navigation and route accessibility
    - Verify all routes in each route group render without errors
    - Verify navigation links resolve to valid routes
    - Verify role switching updates navigation
    - Verify mock data loads on initial render
    - _Requirements: 1.8_

- [x] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in the design document
- Unit tests validate specific examples and edge cases
- The project uses Next.js App Router with TypeScript, React, and Tailwind CSS
- All data is mocked — no backend, no real auth, no real payments
- fast-check library is used for property-based testing
- Jest + React Testing Library for unit and integration tests

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "1.4", "1.5"] },
    { "id": 3, "tasks": ["1.6", "1.7", "2.1", "2.2"] },
    { "id": 4, "tasks": ["2.3", "2.4"] },
    { "id": 5, "tasks": ["2.5", "3.1", "3.2", "3.3"] },
    { "id": 6, "tasks": ["3.4", "3.5", "3.6"] },
    { "id": 7, "tasks": ["3.7", "4.1", "4.2"] },
    { "id": 8, "tasks": ["4.3", "4.4", "4.5"] },
    { "id": 9, "tasks": ["4.6", "4.7"] },
    { "id": 10, "tasks": ["6.1", "6.2", "6.5"] },
    { "id": 11, "tasks": ["6.3", "6.4", "7.1", "7.2"] },
    { "id": 12, "tasks": ["7.3", "8.1", "8.2"] },
    { "id": 13, "tasks": ["8.3", "8.5", "8.6"] },
    { "id": 14, "tasks": ["8.4", "8.7"] },
    { "id": 15, "tasks": ["10.1", "10.2", "10.3"] },
    { "id": 16, "tasks": ["10.4", "10.5", "10.6"] },
    { "id": 17, "tasks": ["11.1", "11.2"] },
    { "id": 18, "tasks": ["11.3", "11.4", "11.5"] },
    { "id": 19, "tasks": ["12.1", "12.2"] },
    { "id": 20, "tasks": ["12.3", "12.4", "12.5"] },
    { "id": 21, "tasks": ["13.1", "13.2", "13.3"] },
    { "id": 22, "tasks": ["13.4", "13.5"] },
    { "id": 23, "tasks": ["14.1", "14.2", "14.3"] },
    { "id": 24, "tasks": ["15.1", "15.2"] },
    { "id": 25, "tasks": ["15.3", "15.4"] },
    { "id": 26, "tasks": ["15.5"] }
  ]
}
```
