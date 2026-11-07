# Live Web & Interaction Analytics (`/analytics`)

A self-contained, privacy-first analytics engine and minimalist dashboard at `/analytics` that records, aggregates, and visualizes real visitor traffic, page views, social profile clicks, meeting/contact conversions, and one headline engagement metric per Vibe Coding app—paired with a subtle, semi-transparent link at the bottom of the main page.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design choices have been confirmed from your preferences and govern the implementation:

- **Confirmed Decision 1 — One Key Metric per Vibe Coding App**: Each Vibe Coding app is represented by a single high-signal primary metric on `/analytics` rather than a noisy multi-column breakdown:
  - **ACAP Email Signature Studio**: *Signatures Copied* (clicks on Copy Signature / Download HTML)
  - **NBA Wins Pool & Snake Draft**: *Leagues Played & Loaded* (drafts completed or shared slots loaded/saved)
  - **Crotopia 3D Odyssey**: *World Explorations* (landmarks discovered / game sessions played)
  - **HTML5 Vibe Apps (Wolt Delivery, Economic Time Traveler, Potato Inflation, Beer Indicator)**: *App Plays* (embedded or full-tab game launches)
- **Confirmed Decision 2 — Meetings Booked & Contacts Sent**: Both intent (*Drawer Opened*) and completion (*Meeting Scheduled* via Calendly postMessage listener / *Contact Sent* via Google Form submission reload detection + confirmation trigger) are tracked and displayed side-by-side so you can see both top-of-funnel interest and completed outreach.
- **Confirmed Decision 3 — Public Access on `/analytics`**: The dashboard at `/analytics` is publicly viewable by anyone visiting the URL, with a 1-click JSON/CSV export option and live auto-refresh.

---

## 1. Overview & Core Concept

- **What It Does**: Captures genuine visitor page views and high-intent user interactions across the entire site in real time, persists daily rollups and recent activity logs on the server, and presents them in a calm, editorial analytics console at `/analytics`.
- **Target Audience / Persona**: You (to monitor real portfolio traffic, networking conversions, and Vibe Coding engagement) and curious visitors who click the discreet translucent link at the bottom of the homepage.
- **Key Value**: Zero-cost, first-party analytics that works even when visitors use ad-blockers, requires no cookie banners, preserves historical daily series across server restarts, and surfaces immediate proof of live interactions.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Silent Background Tracking**: As a visitor browses `/`, `/reading`, `/vibecoding`, `/vibecoding/ACAPemail`, `/vibecoding/nbagame`, `/vibecoding/crotopia`, or topic pages, a lightweight tracker records the page view, referrer source, and device category. Clicking any social icon, opening or completing a meeting/contact drawer, or triggering a Vibe Coding app's key action sends an instant event beacon.
  2. **Discreet Main Page Entry Point**: At the very bottom of the main portfolio footer, a quiet, semi-transparent text link (`opacity-35 hover:opacity-80`) reads `Analytics` (with live total views in tabular numerals) and navigates smoothly to `/analytics`.
  3. **Exploring `/analytics`**:
     - **Top Bar**: Breadcrumb back to `Vedran Brozović`, interactive date window selector (`Today`, `7 Days`, `30 Days`, `All Time`), and a `Download JSON` export button.
     - **Top KPI Strip**: 4 clean, single-elevation metric cells using `tabular-nums`: **Unique Visitors**, **Total Pageviews**, **Social Profile Clicks**, and **Meetings & Contacts**.
     - **14-Day Traffic Trend (SVG Bar & Line Chart)**: Interactive daily visualization contrasting Pageviews and Unique Visitors, with hover tooltips showing exact daily counts.
     - **Focused Breakdowns (2-Column Grid)**:
       - *One Metric per Vibe Coding App*: Clean horizontal bar list showing each Vibe Coding app and its single signature action counter.
       - *Outreach & Social Conversions*: Breakdown of clicks by social platform (`LinkedIn`, `GitHub`, `Instagram`, `YouTube`, `X / Twitter`) plus the **Meetings Booked** (`Opened` → `Booked`) and **Contacts Sent** (`Opened` → `Sent`) funnel.
     - **Pageviews by Route & Live Activity Stream**: Ranked table of page views per route alongside a real-time feed of the latest 25 anonymized interactions so you can test an action in one tab and watch it appear immediately.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Editorial minimalist analytics console matching the warm off-white portfolio palette (`#Faf9f6` canvas, `#1c2229` ink, `#555f6f` muted prose, `#e2e5eb` 1px hairline borders).
  - *Typography & Hierarchy*: Clean sans headings paired with strict tabular monospace numerals (`font-mono tabular-nums`) for all counters, percentages, and timestamps so digits align vertically without jitter.
  - *Component Styling & Layout*: Single-elevation flat cards with 1px hairline borders, generous whitespace, and zero nested card clutter.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Privacy-Preserving Daily Visitor Hashing**:
  - *Chosen Approach*: Compute an anonymous daily visitor fingerprint on the server using a one-way SHA-256 hash of `IP + User-Agent + YYYY-MM-DD` (never storing raw IP addresses) and filter out known crawler/bot User-Agents.
  - *Why*: Accurately separates 1 person refreshing 20 times (20 pageviews, 1 unique visitor) without invasive tracking cookies or GDPR consent banners.
