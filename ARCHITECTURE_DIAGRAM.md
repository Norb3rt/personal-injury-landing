# 🏗️ Subniche Pages System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROGRAMMATIC SEO SYSTEM                      │
│                    Multi-Level Page Generation                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │         Data Layer (State Loader)          │
        │  • StateDataLoader                         │
        │  • 500+ cities across multiple states      │
        │  • JSON/CSV data sources                   │
        └────────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│   Practice Areas Config   │    │    Location Data          │
│  • 6 practice areas       │    │  • California: ~500       │
│  • Metadata & content     │    │  • Texas: ~10             │
│  • FAQs & keywords        │    │  • Florida: ~10           │
└───────────────────────────┘    │  • New York: ~10          │
                                 └───────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │         Page Generation Layer              │
        │  • Next.js App Router                      │
        │  • Static Site Generation (SSG)            │
        │  • generateStaticParams()                  │
        └────────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│      City Pages (L1)      │    │   Subniche Pages (L2)     │
│  /[state]/[city]/         │    │  /[state]/[city]/         │
│                           │    │    [practice]/            │
│  • ~500 pages             │    │                           │
│  • Links to 6 subniches   │    │  • ~3,000 pages           │
│  • Services grid          │    │  • Links to parent        │
│  • Lead capture           │    │  • Links to siblings      │
└───────────────────────────┘    │  • Practice-specific      │
                                 └───────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │         Sitemap Generation Layer           │
        │  • Dynamic XML generation                  │
        │  • Priority calculation                    │
        │  • Caching (1 hour)                        │
        └────────────────────────────────────────────┘
                                 │
        ┌────────────┬───────────┴───────────┬────────────┐
        ▼            ▼                       ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│sitemap-index │ │  sitemap.xml │ │sitemap-cities│ │sitemap-      │
│    .xml      │ │              │ │    .xml      │ │subniches.xml │
│              │ │ Static pages │ │              │ │              │
│ Master index │ │ + city pages │ │ ~500 cities  │ │ ~3,000 pages │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## URL Structure Hierarchy

```
Root Domain
│
├── / (Homepage)
│
├── /[state]/[city]/ ─────────────────┐ CITY PAGES (Level 1)
│   │                                  │ • ~500 pages
│   │                                  │ • Parent pages
│   ├── /california/los-angeles/      │ • Link to 6 subniches
│   ├── /california/san-francisco/    │
│   ├── /texas/houston/               │
│   └── /florida/miami/               │
│                                      │
└── /[state]/[city]/[practice]/ ──────┘ SUBNICHE PAGES (Level 2)
    │                                    • ~3,000 pages
    │                                    • Child pages
    ├── /california/los-angeles/        • Link back to parent
    │   ├── car-accident/               • Link to siblings
    │   ├── slip-and-fall/
    │   ├── medical-malpractice/
    │   ├── workplace-injury/
    │   ├── product-liability/
    │   └── wrongful-death/
    │
    ├── /california/san-francisco/
    │   ├── car-accident/
    │   └── ... (6 practice areas)
    │
    └── /texas/houston/
        ├── car-accident/
        └── ... (6 practice areas)
```

---

## Internal Linking Strategy

```
                    ┌─────────────────────────┐
                    │   City Page (Parent)    │
                    │  /california/           │
                    │   los-angeles/          │
                    └───────────┬─────────────┘
                                │
                    ┌───────────┴───────────┐
                    │  Services Grid (6)    │
                    │  Each card links to   │
                    │  subniche page        │
                    └───────────┬───────────┘
                                │
        ┌───────────┬───────────┼───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼           ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Car Accident │ │ Slip & Fall  │ │   Medical    │ │  Workplace   │ │   Product    │ │  Wrongful    │
│    Page      │ │     Page     │ │  Malpractice │ │   Injury     │ │  Liability   │ │    Death     │
│              │ │              │ │     Page     │ │     Page     │ │     Page     │ │     Page     │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │                │                │
       │                │                │                │                │                │
       └────────────────┴────────────────┴────────────────┴────────────────┴────────────────┘
                                         │
                                         ▼
                        ┌────────────────────────────────┐
                        │  Each subniche page has:       │
                        │  • Link back to parent (city)  │
                        │  • Links to 5 siblings         │
                        │  • Lead capture forms          │
                        └────────────────────────────────┘
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        BUILD TIME                                │
└─────────────────────────────────────────────────────────────────┘

1. Load State Data
   ├── StateDataLoader.getAllProcessedLocations()
   └── Returns: 500+ locations

2. Load Practice Areas
   ├── PRACTICE_AREAS from config
   └── Returns: 6 practice areas

3. Generate Static Params
   ├── City pages: 500 combinations
   │   └── { state: 'california', city: 'los-angeles' }
   │
   └── Subniche pages: 3,000 combinations
       └── { state: 'california', city: 'los-angeles', practice: 'car-accident' }

4. Generate Pages
   ├── For each city: Render city page
   └── For each city × practice: Render subniche page

5. Generate Sitemaps
   ├── sitemap-cities.xml: 500 URLs
   └── sitemap-subniches.xml: 3,000 URLs

┌─────────────────────────────────────────────────────────────────┐
│                        RUNTIME                                   │
└─────────────────────────────────────────────────────────────────┘

1. User visits city page
   └── Static HTML served from CDN

2. User clicks service card
   └── Navigate to subniche page

3. Subniche page loads
   └── Static HTML served from CDN

4. User clicks "Back to city"
   └── Navigate to parent city page

5. User clicks sibling practice
   └── Navigate to sibling subniche page
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHARED COMPONENTS                             │
├─────────────────────────────────────────────────────────────────┤
│  • TwoStepLeadModal (Lead capture)                              │
│  • StickyFooterCTA (Persistent CTA)                             │
│  • AnalyticsProvider (Tracking)                                 │
│  • Animation components (FadeIn, StaggerContainer, etc.)        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│   City Page Template      │    │  Subniche Page Template   │
│  app/[state]/[city]/      │    │  app/[state]/[city]/      │
│       page.tsx            │    │    [practice]/page.tsx    │
├───────────────────────────┤    ├───────────────────────────┤
│  • Hero section           │    │  • Hero with breadcrumb   │
│  • Services grid (6)      │    │  • About practice area    │
│  • Why choose us          │    │  • Common injuries        │
│  • Testimonials           │    │  • Why choose us          │
│  • FAQ                    │    │  • Practice-specific FAQ  │
│  • CTA sections           │    │  • Other services (5)     │
│                           │    │  • CTA sections           │
└───────────────────────────┘    └───────────────────────────┘
```

