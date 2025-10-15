# Schema.org Implementation Plan
**Personal Injury Landing Page - LawProactive**  
**Version:** 1.0  
**Date:** January 2025

---

## Overview

This document outlines the complete implementation strategy for adding comprehensive schema.org structured data to the personal injury landing pages.

---

## Phase 1: Critical Fixes (Week 1)

### 1.1 Add FAQPage Schema

**Priority:** 🔴 CRITICAL  
**Impact:** Enables FAQ rich snippets in Google search results  
**Estimated Time:** 2-3 hours

#### Implementation Steps:

1. **Create new utility function** in `lib/seo.ts`:
   ```typescript
   export function generateFAQPageSchema(
     faqItems: Array<{ question: string; answer: string }>,
     baseUrl: string,
     pageUrl: string
   )
   ```

2. **Add to city pages** (`app/[state]/[city]/page.tsx`):
   - Generate FAQ schema from existing `faqItems` array
   - Add second `<script type="application/ld+json">` tag

3. **Add to practice pages** (`app/[state]/[city]/[practice]/page.tsx`):
   - Use practice-specific FAQ items
   - Generate schema dynamically

#### Data Source:
- **Static:** FAQ items already defined in page components
- **Dynamic:** City/state names injected into questions

---

### 1.2 Replace Placeholder Data

**Priority:** 🔴 CRITICAL  
**Impact:** Trust, compliance, local SEO  
**Estimated Time:** 1 hour

#### Required Actions:

1. **Add environment variables** to `.env.local`:
   ```bash
   NEXT_PUBLIC_PHONE_NUMBER="+1-XXX-XXX-XXXX"
   NEXT_PUBLIC_BUSINESS_EMAIL="contact@lawproactive.com"
   NEXT_PUBLIC_BUSINESS_ADDRESS_STREET="123 Main Street"
   NEXT_PUBLIC_BUSINESS_ADDRESS_CITY="Los Angeles"
   NEXT_PUBLIC_BUSINESS_ADDRESS_STATE="CA"
   NEXT_PUBLIC_BUSINESS_ADDRESS_ZIP="90001"
   ```

2. **Update `lib/seo.ts`**:
   - Replace all `process.env.NEXT_PUBLIC_PHONE_NUMBER || "+1-800-123-4567"`
   - Add validation to ensure env vars are set

3. **Remove or fix hardcoded ratings**:
   - Option A: Remove `aggregateRating` entirely (recommended if no real reviews)
   - Option B: Use real review data from database/API

---

### 1.3 Add BreadcrumbList Schema

**Priority:** 🟡 HIGH  
**Impact:** Improved navigation in search results  
**Estimated Time:** 2 hours

#### Implementation:

1. **Create utility function** in `lib/seo.ts`:
   ```typescript
   export function generateBreadcrumbSchema(
     items: Array<{ name: string; url: string }>,
     baseUrl: string
   )
   ```

2. **Add to practice pages**:
   - Home → State → City → Practice Area
   - 4-level breadcrumb structure

#### Example Structure:
```
Home > California > Los Angeles > Car Accident Lawyer
```

---

## Phase 2: Enhanced LocalBusiness (Week 2)

### 2.1 Complete LocalBusiness Properties

**Priority:** 🔴 CRITICAL for Local SEO  
**Estimated Time:** 3-4 hours

#### Properties to Add:

1. **Physical Address** (PostalAddress):
   ```json
   "address": {
     "@type": "PostalAddress",
     "streetAddress": "123 Main Street",
     "addressLocality": "Los Angeles",
     "addressRegion": "CA",
     "postalCode": "90001",
     "addressCountry": "US"
   }
   ```

2. **Opening Hours**:
   ```json
   "openingHoursSpecification": [
     {
       "@type": "OpeningHoursSpecification",
       "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
       "opens": "09:00",
       "closes": "17:00"
     }
   ]
   ```

3. **Payment Methods**:
   ```json
   "paymentAccepted": "Cash, Credit Card, Check",
   "currenciesAccepted": "USD"
   ```

4. **Images**:
   ```json
   "image": [
     "https://personalinjury.lawproactive.com/images/office-front.jpg",
     "https://personalinjury.lawproactive.com/images/team-photo.jpg"
   ]
   ```

---

### 2.2 Add Practice Area Page Schemas

**Priority:** 🟡 HIGH  
**Impact:** Better visibility for specific practice areas  
**Estimated Time:** 3 hours

#### Schemas to Add:

1. **LegalService** (practice-specific)
2. **FAQPage** (practice-specific FAQs)
3. **BreadcrumbList** (navigation)
4. **Service** (detailed service offering)

#### Implementation:
- Create `generatePracticeAreaSchema()` function
- Add to `app/[state]/[city]/[practice]/page.tsx`

---

## Phase 3: WebSite & Organization (Week 3)

### 3.1 Complete WebSite Schema

**Priority:** 🟢 MEDIUM  
**Impact:** Enables sitelinks search box  
**Estimated Time:** 1-2 hours