- **Decision 2 — Persistent Server JSON Storage with Atomic Writes**:
  - *Chosen Approach*: Store daily time-series buckets, route counters, social platform counters, Vibe Coding app metrics, and a capped rolling log of recent events on disk in `analytics-data.json`.
  - *Why*: 100% free to maintain, zero external database credentials required, and survives dev/prod server restarts.
- **Decision 3 — Cross-Origin Iframe Conversion Detection for Meetings & Contacts**:
  - *Chosen Approach*: Listen for Calendly's native `window.postMessage` (`calendly.event_scheduled`) to automatically record completed meeting bookings, and detect Google Form submission transitions (iframe load count > 1 after opening the contact drawer) to automatically record completed contact submissions, paired with drawer-open intent tracking.
  - *Why*: Captures both initial outreach intent and actual form/calendar completion despite third-party iframe boundaries.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER (React SPA)                        │
├──────────────────────┬───────────────────────────┬───────────────────────┤
│   Main Portfolio     │     Vibe Coding Apps      │  /analytics Console   │
│  • Route Pageviews   │  • ACAP: Signature Copied │  • Timeframe Filter   │
│  • SocialLink Clicks │  • NBA: League Played     │  • 14-Day SVG Chart   │
│  • Meeting Opened &  │  • Crotopia: Landmark Hit │  • App Single-Metric  │
│    Calendly Booked   │  • HTML5 Games: App Play  │  • Social & Outreach  │
│  • Contact Opened &  │                           │  • Live Event Ticker  │
│    Form Submitted    │                           │  • JSON Data Export   │
└──────────┬───────────┴─────────────┬─────────────┴───────────▲───────────┘
           │ POST /api/analytics/track (Beacon/Fetch)          │ GET /api/analytics
           ▼                                                   │ (10s live poll)
┌──────────────────────────────────────────────────────────────┴───────────┐
│                        EXPRESS SERVER (server.ts)                        │
│  • Bot User-Agent filter & SHA-256 daily anonymous visitor hash          │
│  • Atomic read/write persistence to analytics-data.json                  │
│  • Aggregated rollups by date, route, social platform, outreach & app    │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `daily`: Map of `YYYY-MM-DD` → `{ pageviews, uniqueVisitorHashes[], socialClicks, meetingsOpened, meetingsBooked, contactsOpened, contactsSent, appMetrics }`.
  - `routes`: Map of normalized path (`/`, `/reading`, `/vibecoding`, `/vibecoding/ACAPemail`, `/vibecoding/nbagame`, `/vibecoding/crotopia`, `/education`, `/work`, `/nonprofit`, `/ballislife`, `/blog`, `/film`) → total view count.
  - `socials`: Map of platform (`linkedin`, `github`, `instagram`, `youtube`, `twitter`, `email`) → click count.
  - `outreach`: `{ meetingsOpened, meetingsBooked, contactsOpened, contactsSent }`.
  - `vibeApps`: Single primary metric counter per app (`ACAPemail`, `nbagame`, `crotopia`, `wolt-game`, `economic-time-traveler`, `potato-inflation`, `beer-indicator`).
  - `recentEvents`: Capped ring buffer (latest 50 events) with timestamp, event type, label, device type (`Desktop` / `Mobile`), and referrer domain.
- **Interactive Component & State Mapping**:
  - `SocialLink`: Invokes `trackEvent({ type: 'social_click', target: platform })` inside its click handler without delaying link navigation.
  - `App` (Main Page): Tracks `meeting_opened` / `contact_opened` when toggling drawers, listens for `calendly.event_scheduled` messages to fire `meeting_booked`, tracks Google Form iframe post-initial `onLoad` to fire `contact_sent`, and renders the semi-transparent `/analytics` link in the bottom footer.
  - Vibe Coding Apps (`AcapEmailApp`, `NbaGameApp`, `CrotopiaApp`, `VibeCoding`): Emit `vibe_metric` events on their designated key action.
