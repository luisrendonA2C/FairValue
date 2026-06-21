# Requirements Document

## Introduction

Fair Value is a frontend-only MVP navigable prototype for a premium vehicle offers/auction platform. Fair Value acts as an intermediary between buyers and verified dealerships ("patios"), facilitating leads and connections without processing direct vehicle sales or payments. The platform does NOT process checkout, ecommerce transactions, real authentication, real databases, real WebSockets, real OCR/KYC, real AI, or real chat — everything is mocked for client presentation and concept validation.

The platform supports three user perspectives: Buyer/Bidder, Dealer/Car Lot, and Fair Value Admin. Built with Next.js, React, TypeScript, and Tailwind CSS, the MVP uses centralized mock data and reusable components. The public-facing experience is functionally inspired by Copart's marketplace structure (inventory, search, filters, vehicle detail, events, watchlist, offers) but with a distinctly premium, luxury, modern, and trustworthy visual identity unique to Fair Value.

## Glossary

- **Fair_Value_Platform**: The frontend-only MVP application serving as an intermediary vehicle offers/auction platform
- **Buyer**: A registered user who explores vehicles, makes offers, and receives leads after event close
- **Dealer**: A verified dealership or car lot ("patio") that publishes vehicles and receives qualified leads
- **Admin**: A Fair Value administrator who manages the full platform operation including dealers, vehicles, events, and leads
- **Vehicle**: A car listing published by a Dealer and approved by Admin for inclusion in the catalog
- **Offer**: A monetary bid placed by a Buyer on a Vehicle during an active Event
- **Event**: A time-bounded auction/offer period during which Buyers can place offers on associated Vehicles, progressing through statuses: scheduled, active, closed, in_review, finished
- **Lead**: A qualified buyer connection generated after Event close, ranked by offer amount and buyer score
- **Lead_Score**: A calculated qualification metric for ranking leads using the calculateLeadScore mock function
- **Lead_Level**: The qualitative classification of a lead based on Lead_Score: Cold (0-39), Medium (40-59), Hot (60-79), or Priority (80-100)
- **Lead_Status**: The progression state of a lead: generated, released, selected, contacted, appointment_scheduled, not_interested, closed_externally
- **Watchlist**: A Buyer's collection of saved/favorited Vehicles for quick access
- **Verification**: The identity document upload process a Buyer completes to become eligible for placing offers
- **Privacy_Model**: The data protection mechanism that keeps Buyer personal information hidden from Dealers AND Dealer identity hidden from Buyers until after Event close and lead selection
- **Mock_Data**: Centralized static JSON data simulating backend responses for all platform entities
- **Design_System**: The collection of reusable UI components, color tokens, typography, and spacing rules
- **Vehicle_Card**: A reusable component displaying vehicle thumbnail, title, price, status, and key specs
- **Gallery**: The image carousel/viewer component on the Vehicle Detail page
- **Hero_Section**: The prominent landing area on the Home page with search and value proposition
- **Dashboard**: A role-specific overview page showing relevant metrics, recent activity, and quick actions
- **Chat**: The post-match mock messaging interface enabling communication between selected Buyer and Dealer
- **Event_Close**: The moment when an Event's offer period ends and the system identifies best offers/leads
- **Image_Provider**: A centralized utility that maps vehicle IDs to placeholder image URLs without hardcoding URLs in components
- **AI_Autofill**: A future conceptual feature (not implemented in MVP) showing mock UI for AI-assisted vehicle data extraction from documents

## Requirements

### Requirement 1: MVP Scope and Technical Constraints

**User Story:** As a developer, I want clear boundaries on what is mocked vs real, so that I build a presentation-ready prototype without unnecessary backend dependencies.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL operate entirely as a frontend application with no real backend server, database, or API integrations
2. THE Fair_Value_Platform SHALL simulate authentication using local state or localStorage without real auth providers or session management, supporting at minimum three switchable roles: Buyer, Dealer, and Admin
3. THE Fair_Value_Platform SHALL simulate all data operations (create, read, update, delete) for platform entities using in-memory mock state without persistence across page reloads (localStorage acceptable for session continuity only)
4. THE Fair_Value_Platform SHALL NOT implement real payment processing, checkout flows, or ecommerce transactions
5. THE Fair_Value_Platform SHALL NOT implement real WebSocket connections for chat or real-time updates
6. THE Fair_Value_Platform SHALL NOT implement real OCR, KYC, or document processing
7. THE Fair_Value_Platform SHALL NOT implement real AI or machine learning services
8. THE Fair_Value_Platform SHALL be navigable as a complete demo where each role (Buyer, Dealer, Admin) can reach its dedicated dashboard and access all navigation links defined for that role without encountering dead-end routes
9. WHEN a user triggers an action that would require a real backend service (payment, document upload, AI analysis), THE Fair_Value_Platform SHALL display a visible placeholder or simulated response rather than producing an error or no-op

### Requirement 2: Design System and Visual Foundation

**User Story:** As a client stakeholder, I want the platform to have a premium, luxury, modern aesthetic with a consistent design system, so that the demo conveys trustworthiness and aspirational quality distinct from Copart's utilitarian look.

#### Acceptance Criteria

