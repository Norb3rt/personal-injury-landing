# Subniche Pages System Documentation

## Overview

This document describes the implementation of the multi-level programmatic SEO system that generates individual pages for each practice area (subniche) within each city.

## Architecture

### URL Structure

```
/[state]/[city]/                    → City landing page (macro level)
/[state]/[city]/[practice]/         → Practice area page (subniche level)
```

**Examples:**
- `/california/los-angeles/` → Los Angeles city page
- `/california/los-angeles/car-accident/` → Car accident lawyers in Los Angeles
- `/california/los-angeles/slip-and-fall/` → Slip and fall lawyers in Los Angeles

## Components

### 1. Practice Areas Configuration
**File:** `lib/data/practice-areas-config.ts`

Defines all practice areas with:
- Name and slug
- Icon and descriptions
- Keywords for SEO
- Common injuries
- FAQ items specific to each practice area

**Practice Areas:**
1. Car Accidents (`car-accident`)
2. Slip & Fall (`slip-and-fall`)
3. Medical Malpractice (`medical-malpractice`)
4. Workplace Injuries (`workplace-injury`)
5. Product Liability (`product-liability`)
6. Wrongful Death (`wrongful-death`)

### 2. Subniche Page Template
**File:** `app/[state]/[city]/[practice]/page.tsx`

Dynamic page that:
- Validates location and practice area
- Generates SEO metadata
- Displays practice-specific content
- Links back to city page (parent)
- Links to other practice areas (siblings)
- Includes practice-specific FAQs

**Key Features:**
- Reuses same visual style as city pages
- Dynamic content based on practice area and location
- Internal linking for SEO
- Lead capture forms with practice area context

### 3. Modified City Page
**File:** `app/[state]/[city]/page.tsx`

The "Personal Injury Services" section now:
- Links to subniche pages instead of opening modals
- Each service card is clickable
- Button text changed to "Learn More →"
- Maintains visual consistency

### 4. Sitemap System

#### Sitemap Index
**File:** `app/sitemap-index.xml/route.ts`

Master sitemap that references:
- Main sitemap (`sitemap.xml`)
- Cities sitemap (`sitemap-cities.xml`)
- Subniches sitemap (`sitemap-subniches.xml`)

#### Cities Sitemap
**File:** `app/sitemap-cities.xml/route.ts`

Generates URLs for all city pages:
- 500+ city pages
- Priority based on city size
- Weekly update frequency

#### Subniches Sitemap
**File:** `app/sitemap-subniches.xml/route.ts`

Generates URLs for all practice area pages:
- 3,000+ subniche pages (500 cities × 6 practice areas)
- Priority based on city size and practice area demand
- Weekly update frequency

### 5. Robots.txt
**File:** `app/robots.txt`

Updated to reference:
- Sitemap index (primary)
- Individual sitemaps (for redundancy)

## Page Generation

### Static Generation

Both city and subniche pages use Next.js `generateStaticParams()`:

```typescript
// City pages: ~500 pages
generateStaticParams() → [
  { state: 'california', city: 'los-angeles' },
  { state: 'california', city: 'san-francisco' },
  ...
]

// Subniche pages: ~3,000 pages
generateStaticParams() → [
  { state: 'california', city: 'los-angeles', practice: 'car-accident' },
  { state: 'california', city: 'los-angeles', practice: 'slip-and-fall' },
  { state: 'california', city: 'san-francisco', practice: 'car-accident' },
  ...
]
```

### Build Process

1. **Data Loading:** StateDataLoader fetches all locations
2. **Page Generation:** Next.js generates static HTML for each combination
3. **Sitemap Generation:** Dynamic routes generate XML sitemaps
4. **Deployment:** All pages deployed as static files

## Internal Linking Strategy

### Hierarchical Structure

```
City Page (Parent)
├── Car Accident Page (Child)
├── Slip & Fall Page (Child)
├── Medical Malpractice Page (Child)
├── Workplace Injury Page (Child)
├── Product Liability Page (Child)
└── Wrongful Death Page (Child)
```

### Link Types

1. **Parent → Child:** City page links to all practice areas
2. **Child → Parent:** Each practice page links back to city page
3. **Child → Sibling:** Each practice page links to other practice areas