#### Add to Root Layout (`app/layout.tsx`):

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://personalinjury.lawproactive.com#website",
  "url": "https://personalinjury.lawproactive.com",
  "name": "LawProactive Personal Injury Lawyers",
  "description": "Connect with top personal injury attorneys across the United States",
  "publisher": {
    "@id": "https://personalinjury.lawproactive.com#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://personalinjury.lawproactive.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

### 3.2 Enhanced Organization Schema

**Priority:** 🟢 MEDIUM  
**Estimated Time:** 1 hour

#### Properties to Add:

1. **Social Profiles** (sameAs):
   ```json
   "sameAs": [
     "https://www.facebook.com/lawproactive",
     "https://www.linkedin.com/company/lawproactive",
     "https://twitter.com/lawproactive"
   ]
   ```

2. **Founder/Employees** (if applicable):
   ```json
   "founder": {
     "@type": "Person",
     "name": "John Doe",
     "jobTitle": "Founder & CEO"
   }
   ```

---

## Phase 4: Advanced Enhancements (Month 2+)

### 4.1 Attorney/Person Schema

**Priority:** 🟢 LOW (Future)  
**Use Case:** Individual lawyer profile pages

```json
{
  "@type": "Attorney",
  "name": "Jane Smith",
  "jobTitle": "Personal Injury Attorney",
  "worksFor": {
    "@id": "https://personalinjury.lawproactive.com#organization"
  },
  "knowsAbout": ["Personal Injury Law", "Medical Malpractice"],
  "alumniOf": "Harvard Law School",
  "memberOf": "California State Bar"
}
```

---

### 4.2 Review Schema

**Priority:** 🟢 LOW (if real reviews exist)  
**Use Case:** Individual testimonials with schema

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "John Client"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "Excellent service, highly recommend!"
}
```

---

## Implementation Architecture

### File Structure:

```
lib/
  seo.ts (existing)
    ├── generateLocalBusinessStructuredData() [UPDATE]
    ├── generateFAQPageSchema() [NEW]
    ├── generateBreadcrumbSchema() [NEW]
    ├── generatePracticeAreaSchema() [NEW]
    ├── generateWebSiteSchema() [NEW]
    └── generateOrganizationSchema() [NEW]

app/
  layout.tsx [UPDATE - Add WebSite schema]
  [state]/[city]/
    page.tsx [UPDATE - Add FAQPage schema]
    [practice]/
      page.tsx [UPDATE - Add all schemas]
```

---

## Data Sources Strategy

### Static Data (Hardcoded):
- ✅ Service types
- ✅ Practice areas
- ✅ FAQ questions/answers
- ✅ Company name

### Environment Variables:
- ✅ Phone number
- ✅ Email
- ✅ Physical address
- ✅ Business hours
- ✅ Social media URLs

### Dynamic Data (Generated):
- ✅ City names
- ✅ State names
- ✅ URLs
- ✅ Coordinates (from city database)

### Future Database/API:
- ⏳ Real reviews
- ⏳ Attorney profiles
- ⏳ Case results
- ⏳ Blog posts

---

## Testing & Validation Checklist

### Pre-Deployment:

- [ ] Validate all schemas with Schema.org Validator
- [ ] Test with Google Rich Results Test
- [ ] Verify all environment variables are set
- [ ] Check JSON-LD syntax (no trailing commas, proper escaping)
- [ ] Ensure all URLs are absolute (not relative)
- [ ] Verify phone numbers are in E.164 format
- [ ] Test on staging environment

### Post-Deployment:

- [ ] Submit updated sitemap to Google Search Console
- [ ] Monitor for rich result eligibility (2-4 weeks)
- [ ] Check for structured data errors in GSC
- [ ] Verify FAQ rich snippets appear in search
- [ ] Monitor click-through rates for pages with rich results

---

## Deployment Strategy

### Recommended Approach: **Incremental Rollout**

1. **Week 1:** Deploy FAQPage schema only
   - Monitor for errors
   - Validate rich results appear

2. **Week 2:** Add BreadcrumbList + LocalBusiness enhancements
   - Test local search visibility
   - Monitor GSC for issues

3. **Week 3:** Add WebSite schema + Organization updates
   - Complete implementation
   - Final validation

### Rollback Plan:

- Keep previous version of `lib/seo.ts` in git
- If errors occur, revert specific schema types
- Monitor Google Search Console for manual actions

---

## Maintenance & Updates

### Monthly Tasks:
- Review Google Search Console for structured data errors
- Update review count if using real reviews
- Verify all URLs are still valid
- Check for new schema.org types relevant to legal services

### Quarterly Tasks:
- Audit competitor schemas for new opportunities
- Update FAQ content and schema
- Review and update business hours/contact info

---

## Success Metrics

### Key Performance Indicators:

1. **Rich Result Eligibility:** 100% of pages eligible within 4 weeks
2. **FAQ Rich Snippets:** Appear for target keywords within 6 weeks
3. **Click-Through Rate:** +15-25% increase for pages with rich results
4. **Local Pack Visibility:** Improved rankings in local search
5. **Zero Errors:** No structured data errors in Google Search Console

---

## Risk Assessment

| **Risk** | **Probability** | **Impact** | **Mitigation** |
|----------|----------------|-----------|----------------|
| Invalid JSON-LD syntax | Low | High | Automated validation in CI/CD |
| Hardcoded data mismatch | Medium | Medium | Use environment variables |
| Google policy violation | Low | High | Follow Google guidelines strictly |
| Performance impact | Low | Low | JSON-LD is lightweight |
| Duplicate schemas | Medium | Medium | Use @id for entity linking |

---

## Budget & Resources

### Time Estimate:
- **Phase 1:** 5-6 hours
- **Phase 2:** 6-7 hours
- **Phase 3:** 2-3 hours
- **Testing:** 3-4 hours
- **Total:** ~20 hours

### Required Resources:
- 1 Developer (familiar with Next.js & TypeScript)
- Access to Google Search Console
- Real business data (phone, address, hours)
- Staging environment for testing

---

**Plan Status:** ✅ READY FOR APPROVAL  
**Next Document:** `SCHEMA_CODE_SNIPPETS.md`