---

## SEO Metadata Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    METADATA GENERATION                           │
└─────────────────────────────────────────────────────────────────┘

City Page:
  Input: { state: 'california', city: 'los-angeles' }
  ↓
  generateMetadata()
  ↓
  Output:
    • Title: "Personal Injury Lawyer in Los Angeles, CA | Free Consultation"
    • Description: "Injured in Los Angeles? Get the settlement you deserve..."
    • Keywords: "los angeles personal injury lawyer, accident attorney..."
    • OpenGraph tags
    • Canonical URL

Subniche Page:
  Input: { state: 'california', city: 'los-angeles', practice: 'car-accident' }
  ↓
  generateMetadata()
  ↓
  Output:
    • Title: "Car Accidents Lawyer in Los Angeles, California | Free Consultation"
    • Description: "Injured in a car accidents in Los Angeles? Get the settlement..."
    • Keywords: "car accident lawyer, los angeles auto accident attorney..."
    • OpenGraph tags
    • Canonical URL
```

---

## Sitemap Priority System

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIORITY CALCULATION                          │
└─────────────────────────────────────────────────────────────────┘

City Pages:
  Major cities (LA, SF, Houston, etc.)     → Priority: 1.0
  Large cities (population > 100k)         → Priority: 0.8
  Smaller cities                           → Priority: 0.6

Subniche Pages:
  Major city + high-demand practice        → Priority: 0.9
  Major city + other practice              → Priority: 0.8
  Large city + high-demand practice        → Priority: 0.7
  Other combinations                       → Priority: 0.6

High-demand practices:
  • Car Accidents
  • Slip & Fall
  • Medical Malpractice
```

---

## File Structure

```
personal-injury-landing/
│
├── app/
│   ├── [state]/
│   │   └── [city]/
│   │       ├── page.tsx ──────────────── City page template
│   │       ├── loading.tsx
│   │       ├── not-found.tsx
│   │       └── [practice]/
│   │           └── page.tsx ──────────── Subniche page template
│   │
│   ├── sitemap-index.xml/
│   │   └── route.ts ──────────────────── Master sitemap index
│   │
│   ├── sitemap-cities.xml/
│   │   └── route.ts ──────────────────── Cities sitemap
│   │
│   ├── sitemap-subniches.xml/
│   │   └── route.ts ──────────────────── Subniches sitemap
│   │
│   ├── sitemap.ts ────────────────────── Main sitemap
│   └── robots.txt ────────────────────── Robots file
│
├── lib/
│   ├── data/
│   │   ├── state-loader.ts ───────────── Data loading system
│   │   └── practice-areas-config.ts ──── Practice areas config
│   │
│   ├── types/
│   │   └── location.types.ts ─────────── Type definitions
│   │
│   └── seo.ts ────────────────────────── SEO utilities
│
├── data/
│   ├── states/
│   │   ├── california-cities.json
│   │   ├── texas-cities.json
│   │   └── florida-cities.json
│   │
│   └── metadata/
│       └── states-config.json
│
└── scripts/
    └── verify-subniche-system.js ─────── Verification script
```

---

## Build Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        npm run build                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  1. Load Data          │
                    │  • State loader        │
                    │  • Practice areas      │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  2. Generate Params    │
                    │  • 500 city combos     │
                    │  • 3,000 practice      │
                    │    combos              │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  3. Render Pages       │
                    │  • City pages (500)    │
                    │  • Subniche (3,000)    │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  4. Generate Sitemaps  │
                    │  • Cities XML          │
                    │  • Subniches XML       │
                    │  • Index XML           │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  5. Optimize & Bundle  │
                    │  • Minify HTML/CSS/JS  │
                    │  • Generate assets     │
                    │  • Create .next folder │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  6. Ready for Deploy   │
                    │  • Static files        │
                    │  • ~3,500 pages        │
                    └────────────────────────┘
```

---

**Architecture Version:** 1.0  
**Last Updated:** 2025-09-30  
**Total Pages:** ~3,500  
**Levels:** 2 (City + Subniche)