### SEO Benefits

- **Topic Clustering:** Groups related content
- **Link Equity Distribution:** Passes authority through internal links
- **User Navigation:** Easy to explore related services
- **Crawlability:** Search engines can discover all pages

## SEO Optimization

### Metadata

Each subniche page has unique:
- Title: `{Practice Area} Lawyer in {City}, {State} | Free Consultation`
- Description: Practice-specific with location
- Keywords: Combination of practice and location keywords
- OpenGraph tags for social sharing

### Content Strategy

1. **Unique Content:** Each practice area has distinct content
2. **Location Context:** City and state mentioned throughout
3. **Practice-Specific FAQs:** Relevant questions for each area
4. **Common Injuries:** Lists specific to practice area
5. **Internal Links:** Strategic linking to related pages

### Priority System

**City Pages:**
- Major cities: 1.0 (highest)
- Large cities (>100k): 0.8
- Smaller cities: 0.6

**Subniche Pages:**
- Major city + high-demand practice: 0.9
- Major city + other practice: 0.8
- Large city + high-demand practice: 0.7
- Other combinations: 0.6

## Lead Capture Integration

All pages maintain the existing lead capture system:
- Two-step modal form
- Practice area pre-filled in form
- City and state context preserved
- Source tracking for analytics

## Performance Considerations

### Build Time
- ~3,500 total pages (500 cities + 3,000 subniches)
- Static generation at build time
- Incremental Static Regeneration (ISR) possible

### File Size
- Each page: ~50-100 KB
- Total: ~175-350 MB for all pages
- Gzip compression reduces by ~70%

### Caching
- Static pages cached at CDN edge
- Sitemaps cached for 1 hour
- No runtime data fetching required

## Maintenance

### Adding New Practice Areas

1. Add to `PRACTICE_AREAS` array in `practice-areas-config.ts`
2. Include: name, slug, icon, descriptions, keywords, FAQs
3. Rebuild site to generate new pages

### Adding New Cities

1. Add to state data files (JSON/CSV)
2. Rebuild site to generate new pages
3. Sitemaps automatically updated

### Updating Content

1. Modify templates in page files
2. Update practice area config for specific changes
3. Rebuild to apply changes to all pages

## Testing

### Local Development

```bash
npm run dev
```

Test URLs:
- http://localhost:3000/california/los-angeles/
- http://localhost:3000/california/los-angeles/car-accident/
- http://localhost:3000/sitemap-index.xml
- http://localhost:3000/sitemap-cities.xml
- http://localhost:3000/sitemap-subniches.xml

### Build Testing

```bash
npm run build
npm run start
```

Verify:
- All pages generate without errors
- Sitemaps contain all URLs
- Internal links work correctly
- Metadata is unique per page

## Analytics Tracking

Each page tracks:
- Source: `hero-{practice}`, `about-{practice}`, `final-cta-{practice}`
- City and State context
- Practice area (case type)

## Future Enhancements

### Potential Additions

1. **State-Level Pages:** `/california/` overview pages
2. **County Pages:** `/california/los-angeles-county/`
3. **More Practice Areas:** Add specialized niches
4. **Multilingual:** Spanish versions of pages
5. **Local Attorney Profiles:** Individual attorney pages
6. **Case Results:** Practice-specific case results by city

### Scalability

Current system can easily scale to:
- 50 states
- 5,000+ cities
- 10+ practice areas
- 50,000+ total pages

## Troubleshooting

### Common Issues

**404 Errors:**
- Verify location exists in state data
- Check practice area slug matches config
- Ensure build completed successfully

**Duplicate Content:**
- Each page has unique metadata
- Content varies by practice area
- Location context throughout

**Slow Builds:**
- Use ISR for large deployments
- Consider splitting by state
- Optimize data loading

## Resources

- Next.js App Router: https://nextjs.org/docs/app
- Programmatic SEO: https://www.semrush.com/blog/programmatic-seo/
- Sitemap Protocol: https://www.sitemaps.org/protocol.html

## Support

For questions or issues:
1. Check this documentation
2. Review code comments
3. Test in local environment
4. Check build logs for errors