1. THE Design_System SHALL provide color tokens for deep navy blue (#1B2A4A), white (#FFFFFF), carbon gray (#2D2D2D), light gray (#F5F5F5), gold accent (#C9A84C), silver accent (#A8A8A8), and emerald green (#2E8B57) for positive states
2. THE Design_System SHALL define typography using a sans-serif font family with a scale of no fewer than 6 named size levels (H1 through H4, body, caption, and label), where each level specifies a font-size value between 12px and 48px and a corresponding line-height value, and where each successive heading level is at least 4px larger than the next smaller level
3. THE Design_System SHALL provide spacing tokens following a 4px base grid system with at minimum the following increments: 4px, 8px, 12px, 16px, 24px, 32px, 48px, and 64px
4. THE Design_System SHALL include reusable components for Button (primary, secondary, outline, ghost variants), Input, Select, Card, Badge, Modal, Tabs, Table, Avatar, Skeleton loader, Tooltip, and Progress Bar
5. THE Design_System SHALL render all components with a default border-radius between 6px and 12px, box-shadow with no more than 4px blur and no more than 25% opacity, and CSS transitions between 150ms and 300ms duration on interactive state changes (hover, focus, active)
6. WHEN the viewport width is less than 768px, THE Design_System SHALL adapt layouts from multi-column to single-column stacking while preserving heading and content size ordering from largest to smallest
7. WHEN the viewport width is between 768px and 1279px, THE Design_System SHALL adapt layouts to a reduced column count (no more than 2 columns) while maintaining the same element ordering as the desktop layout
8. WHEN the viewport width is 1280px or greater, THE Design_System SHALL render layouts in their full multi-column configuration as the default reference layout

### Requirement 3: Public Home/Landing Page

**User Story:** As a visitor, I want to see an engaging landing page that explains Fair Value's intermediary model and showcases featured vehicles, so that I understand the platform's value proposition.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a Hero_Section containing a headline, a subheadline describing the intermediary model, a vehicle search input, and a primary call-to-action button that navigates to the public inventory page
2. WHEN a visitor submits a search query via the Hero_Section search input, THE Fair_Value_Platform SHALL navigate to the inventory page with the query applied as a filter
3. THE Fair_Value_Platform SHALL display a "How It Works" section with exactly 5 sequential steps (publish, explore, offer, connect, close externally), each showing a step number, a title, and a short description
4. THE Fair_Value_Platform SHALL display a "Featured Vehicles" section showing a grid of between 4 and 8 Vehicle_Card components populated from Mock_Data, where each Vehicle_Card displays at minimum: vehicle image, make, model, year, and starting price
5. THE Fair_Value_Platform SHALL display an "Upcoming Events" section listing up to 3 next scheduled Events, each showing a countdown timer, vehicle count, and a status badge indicating the event state
6. THE Fair_Value_Platform SHALL display a trust/credibility section with at least 3 platform statistics using mock numeric values and at least 2 verification badges
7. THE Fair_Value_Platform SHALL display a Dealer call-to-action section inviting dealerships to join the platform with a button that navigates to the dealer registration page
8. THE Fair_Value_Platform SHALL display a footer containing navigation links, contact information, legal links, and social media icons
9. THE Fair_Value_Platform SHALL include visible text in both the Hero_Section and "How It Works" section stating that Fair Value is an intermediary platform and that vehicle purchase and payment happen externally between buyer and dealer

### Requirement 4: Public Inventory/Catalog Page

**User Story:** As a visitor, I want to browse the full vehicle catalog with filters and search (inspired by Copart's inventory structure), so that I can find vehicles that match my criteria.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a paginated grid of Vehicle_Card components showing all vehicles from Mock_Data with a status of "active" or "upcoming", displaying a maximum of 24 vehicles per page with pagination controls to navigate additional results
2. THE Fair_Value_Platform SHALL provide filter controls for make, model, year range (1990–current year), price range ($0–$999,999), mileage range (0–500,000 mi), fuel type, transmission, body type, and location, with all filters defaulting to unselected (showing all vehicles)
3. THE Fair_Value_Platform SHALL provide a text search input that performs case-insensitive partial matching against vehicle make, model, or description, beginning to filter results after the user has entered at least 2 characters
4. THE Fair_Value_Platform SHALL provide sort options for price (low-high, high-low), year (newest, oldest), and date added (most recent first as default sort order)
5. WHEN filters, search, or sort options are applied, THE Fair_Value_Platform SHALL update the vehicle grid within 300ms without a full page reload
6. WHEN no vehicles match the applied filters or search query, THE Fair_Value_Platform SHALL display an empty state illustration with a message indicating no results were found and a "Clear All Filters" button that resets all filters, search, and sort to their default states
7. THE Vehicle_Card SHALL display a vehicle thumbnail image (16:9 aspect ratio) from the Image_Provider, title formatted as "[year] [make] [model]", current price for fixed-price vehicles or starting bid for auction vehicles, a status badge ("active", "upcoming", or "closed"), key specs (mileage, fuel type, transmission), and a favorite/watchlist toggle icon
8. WHEN a visitor applies one or more filters, THE Fair_Value_Platform SHALL display an active filter summary showing the count of applied filters and a "Clear All" action to reset all filters simultaneously

### Requirement 5: Vehicle Detail Page

**User Story:** As a visitor, I want to see comprehensive vehicle information including a photo gallery and specifications, so that I can evaluate vehicles before making an offer.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a Gallery component showing between 1 and 20 vehicle images from the Image_Provider, with left/right navigation controls that cycle through photos and wrap from the last image back to the first
2. THE Fair_Value_Platform SHALL display a specifications panel listing make, model, year, mileage, fuel type, transmission, engine, color, VIN (masked to show only the last 4 characters, with the remaining characters replaced by asterisks), and body type
3. THE Fair_Value_Platform SHALL display an offer panel showing the current highest offer amount (without identifying the offeror), total number of offers, Event status, and time remaining displayed as a countdown in days, hours, and minutes
4. THE Fair_Value_Platform SHALL display an anonymous offer history list showing the most recent 20 offer amounts and their timestamps in reverse chronological order, without revealing Buyer or Dealer identities
5. THE Fair_Value_Platform SHALL display a privacy notice explaining that Buyer data remains protected until Event close and that the Dealer identity is also protected during the active period
6. THE Fair_Value_Platform SHALL display a "Similar Vehicles" section containing up to 6 Vehicle_Card components for vehicles that share the same body type or make as the current listing
7. WHEN a Buyer is authenticated and verified, THE Fair_Value_Platform SHALL enable the offer submission form on the offer panel with a visually distinct "Place Offer" call-to-action button
8. WHEN a visitor is not authenticated, THE Fair_Value_Platform SHALL display a visually distinct "Place Offer" button that redirects to the login page with a prompt to register or log in, preserving the current vehicle page URL as the return destination after successful authentication
9. IF the Gallery component has no images available from the Image_Provider, THEN THE Fair_Value_Platform SHALL display a placeholder image indicating that no photos are available for the vehicle

### Requirement 6: Events Page

**User Story:** As a visitor, I want to see upcoming and past auction/offer events with their details, so that I can plan my participation.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a list of Events with name, date range, status (scheduled, active, closed, in_review, finished), vehicle count, and description, sorted by start date with active events first, then scheduled, then closed/finished
2. THE Fair_Value_Platform SHALL visually distinguish Event status using color-coded badges (emerald green for active, gold for scheduled, gray for closed, navy for in_review, silver for finished)
3. WHEN an Event has status "active", THE Fair_Value_Platform SHALL display a countdown timer showing remaining time in days, hours, and minutes format
4. WHEN a user selects an Event, THE Fair_Value_Platform SHALL display the Event detail view with associated vehicles shown as Vehicle_Card components in a grid layout
5. THE Fair_Value_Platform SHALL display a timeline visualization showing the Event lifecycle phases (registration, offers open, offers close, lead release) with the current phase highlighted
6. IF no Events exist in the mock data, THEN THE Fair_Value_Platform SHALL display an empty state message indicating no events are currently scheduled

### Requirement 7: How It Works Page

**User Story:** As a visitor, I want a dedicated explanation of Fair Value's intermediary model, so that I clearly understand that vehicle purchases happen externally and Fair Value is not a direct seller.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a numbered visual flow of exactly 8 sequential steps, each containing a step number, a label, and a one-sentence description, explaining: Dealer publishes vehicles, Fair Value approves, Buyer explores and offers, Event closes, Leads generated, Dealer selects leads, Buyer info unlocked, External negotiation and close
2. THE Fair_Value_Platform SHALL display a dedicated disclaimer section stating that Fair Value is an intermediary platform and that vehicle payment and purchase happen outside the platform, positioned visibly above the fold or immediately after the visual flow
3. THE Fair_Value_Platform SHALL display two visually distinct benefit sections, one labeled "For Buyers" listing at minimum: access to verified inventory, privacy protection, and fair offer process, and one labeled "For Dealers" listing at minimum: qualified leads, buyer verification, and no upfront cost
4. THE Fair_Value_Platform SHALL include a FAQ section containing at least 5 expandable/collapsible question-and-answer items addressing the intermediary model, including questions about payment handling, vehicle ownership, data privacy, the offer process, and post-event contact
5. THE Fair_Value_Platform SHALL display a visible statement within the visual flow or in the disclaimer section indicating that the offer model generates leads and connections, not binding purchase transactions

### Requirement 8: Mock Authentication Pages

**User Story:** As a visitor, I want to register and log in with a premium-designed interface, so that I can access buyer or dealer features in the demo.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a Login page with an email input (maximum 254 characters), a password input (maximum 128 characters), a "Sign in with Google" mock button, and a submit button, all following the design system tokens defined in the project styling conventions
2. THE Fair_Value_Platform SHALL display a Register page with name (maximum 100 characters), email (maximum 254 characters), phone (maximum 20 characters), password (maximum 128 characters) inputs, a "Sign up with Google" mock button, a terms acceptance checkbox, and a submit button
3. IF the user submits the login form with an empty email or empty password field, THEN THE Fair_Value_Platform SHALL display an inline validation message below the respective field indicating the field is required, and SHALL NOT proceed with authentication
4. WHEN a user submits valid login credentials, THE Fair_Value_Platform SHALL simulate authentication by storing a mock user session in local state and redirecting to the Buyer Dashboard for buyer-role users, the Dealer Dashboard for dealer-role users, or the Admin Dashboard for admin-role users
5. IF the user submits the registration form without accepting the terms checkbox, THEN THE Fair_Value_Platform SHALL display a validation message indicating terms acceptance is required, and SHALL NOT proceed with registration
6. WHEN a user submits valid registration data with the terms checkbox accepted, THE Fair_Value_Platform SHALL simulate account creation by storing mock user data in local state and redirecting to the Buyer Dashboard
7. THE Fair_Value_Platform SHALL display mock login shortcut buttons on the Login page, providing one-click access to the Buyer Dashboard, Dealer Dashboard, and Admin Dashboard without entering credentials
8. THE Fair_Value_Platform SHALL NOT implement real OAuth, session tokens, or authentication providers

### Requirement 9: Buyer Dashboard and Profile

**User Story:** As a Buyer, I want a personalized dashboard showing my activity and a profile management page, so that I can track my engagement with the platform.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display the Buyer Dashboard with summary cards showing active offers count, watchlist count, verification status, Lead_Score with its level label, and up to 3 upcoming events
2. THE Fair_Value_Platform SHALL display recent activity on the Buyer Dashboard showing the 5 most recent actions including offers placed and watchlist additions, each with a description and timestamp
3. THE Fair_Value_Platform SHALL display a Profile page where the Buyer can view and edit personal data (name, email, phone, profile photo), budget range (minimum and maximum values), preferred location, and vehicle preferences (preferred type, year range, make)
4. WHEN a Buyer submits profile edits, THE Fair_Value_Platform SHALL update the mock in-memory data and display a success confirmation indicating the changes were saved
5. THE Fair_Value_Platform SHALL display the Buyer's Lead_Score on the Profile page with the numeric score value (0-100), level label (Cold, Medium, Hot, or Priority), color-coded indicator, and contributing reasons list
6. IF a Buyer's profile has any required field (name, email, phone, budget range, or preferred location) empty, THEN THE Fair_Value_Platform SHALL display a completion progress indicator as a percentage and contextual prompts identifying each missing field

### Requirement 10: Buyer Identity Verification

**User Story:** As a Buyer, I want to upload identity documents for verification, so that I become eligible to place offers on vehicles.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a Verification page with document upload areas supporting government-issued ID (front and back), passport, or driver's license as accepted identity documents, accepting files in JPEG, PNG, or PDF format with a maximum size of 5 MB per file
2. THE Fair_Value_Platform SHALL provide an additional upload area for proof of address documentation (utility bill, bank statement, or government correspondence), accepting files in JPEG, PNG, or PDF format with a maximum size of 5 MB per file
3. THE Fair_Value_Platform SHALL display verification status as one of: not_started, documents_uploaded, under_review, verified, or rejected
4. WHEN a Buyer has uploaded at least one identity document and one proof of address document, THE Fair_Value_Platform SHALL transition the verification status from "not_started" to "documents_uploaded" and then to "under_review" within 2 seconds
5. WHEN an Admin activates the mock "Approve Verification" action for a Buyer under review, THE Fair_Value_Platform SHALL transition that Buyer's status to "verified"
6. WHEN a Buyer has verification status "verified", THE Fair_Value_Platform SHALL display a verified badge on the Buyer profile and enable the offer placement controls that were previously disabled
7. THE Fair_Value_Platform SHALL display an email/phone verification mock section showing a 6-digit mock confirmation code input field and a verified indicator (checkmark icon with "Verified" label) upon mock code submission
8. IF a Buyer's verification status is "rejected", THEN THE Fair_Value_Platform SHALL display the rejection status and allow the Buyer to re-upload documents to restart the verification process from "not_started"
9. IF a Buyer selects a file that exceeds 5 MB or is not in JPEG, PNG, or PDF format, THEN THE Fair_Value_Platform SHALL display an error message indicating the file constraint violated and prevent the upload

### Requirement 11: Buyer Watchlist

**User Story:** As a Buyer, I want to save vehicles to a watchlist, so that I can easily track vehicles I'm interested in.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a Watchlist page showing all vehicles the Buyer has favorited as Vehicle_Card components, ordered by most recently added first
2. WHEN a Buyer clicks the favorite toggle on a Vehicle_Card, THE Fair_Value_Platform SHALL add the vehicle to the Watchlist, update the toggle to a filled/active visual state, and persist the addition in localStorage for session continuity
3. WHEN a Buyer clicks the favorite toggle on an already-watchlisted vehicle, THE Fair_Value_Platform SHALL remove the vehicle from the Watchlist and revert the toggle to its default/inactive visual state
4. WHEN the Watchlist is empty, THE Fair_Value_Platform SHALL display an empty state with a message indicating no vehicles have been saved and a link to the Inventory page
5. THE Fair_Value_Platform SHALL allow the Buyer to add or remove vehicles from the Watchlist via the favorite toggle on any Vehicle_Card regardless of where the Vehicle_Card is rendered (Inventory page, Vehicle Detail page, Event detail view, or Watchlist page itself)

### Requirement 12: Buyer Offer Placement

**User Story:** As a verified Buyer, I want to place offers on vehicles during active events, so that I can compete for the opportunity to connect with the vehicle's Dealer.

#### Acceptance Criteria

1. WHILE an Event has status "active", IF the Buyer's verification status is "verified", THEN THE Fair_Value_Platform SHALL enable the offer form on the Vehicle Detail page with a numeric amount input field and a submit button
2. WHEN a Buyer submits an offer, THE Fair_Value_Platform SHALL validate that the offer amount is a numeric value between 0.01 and 999,999,999.99 with up to two decimal places
3. IF a Buyer submits an offer with an amount that fails validation, THEN THE Fair_Value_Platform SHALL keep the offer form open, preserve the entered value, and display an inline error message indicating the accepted range and format
4. WHEN a Buyer submits a valid offer, THE Fair_Value_Platform SHALL add the offer to the mock offer list and display a success confirmation message within the Vehicle Detail page indicating the vehicle name and submitted amount
5. THE Fair_Value_Platform SHALL display a Buyer Offers page listing all offers placed by the Buyer, showing vehicle name, offer amount, submission date, and status (received, surpassed, in_review, selected, not_selected), sorted by submission date descending
6. IF the Buyer has not placed any offers, THEN THE Fair_Value_Platform SHALL display an empty state message on the Buyer Offers page indicating that no offers have been placed
7. WHILE an Event has status "closed", THE Fair_Value_Platform SHALL disable the offer form and display a message indicating that the offer period has ended
8. THE Fair_Value_Platform SHALL display a visible disclaimer adjacent to the offer submit button stating that submitting an offer does not constitute a binding purchase commitment

### Requirement 13: Buyer Post-Match Chat

**User Story:** As a selected Buyer, I want to communicate with the Dealer after event close and lead selection, so that I can coordinate a vehicle visit and external negotiation.

#### Acceptance Criteria

1. WHEN a Buyer's lead is selected by a Dealer after Event_Close, THE Fair_Value_Platform SHALL unlock a Chat interface for that Buyer-Dealer pair
2. WHEN the Chat interface is unlocked, THE Chat SHALL display a pre-seeded mock message thread of at least 2 messages, each showing sender name, message text, and a timestamp in "MMM DD, YYYY HH:MM" format
3. WHILE the Chat is unlocked, THE Chat SHALL provide a text input with a maximum length of 500 characters and a send button for composing messages
4. WHEN a message is sent, THE Chat SHALL append it to the thread with the sender's name, the message text, and the current mock timestamp, without persisting messages across page reloads
5. WHILE a Buyer's lead has not been selected, THE Fair_Value_Platform SHALL display a locked Chat state showing a lock icon and a text message indicating the Buyer is awaiting Dealer selection, with the send button and text input disabled
6. IF the Buyer submits an empty or whitespace-only message, THEN THE Chat SHALL not append the message to the thread and SHALL keep the text input unchanged

### Requirement 14: Dealer Dashboard

**User Story:** As a Dealer, I want an overview dashboard showing my vehicle listings, received offers, and generated leads, so that I can manage my Fair Value participation.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display the Dealer Dashboard with KPI summary cards showing active vehicles count, total offers received, leads generated count, leads selected count, and conversion rate percentage (leads selected / leads generated × 100)
2. THE Fair_Value_Platform SHALL display a vehicle table on the Dealer Dashboard listing up to 10 of the Dealer's vehicles with status badge, offer count, and event assignment, sorted by most recently added first
3. THE Fair_Value_Platform SHALL display a chart placeholder section on the Dealer Dashboard with a labeled area indicating "Offers Analytics — Coming Soon"
4. THE Fair_Value_Platform SHALL display a recent leads ranking section on the Dealer Dashboard showing the top 5 leads ordered by Lead_Score with level badge and offer amount
5. THE Fair_Value_Platform SHALL display recent activity on the Dealer Dashboard showing the 5 most recent events including new offers received and lead status changes, each with a timestamp
6. THE Fair_Value_Platform SHALL display quick action buttons for "Add Vehicle", "View Leads", "View Offers", and "Upload Documents" that navigate to the corresponding Dealer pages

### Requirement 15: Dealer Vehicle Management

**User Story:** As a Dealer, I want to view and manage my vehicle listings, so that I can maintain my inventory on the platform.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a Dealer Vehicles page listing all vehicles belonging to the Dealer, showing for each vehicle: a thumbnail image, title (year make model), status badge (draft, pending_approval, active, assigned_to_event, closed), offers count, and views count, sorted by most recently added first
2. THE Fair_Value_Platform SHALL provide an "Add Vehicle" form with required inputs for make (text, max 50 characters), model (text, max 50 characters), year (numeric, 1900 to current year), mileage (numeric, 0 to 9,999,999 km), fuel type (select), transmission (select), price (numeric, 0.01 to 999,999,999.99), description (text, max 2000 characters), and an image upload area accepting up to 10 images in JPEG or PNG format
3. WHEN a Dealer submits a new vehicle with all required fields populated and valid, THE Fair_Value_Platform SHALL add it to the mock vehicle list with status "pending_approval" and display a success confirmation message
4. IF a Dealer submits the "Add Vehicle" form with any required field empty or invalid, THEN THE Fair_Value_Platform SHALL highlight the invalid fields with an error indicator and display a message indicating which fields require correction, without clearing the entered data
5. THE Fair_Value_Platform SHALL display vehicle status progression as a step indicator showing the sequence: draft → pending_approval → active → assigned_to_event → closed, with the current status step visually highlighted

### Requirement 16: Dealer Document Upload

**User Story:** As a Dealer, I want to upload technical documents for my vehicles, so that Fair Value can verify vehicle information and potentially generate specs.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a Documents page listing uploaded documents per vehicle with file name, upload date, document type, and processing status (uploaded, under_review, reviewed, approved), showing a maximum of 20 documents per vehicle
2. THE Fair_Value_Platform SHALL provide document upload areas for vehicle title, inspection report, spec sheet, and up to 5 additional supporting documents, accepting files of type PDF, PNG, or JPG with a maximum file size of 10 MB per file
3. WHEN a Dealer uploads a valid document, THE Fair_Value_Platform SHALL simulate the upload by displaying the file name with "uploaded" status within the corresponding document category
4. IF a Dealer attempts to upload a file that exceeds 10 MB or is not of type PDF, PNG, or JPG, THEN THE Fair_Value_Platform SHALL reject the upload and display an error message indicating the file type or size constraint that was violated
5. THE Fair_Value_Platform SHALL display a document processing status indicator as a labeled badge for each document showing the current status value (uploaded, under_review, reviewed, or approved)

### Requirement 17: Dealer Lead Management

**User Story:** As a Dealer, I want to view ranked leads generated from my vehicle offers after event close, so that I can select the most promising buyers and manage the follow-up process.

#### Acceptance Criteria

1. WHEN an Event associated with a Dealer's vehicle reaches Event_Close, THE Fair_Value_Platform SHALL display generated leads for that vehicle on the Dealer Leads page, showing a maximum of 50 leads per vehicle
2. THE Fair_Value_Platform SHALL display each lead in a table with columns for lead ID, offer amount, lead level (Cold/Medium/Hot/Priority), Lead_Score, buyer budget, buyer intent, buyer location, verification status, contact status, and action buttons (unlock, select, chat, export)
3. THE Fair_Value_Platform SHALL rank leads by Lead_Score in descending order, using offer amount in descending order as a secondary sort when Lead_Scores are equal
4. THE Fair_Value_Platform SHALL assign lead levels based on Lead_Score ranges: Cold (0–39), Medium (40–59), Hot (60–79), Priority (80–100)
5. WHEN a Dealer selects a lead, THE Fair_Value_Platform SHALL unlock the Buyer's personal information (name, phone, email) and enable the Chat interface, allowing a maximum of 10 unlocked leads per vehicle per event
6. WHILE an Event is still active, THE Fair_Value_Platform SHALL display a locked state on the Leads page showing a message indicating that leads will be available after Event_Close, with all action buttons disabled
7. WHEN a Dealer updates a lead's status, THE Fair_Value_Platform SHALL transition the Lead_Status to one of the following values: selected, contacted, appointment_scheduled, not_interested, or closed_externally
8. THE Fair_Value_Platform SHALL provide an "Export Leads" button that simulates a CSV download containing all visible table columns for leads associated with the selected event and vehicle
9. IF no leads are generated for a vehicle after Event_Close, THEN THE Fair_Value_Platform SHALL display an empty state message indicating no offers were received during the event

### Requirement 18: Dealer Post-Match Chat

**User Story:** As a Dealer, I want to communicate with selected Buyers after unlocking their leads, so that I can coordinate vehicle visits and external negotiations.

#### Acceptance Criteria

1. WHEN a Dealer selects a lead, THE Fair_Value_Platform SHALL provide a Chat interface for that Dealer-Buyer pair
2. THE Chat SHALL display the Buyer's unlocked profile information (name, phone) in the chat header
3. THE Chat SHALL display a mock message thread with sender identification, message text, and timestamp for each message
4. THE Chat SHALL provide a text input field and a send button for composing messages
5. WHEN a message is sent, THE Chat SHALL append it to the thread with the current mock timestamp (messages are not persisted across page reloads)
6. WHILE a Dealer has not yet selected a lead for a given Buyer, THE Fair_Value_Platform SHALL display a locked state on the Chat page indicating that chat is unavailable until the lead is selected

### Requirement 19: Admin Dashboard

**User Story:** As an Admin, I want a comprehensive operational dashboard, so that I can monitor and manage all platform activity at a glance.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display the Admin Dashboard with summary cards showing total users, total dealers, total vehicles, active events, total offers, and total leads, each with a numeric value and a label
2. THE Fair_Value_Platform SHALL display a recent platform activity feed showing the 10 most recent actions including new registrations, vehicle submissions, offer activity, and lead releases, each with a description, actor, and timestamp
3. THE Fair_Value_Platform SHALL display quick action buttons for "Create Event", "Approve Dealer", "Manage Vehicles", and "Review Leads" that navigate to the corresponding Admin pages
4. THE Fair_Value_Platform SHALL display a mock analytics section with chart placeholders for offers over time, leads generated, and user registrations, each labeled with "Analytics — Coming Soon"
5. THE Fair_Value_Platform SHALL display a review alerts section showing counts of pending dealer approvals, pending vehicle approvals, pending document reviews, and events approaching close date

### Requirement 20: Admin User Management

**User Story:** As an Admin, I want to view and manage all registered users, so that I can oversee platform membership.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Users page with a table listing all users with name, email, role, registration date, verification status, and active status, sorted by registration date descending by default, displaying up to 20 rows per page with pagination controls
2. THE Fair_Value_Platform SHALL provide filter controls for role (buyer, dealer, admin), verification status, and active status, where selected filters combine using AND logic and the table updates to show only matching users
3. THE Fair_Value_Platform SHALL provide a search input that filters users by partial match on name or email after the Admin has entered at least 2 characters
4. WHEN an Admin selects a user, THE Fair_Value_Platform SHALL display a user detail panel with name, email, role, registration date, verification status, active status, and action buttons (activate, deactivate, verify)
5. WHEN an Admin clicks the activate or deactivate button in the user detail panel, THE Fair_Value_Platform SHALL toggle the user's active status and update the displayed status in both the detail panel and the users table
6. WHEN an Admin clicks the verify button in the user detail panel for an unverified user, THE Fair_Value_Platform SHALL set the user's verification status to verified and update the displayed status in both the detail panel and the users table
7. IF the applied filters or search query match no users, THEN THE Fair_Value_Platform SHALL display an empty state message indicating no users were found and suggesting the Admin adjust the filters or search term

### Requirement 21: Admin Dealer Management

**User Story:** As an Admin, I want to manage dealer accounts including approval and suspension, so that only verified dealerships can list vehicles.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Dealers page with a table listing all dealers with business name, contact email, contact phone, registration date, approval status (pending_approval, approved, suspended, rejected), vehicle count, and lead count, with a maximum of 20 dealers per page and pagination controls
2. IF a Dealer has status "pending_approval", THEN THE Fair_Value_Platform SHALL display "Approve" and "Reject" action buttons for that Dealer row
3. WHEN an Admin approves a Dealer, THE Fair_Value_Platform SHALL transition the Dealer status to "approved" and display a success notification within 1 second
4. WHEN an Admin rejects a Dealer, THE Fair_Value_Platform SHALL transition the Dealer status to "rejected" and display a success notification within 1 second
5. IF a Dealer has status "approved", THEN THE Fair_Value_Platform SHALL display a "Suspend" action button for that Dealer row
6. WHEN an Admin clicks the "Suspend" button, THE Fair_Value_Platform SHALL display a confirmation dialog before executing the suspension
7. WHEN an Admin confirms suspension of a Dealer, THE Fair_Value_Platform SHALL transition the Dealer status to "suspended", hide all vehicles belonging to that Dealer from public inventory, and display a success notification within 1 second
8. THE Fair_Value_Platform SHALL provide a "Create Dealer" form requiring business name (max 100 characters), contact email, contact phone, and business address, with validation errors displayed inline for any missing or invalid fields

### Requirement 22: Admin Vehicle Management

**User Story:** As an Admin, I want to manage all vehicle listings across dealers including creation, approval, photo updates, and event assignment, so that I can control the catalog.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Vehicles page with a table listing all vehicles with columns: image thumbnail, title, dealer name, status, event assignment, and submission date, sorted by submission date descending and paginated at 20 rows per page
2. THE Fair_Value_Platform SHALL provide filter controls for status, dealer, event assignment, and make/model that update the table results immediately upon selection
3. IF a vehicle has status "pending_approval", THEN THE Fair_Value_Platform SHALL display "Approve" and "Reject" action buttons for that vehicle row
4. WHEN an Admin clicks "Approve" on a pending vehicle, THE Fair_Value_Platform SHALL transition the vehicle status to "active" and display a success confirmation message
5. WHEN an Admin clicks "Reject" on a pending vehicle, THE Fair_Value_Platform SHALL transition the vehicle status to "rejected" and display a success confirmation message
6. THE Fair_Value_Platform SHALL allow Admin to create and edit vehicles with the following fields: make, model, year, mileage, price, description, status, and photos, requiring a minimum of 1 and a maximum of 15 photos per vehicle
7. THE Fair_Value_Platform SHALL allow Admin to assign vehicles to Events via a dropdown or modal selector that lists available events by name and date
8. THE Fair_Value_Platform SHALL allow Admin to update vehicle photos by adding or removing images from the Image_Provider, preventing removal of the last remaining photo

### Requirement 23: Admin Document Review

**User Story:** As an Admin, I want to review documents uploaded by Dealers, so that I can verify vehicle information and approve documentation.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Documents review page listing all dealer-uploaded documents with dealer name, vehicle, document type, upload date, and review status, sorted by upload date descending, with a maximum of 20 documents per page
2. THE Fair_Value_Platform SHALL provide "Approve" and "Reject" actions for each document that has a review status of "pending"
3. WHEN an Admin approves a document, THE Fair_Value_Platform SHALL transition the document status to "approved" and display a confirmation message indicating the document was approved
4. WHEN an Admin rejects a document, THE Fair_Value_Platform SHALL transition the document status to "rejected" and display a confirmation message indicating the document was rejected
5. WHEN an Admin triggers the "Generate Vehicle Specs from Document" action on an uploaded document, THE Fair_Value_Platform SHALL simulate extraction by pre-populating the vehicle form with mock values for make, model, year, mileage, and VIN fields within 2 seconds
6. THE Fair_Value_Platform SHALL allow the Admin to filter the document list by review status (pending, approved, rejected) and by dealer name

### Requirement 24: Admin Event Management

**User Story:** As an Admin, I want to create, edit, activate, and close offer/auction events, so that I can schedule and control the platform's offer cycles.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Events page listing all Events in a table with columns for name, start date, end date, status, associated vehicle count, and received offer count, sorted by start date descending, showing up to 20 Events per page with pagination controls when the total exceeds 20
2. THE Fair_Value_Platform SHALL provide a "Create Event" form with required inputs for event name (maximum 100 characters), description (maximum 500 characters), start date, end date, and vehicle selection, where end date must be later than start date and start date must not be in the past
3. WHEN an Admin submits the "Create Event" form with all required fields valid, THE Fair_Value_Platform SHALL add the Event to the mock events list with status "scheduled" and display a success confirmation message
4. IF an Admin submits the "Create Event" form with any required field empty or any validation rule violated, THEN THE Fair_Value_Platform SHALL display an inline error message indicating the specific field and validation failure, and SHALL NOT create the Event
5. WHILE an Event has status "scheduled", THE Fair_Value_Platform SHALL allow Admin to edit Event name, description, start date, and end date, subject to the same validation rules as creation
6. THE Fair_Value_Platform SHALL allow Admin to transition Event status only through the following sequential path: scheduled → active → closed → in_review → finished, and SHALL disable transition controls that do not correspond to the next valid status
7. THE Fair_Value_Platform SHALL allow Admin to associate and disassociate vehicles to/from Events only while the Event status is "scheduled" or "active", with a maximum of 50 vehicles per Event
8. WHEN an Admin transitions an Event to "closed", THE Fair_Value_Platform SHALL run the mock calculateLeadScore function on all offers for that Event and display a summary showing the total number of offers scored and the number of leads generated
9. WHEN an Admin transitions an Event to "finished", THE Fair_Value_Platform SHALL mark all associated leads as finalized, display each lead's final offer amount as the closing price, and prevent any further status changes to the Event

### Requirement 25: Admin Offers and Leads Management

**User Story:** As an Admin, I want to review all offers and manage lead generation and release, so that I can oversee the platform's core business flow.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Offers page listing all offers in a table with columns: buyer identifier (displayed as "Buyer #N" while the associated Event status is not "closed" or later, and as buyer name once the Event reaches "closed" status or beyond), vehicle name, offer amount, date submitted, event name, dealer name, Lead_Score, and offer status (received, surpassed, in_review, selected, not_selected)
2. THE Fair_Value_Platform SHALL provide filter controls on the Admin Offers page for event, vehicle, user, dealer, amount range (minimum 0.01, maximum 999,999,999.99), score range (0 to 100), and status, applying filters immediately upon selection
3. THE Fair_Value_Platform SHALL display an audit log section on the Admin Offers page showing offer state transitions in reverse chronological order, with each entry displaying the previous status, new status, timestamp, and actor name with role
4. THE Fair_Value_Platform SHALL display an Admin Leads page listing all generated leads in a table sorted by Lead_Score in descending order by default, with columns: buyer name, vehicle name, dealer name, Lead_Score, lead level (Cold/Medium/Hot/Priority), offer amount, Lead_Status, release status (unreleased or released), and action buttons (unlock, chat, export)
5. WHEN an Admin selects "Release Leads" for a closed Event, THE Fair_Value_Platform SHALL update the release status of all leads for that Event from "unreleased" to "released", display those leads on the corresponding Dealer's Leads page, and show a success confirmation indicating the number of leads released
6. WHEN an Admin selects "Generate Leads" for a closed Event, THE Fair_Value_Platform SHALL run the calculateLeadScore function on all offers for that Event and create lead entries with Lead_Status "generated" and release status "unreleased"
7. IF an Admin selects "Generate Leads" for an Event that already has generated leads, THEN THE Fair_Value_Platform SHALL display a warning indicating leads already exist for that Event and require explicit confirmation before regenerating
8. THE Fair_Value_Platform SHALL provide filter and sort controls on the Admin Leads page for event, vehicle, dealer, score range (0 to 100), level (Cold, Medium, Hot, Priority), and Lead_Status, with the default sort being Lead_Score descending

### Requirement 26: Admin Content Management

**User Story:** As an Admin, I want to manage platform public content including texts, titles, banners, and descriptions, so that I can customize the user-facing experience.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Content page with editable fields for homepage headline (maximum 100 characters), subheadline (maximum 200 characters), hero banner image URL, featured vehicle IDs (comma-separated list of up to 8 IDs), and "How It Works" steps text (5 editable step title and description pairs)
2. THE Fair_Value_Platform SHALL provide editable fields for catalog page title (maximum 100 characters), event descriptions (maximum 500 characters per event), and promotional banner text (maximum 200 characters) with banner toggle (visible/hidden)
3. WHEN an Admin modifies content fields and clicks "Save Changes", THE Fair_Value_Platform SHALL update the displayed values in mock state, display a success confirmation message, and reflect the changes on the corresponding public pages during the current session
4. IF an Admin exceeds any character limit on a content field, THEN THE Fair_Value_Platform SHALL display an inline character count indicator showing characters used vs maximum allowed and prevent submission until within limits

### Requirement 27: Admin Settings and Configuration

**User Story:** As an Admin, I want to manage platform settings including scoring configuration and operational parameters, so that I can control platform behavior.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an Admin Settings page with mock controls for platform name (maximum 100 characters), contact email (validated email format), notification preferences (toggle switches for email and in-app notifications), and operational parameters including event default duration, maximum offers per buyer per event, and lead unlock limit per dealer
2. THE Fair_Value_Platform SHALL provide an Admin Scoring Configuration section with editable weight inputs for offer amount weight, verification weight, profile completeness weight, and timing weight, each accepting integer values between 0 and 100
3. WHEN an Admin modifies scoring weights, THE Fair_Value_Platform SHALL validate that all weights sum to 100%
4. IF the scoring weights do not sum to 100%, THEN THE Fair_Value_Platform SHALL display an inline error message indicating the current total and the required total, and SHALL disable the save action until the weights sum to exactly 100%
5. WHEN an Admin submits changes to platform settings or scoring configuration, THE Fair_Value_Platform SHALL persist the updated values in memory and display a success confirmation message within 1 second
6. THE Fair_Value_Platform SHALL display a mock Audit/Activity Log page showing the 20 most recent entries including admin actions, user registrations, vehicle approvals, and event transitions, each with a timestamp displayed in "YYYY-MM-DD HH:mm" format and sorted in descending chronological order

### Requirement 28: Lead Scoring System

**User Story:** As a platform operator, I want an automated lead scoring system, so that dealers receive ranked, qualified buyer connections.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL implement a calculateLeadScore(profile, offers) mock function that accepts a buyer profile object (containing verification status, profile completeness percentage, and budget range) and an array of offers (each containing offer amount, timestamp, and associated event close date), and returns a numeric score (0-100), a level label (Cold, Medium, Hot, or Priority), and an array of contributing reasons
2. THE Fair_Value_Platform SHALL calculate Lead_Score by summing weighted sub-scores: offer amount relative to vehicle listed price (weight: 40%, where offers at or above listed price score 100% and offers below score proportionally), buyer verification status (weight: 25%, where both email and phone verified scores 100%, one verified scores 50%, none scores 0%), profile completeness percentage (weight: 20%, mapped directly as 0-100), and offer timing relative to event close (weight: 15%, where offers placed in the first 25% of event duration score 100%, 25-50% scores 75%, 50-75% scores 50%, and final 25% scores 25%)
3. THE Fair_Value_Platform SHALL assign lead levels based on score: Priority (80-100), Hot (60-79), Medium (40-59), Cold (0-39)
4. THE Fair_Value_Platform SHALL populate the reasons array with applicable factors: "verified email" (when email is verified), "verified phone" (when phone is verified), "complete profile" (when profile completeness is 100%), "budget matches listing" (when buyer budget range includes the vehicle listed price), "early offer" (when offer is placed in the first 50% of event duration), "consistent offers" (when buyer has placed 2 or more offers on the same vehicle), "document uploaded" (when buyer has uploaded at least one verification document)
5. WHEN an event transitions to closed status, THE Fair_Value_Platform SHALL calculate and display Lead_Score for each buyer who submitted offers, showing a progress bar with numeric score badge using color coding: emerald green (#2E8B57) for Priority, gold (#C9A84C) for Hot, silver (#A8A8A8) for Medium, and gray (#2D2D2D) for Cold
6. THE Fair_Value_Platform SHALL allow Admin to modify scoring weights through the Admin Settings page, where each weight is an integer between 0 and 100, and the system SHALL prevent saving unless all four weights sum to exactly 100
7. IF a buyer profile lacks sufficient data to calculate one or more sub-scores, THEN THE Fair_Value_Platform SHALL assign a score of 0 to each incalculable sub-score and include "incomplete profile data" in the reasons array

### Requirement 29: Privacy and Data Unlock Model

**User Story:** As a platform participant, I want personal information protected for both Buyers and Dealers during active events, so that privacy is maintained until explicit lead selection.

#### Acceptance Criteria

1. WHILE an Event has status "active" or "upcoming", THE Fair_Value_Platform SHALL display all Buyer information in offers and leads as anonymized (showing only "Buyer #N" identifiers where N is a sequential number unique per event)
2. WHILE an Event has status "active" or "upcoming", THE Fair_Value_Platform SHALL hide Dealer identity from Buyers on the Vehicle Detail page (showing only "Verified Dealer" without business name, phone, email, or address)
3. WHEN a Dealer views leads before selecting, THE Fair_Value_Platform SHALL show Lead_Score, offer amount, and verification badge without revealing Buyer name, email, or phone
4. WHEN a Dealer selects a lead, THE Fair_Value_Platform SHALL transition the lead to "unlocked" status and reveal the Buyer's full name, email, and phone number within 2 seconds of selection
5. WHEN a lead is unlocked, THE Fair_Value_Platform SHALL reveal the Dealer's business name, phone number, and email address to the corresponding Buyer
6. THE Fair_Value_Platform SHALL display privacy notices on the Vehicle Detail page, offer forms, and lead pages stating that participant identities remain hidden until lead selection and describing what data will be shared upon unlock
7. THE Fair_Value_Platform SHALL visually represent locked data with blur/overlay effects and lock icons, and unlocked data with full visibility and unlock icons
8. WHILE an Event has status "closed" and a lead has not been selected by the Dealer, THE Fair_Value_Platform SHALL maintain anonymization of Buyer information until the Dealer explicitly selects the lead
9. IF a Dealer attempts to select a lead that is already in "unlocked" status, THEN THE Fair_Value_Platform SHALL display the previously revealed Buyer contact information without creating a duplicate unlock action

### Requirement 30: Centralized Mock Data and Image Provider

**User Story:** As a developer, I want all mock data centralized in a single location with a consistent image provider, so that the prototype is maintainable and demo scenarios are easy to modify.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL store all mock data in a centralized `/src/data/` directory with one separate TypeScript file per entity type: users, vehicles, dealers, events, offers, leads, and messages
2. THE Fair_Value_Platform SHALL define TypeScript interfaces for all data entities (User, Vehicle, Dealer, Event, Offer, Lead, Message) in the `/src/types/` directory, with each interface specifying all fields required by consuming components
3. THE Fair_Value_Platform SHALL use a centralized Image_Provider utility located in `/src/lib/` that accepts an entity type and entity ID and returns a valid placeholder image URL, without any image URLs hardcoded in individual components
4. IF the Image_Provider receives an entity ID that does not exist in its mapping, THEN THE Fair_Value_Platform SHALL return a default fallback placeholder image URL for the corresponding entity type
5. THE Fair_Value_Platform SHALL isolate all image URL resolution logic in a single utility file such that changing the image source requires modifying only that one file and no component files
6. THE Fair_Value_Platform SHALL populate mock data with a minimum of 12 vehicles, 4 dealers, 8 buyers, 3 events, 20 offers, and 10 leads, with each entity containing all fields defined by its corresponding TypeScript interface
7. THE Fair_Value_Platform SHALL export all mock data collections as typed arrays conforming to their respective TypeScript interfaces, enabling direct import by any consuming component

### Requirement 31: Responsive Design and Visual States

**User Story:** As a client viewing the demo, I want the platform to look polished across devices and show realistic loading and state transitions, so that the prototype feels production-ready.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL render all pages at desktop (1280px+), tablet (768px-1279px), and mobile (below 768px) breakpoints, adapting layout by reflowing multi-column grids to fewer columns, collapsing the navigation into a hamburger menu on mobile, and ensuring no horizontal scrolling at any breakpoint
2. THE Fair_Value_Platform SHALL treat the desktop (1280px+) layout as the primary design target, while ensuring mobile layouts remain fully navigable with all interactive elements reachable without horizontal scrolling and text readable without zooming
3. WHEN a page transition occurs, THE Fair_Value_Platform SHALL display skeleton loading placeholders in place of content areas for a minimum of 300 milliseconds and a maximum of 1500 milliseconds before revealing loaded content
4. THE Fair_Value_Platform SHALL display visually distinguishable states for each data context: loading (skeleton placeholder shapes matching content layout), empty (centered illustration with descriptive message), locked (content blurred with semi-transparent overlay and lock icon), unlocked (full data visible without overlay), active (emerald (#2E8B57) badge), closed (gray (#A8A8A8) badge), and verified (badge with checkmark icon)
5. THE Fair_Value_Platform SHALL apply hover effects, visible focus indicators with a minimum 2px outline offset, and CSS transitions with a duration between 150 milliseconds and 300 milliseconds on all interactive elements including buttons, links, cards, and form controls
6. WHEN an interactive element receives keyboard focus, THE Fair_Value_Platform SHALL display a visible focus ring that meets a minimum 3:1 contrast ratio against the surrounding background

### Requirement 32: Navigation and Routing

**User Story:** As a user, I want clear navigation that adapts to my role and current auth state, so that I can easily move through the platform.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display a premium public navigation bar with the Fair Value logo, links to Home, Inventory, Events, How It Works, and Login/Register buttons styled with the Design_System
2. WHEN a user is authenticated as a Buyer, THE Fair_Value_Platform SHALL display a buyer top navigation bar with links to Dashboard, Watchlist, Offers, Profile, Verification, and a logout action with user avatar
3. WHEN a user is authenticated as a Dealer, THE Fair_Value_Platform SHALL display a dealer top navigation bar with links to Dashboard, Vehicles, Documents, Leads, Chat, and a logout action with dealer avatar
4. WHEN a user is authenticated as an Admin, THE Fair_Value_Platform SHALL display an admin sidebar navigation with links to Dashboard, Users, Dealers, Vehicles, Events, Offers, Leads, Content, Settings, Audit Log, and a logout action
5. THE Fair_Value_Platform SHALL use Next.js App Router with route groups for public, auth, buyer, dealer, and admin sections
6. THE Fair_Value_Platform SHALL highlight the active route in the navigation to indicate the current page
7. WHEN a user clicks the logout action, THE Fair_Value_Platform SHALL clear the mock session from local state and redirect to the public Home page
8. THE Fair_Value_Platform SHALL display the Fair Value logo as a clickable element that navigates to the public Home page from any route

### Requirement 33: AI Vehicle Autofill Concept (Future Feature)

**User Story:** As a Dealer, I want to see a conceptual UI for AI-assisted vehicle data extraction from documents, so that the future capability is demonstrated visually without real implementation.

#### Acceptance Criteria

1. THE Fair_Value_Platform SHALL display an "AI Autofill" button group on the vehicle creation form with a sparkle/AI icon and the following action options: "Generate Title", "Extract Specs", "Generate Description", "Suggest Tags/Categories", and "Generate Internal Summary"
2. WHEN a Dealer clicks any AI Autofill action, THE Fair_Value_Platform SHALL display a mock loading animation lasting between 1 and 2 seconds, then populate the corresponding form fields with predefined Mock_Data: "Generate Title" populates the vehicle title field, "Extract Specs" populates make/model/year/mileage/engine fields, "Generate Description" populates the description text area, "Suggest Tags/Categories" populates tags and category selectors, and "Generate Internal Summary" populates the internal notes field
3. WHEN AI Autofill populates a form field, THE Fair_Value_Platform SHALL visually distinguish AI-populated fields from manually entered fields by displaying an inline AI indicator icon adjacent to each populated field
4. THE Fair_Value_Platform SHALL display a visible "Future Feature — Not implemented in MVP" badge on the AI Autofill button group and a tooltip on each individual AI action button indicating the feature is a conceptual demonstration
5. WHEN a Dealer modifies or clears an AI-populated field, THE Fair_Value_Platform SHALL remove the AI indicator icon from that field and treat the content as dealer-entered data
6. THE Fair_Value_Platform SHALL populate all AI Autofill mock results exclusively from predefined template data in Mock_Data, with no actual document processing or external service calls
