# Fair Value — Product Overview

Fair Value is a **frontend-only MVP prototype** for a premium vehicle offers/auction platform. It acts as an intermediary between buyers and verified dealerships ("patios"), facilitating leads and connections — not direct vehicle sales or payments.

## Core Concept

- Dealers publish vehicles → Fair Value approves → Buyers explore and make offers during timed Events → Event closes → Leads are scored and ranked → Dealer selects leads → Buyer info unlocked → External negotiation and purchase happen outside the platform.

## Key Principles

- **Intermediary model**: Fair Value never processes payments or sales. It generates qualified leads.
- **Privacy-first**: Buyer and Dealer identities are hidden during active events. Data unlocks only after lead selection.
- **Three perspectives**: Buyer/Bidder, Dealer/Car Lot, and Fair Value Admin — each with dedicated dashboards.
- **Presentation-ready**: Everything is mocked (auth, data, chat, scoring). The goal is a navigable, polished demo for client presentation and concept validation.
- **Premium aesthetic**: Distinctly luxury, modern, and trustworthy — NOT utilitarian like Copart. Think SaaS-premium dashboard.

## What Is NOT Real

- No backend server, database, or API integrations
- No real authentication, OAuth, or session management
- No real payments, checkout, or ecommerce
- No real WebSockets, chat persistence, or real-time updates
- No real OCR, KYC, document processing, or AI/ML services
- Data is mocked in-memory; localStorage acceptable for session continuity only
