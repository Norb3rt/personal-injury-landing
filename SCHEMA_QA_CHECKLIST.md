# Schema.org QA Checklist & Testing Guide
**Personal Injury Landing Page - LawProactive**  
**Version:** 1.0  
**Date:** January 2025

---

## Pre-Deployment Checklist

### 1. Environment Variables Verification

**Before deploying, verify all required environment variables are set:**

- [ ] `NEXT_PUBLIC_PHONE_NUMBER` - Real phone number in E.164 format (+1-XXX-XXX-XXXX)
- [ ] `NEXT_PUBLIC_COMPANY_NAME` - Company name matches branding
- [ ] `NEXT_PUBLIC_BUSINESS_ADDRESS_STREET` - Complete street address
- [ ] `NEXT_PUBLIC_BUSINESS_ADDRESS_CITY` - City name
- [ ] `NEXT_PUBLIC_BUSINESS_ADDRESS_STATE` - State abbreviation (e.g., "CA")
- [ ] `NEXT_PUBLIC_BUSINESS_ADDRESS_ZIP` - ZIP code
- [ ] `NEXT_PUBLIC_DOMAIN` - Production domain URL

**Optional (only if you have real data):**
- [ ] `NEXT_PUBLIC_AGGREGATE_RATING` - Real average rating
- [ ] `NEXT_PUBLIC_REVIEW_COUNT` - Real review count
- [ ] `NEXT_PUBLIC_FACEBOOK_URL` - Facebook profile URL
- [ ] `NEXT_PUBLIC_LINKEDIN_URL` - LinkedIn profile URL
- [ ] `NEXT_PUBLIC_TWITTER_URL` - Twitter profile URL

---

### 2. Code Implementation Verification

#### 2.1 File Updates Completed

- [ ] `lib/seo.ts` - All new utility functions added
  - [ ] `generateFAQPageSchema()`
  - [ ] `generateBreadcrumbSchema()`
  - [ ] `generateWebSiteSchema()`
  - [ ] `generatePracticeAreaSchema()`
  - [ ] Updated `generateLocalBusinessStructuredData()`

- [ ] `app/layout.tsx` - WebSite schema added
- [ ] `app/[state]/[city]/page.tsx` - FAQPage schema added
- [ ] `app/[state]/[city]/[practice]/page.tsx` - All schemas added
  - [ ] FAQPage schema
  - [ ] BreadcrumbList schema
  - [ ] Practice area LegalService schema

#### 2.2 Code Quality Checks

- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint warnings
- [ ] All imports are correct
- [ ] No console errors in browser
- [ ] JSON-LD syntax is valid (no trailing commas)
- [ ] All URLs are absolute (not relative)
- [ ] Phone numbers are in E.164 format

---

### 3. Schema Validation

#### 3.1 Schema.org Validator

**URL:** https://validator.schema.org/

**Test each page type:**

- [ ] **Homepage** (`/`)
  - [ ] WebSite schema validates
  - [ ] Organization schema validates
  - [ ] No errors or critical warnings

- [ ] **City Page** (`/california/los-angeles`)
  - [ ] LegalService schema validates
  - [ ] WebPage schema validates
  - [ ] Organization schema validates
  - [ ] FAQPage schema validates
  - [ ] All @id references are correct
  - [ ] No errors or critical warnings

- [ ] **Practice Page** (`/california/los-angeles/car-accident`)
  - [ ] LegalService schema validates
  - [ ] FAQPage schema validates
  - [ ] BreadcrumbList schema validates
  - [ ] All @id references are correct
  - [ ] No errors or critical warnings

#### 3.2 Google Rich Results Test

**URL:** https://search.google.com/test/rich-results

**Test each page type and verify:**

- [ ] **City Page**
  - [ ] FAQPage eligible for rich results
  - [ ] No errors
  - [ ] Preview shows FAQ accordion

- [ ] **Practice Page**
  - [ ] FAQPage eligible for rich results
  - [ ] BreadcrumbList eligible for rich results
  - [ ] No errors
  - [ ] Preview shows breadcrumbs

**Expected Warnings (acceptable):**
- "The aggregateRating field is recommended" (if not using real reviews)
- "The image field is recommended" (if no images added yet)

**Unacceptable Errors:**
- Invalid JSON syntax
- Missing required fields
- Invalid URL format
- Invalid phone number format

---

### 4. Content Accuracy Verification

#### 4.1 Data Matching

**Verify schema data matches visible page content:**

- [ ] **Phone Number**
  - [ ] Schema phone matches footer phone
  - [ ] Schema phone matches contact section
  - [ ] Format is consistent (E.164)

- [ ] **Business Name**
  - [ ] Schema name matches header/footer
  - [ ] Schema name matches meta tags

- [ ] **Address** (if displayed on page)
  - [ ] Schema address matches visible address
  - [ ] All components are correct (street, city, state, zip)

- [ ] **FAQ Content**
  - [ ] Schema questions match visible FAQ questions
  - [ ] Schema answers match visible FAQ answers
  - [ ] No truncation or formatting issues

- [ ] **Breadcrumbs**
  - [ ] Schema breadcrumbs match visible breadcrumbs
  - [ ] URLs are correct
  - [ ] Order is correct (Home → State → City → Practice)

#### 4.2 Dynamic Data Verification

**Test with multiple cities/states:**

- [ ] Los Angeles, California
  - [ ] City name correct in schema
  - [ ] Coordinates correct
  - [ ] URL correct

- [ ] San Francisco, California
  - [ ] City name correct in schema
  - [ ] Coordinates correct
  - [ ] URL correct

- [ ] Houston, Texas (if multi-state)
  - [ ] State name correct in schema
  - [ ] City name correct in schema
  - [ ] URL correct

---

### 5. Technical SEO Checks

#### 5.1 Page Performance

- [ ] JSON-LD doesn't significantly impact page load time
- [ ] No render-blocking issues
- [ ] Lighthouse SEO score ≥ 90

#### 5.2 Duplicate Schema Prevention

- [ ] No duplicate @type declarations on same page
- [ ] @id values are unique across schemas
- [ ] No conflicting schema data

#### 5.3 Mobile Compatibility

- [ ] Schema renders correctly on mobile
- [ ] No mobile-specific errors in Rich Results Test
- [ ] FAQ rich results work on mobile preview

---

## Post-Deployment Checklist

### 1. Google Search Console Verification

**Within 24-48 hours of deployment:**

- [ ] Submit updated sitemap to GSC
- [ ] Request indexing for key pages
- [ ] Monitor "Enhancements" section for:
  - [ ] FAQ rich results
  - [ ] Breadcrumb rich results
  - [ ] No errors reported

**Within 1-2 weeks:**

- [ ] Check "Rich Results" report in GSC
- [ ] Verify pages are eligible for rich results
- [ ] Address any errors or warnings

---

### 2. Live Testing

#### 2.1 Manual Testing

**Test on production URLs:**

- [ ] View page source - verify JSON-LD is present
- [ ] Copy JSON-LD and validate at schema.org
- [ ] Test with Google Rich Results Test (live URL)
- [ ] Verify no console errors

#### 2.2 Search Appearance Testing

**After 2-4 weeks (time for Google to process):**

- [ ] Search for target keywords
- [ ] Check if FAQ rich snippets appear
- [ ] Check if breadcrumbs appear in search results
- [ ] Monitor click-through rates

---

### 3. Monitoring & Maintenance

#### 3.1 Weekly Checks (First Month)

- [ ] Check Google Search Console for structured data errors
- [ ] Monitor rich result eligibility
- [ ] Review any manual actions or warnings

#### 3.2 Monthly Checks (Ongoing)

- [ ] Verify all environment variables are still correct
- [ ] Update FAQ content if needed
- [ ] Check for new schema.org types relevant to legal services
- [ ] Review competitor schemas for new opportunities

---

## Testing Scenarios

### Scenario 1: New City Page

**When adding a new city:**

1. [ ] Generate page
2. [ ] Verify schema includes correct city name
3. [ ] Verify coordinates are correct (if using geo data)
4. [ ] Test with Rich Results Test
5. [ ] Submit to GSC for indexing

### Scenario 2: Content Updates

**When updating FAQ content:**

1. [ ] Update FAQ items in code
2. [ ] Verify schema updates automatically
3. [ ] Re-validate with schema.org validator
4. [ ] Request re-indexing in GSC

### Scenario 3: Business Info Changes

**When changing phone/address:**

1. [ ] Update environment variables
2. [ ] Redeploy application
3. [ ] Verify schema reflects new data
4. [ ] Test with Rich Results Test
5. [ ] Monitor GSC for any issues

---

## Common Issues & Solutions

### Issue 1: "Invalid JSON-LD syntax"

**Symptoms:** Schema validator shows syntax error  
**Causes:**
- Trailing commas in JSON
- Unescaped quotes in text
- Missing closing braces

**Solution:**
- Use JSON.stringify() (already implemented)
- Validate JSON before deployment
- Use TypeScript for type safety

---

### Issue 2: "Missing required field"

**Symptoms:** Rich Results Test shows error  
**Causes:**
- Environment variable not set
- Conditional logic excluding required field

**Solution:**
- Verify all env vars are set
- Check conditional logic in schema generation
- Add fallback values where appropriate

---

### Issue 3: "URL must be absolute"

**Symptoms:** Validator shows URL error  
**Causes:**
- Using relative URLs (e.g., "/about")
- Missing baseUrl parameter

**Solution:**
- Always use absolute URLs in schema
- Ensure baseUrl is passed to all schema functions
- Verify URLs start with "http://" or "https://"

---

### Issue 4: "Duplicate schema detected"

**Symptoms:** Multiple schemas of same type on page  
**Causes:**
- Schema added in multiple places
- Parent/child components both adding schema

**Solution:**
- Use @id to link related schemas
- Consolidate schemas into single @graph
- Remove duplicate declarations

---

## Validation Tools Reference

### Online Tools

1. **Schema.org Validator**
   - URL: https://validator.schema.org/
   - Use: Validate JSON-LD syntax and structure
   - Best for: Initial validation

2. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Use: Test rich result eligibility
   - Best for: Pre-deployment testing

3. **Google Search Console**
   - URL: https://search.google.com/search-console
   - Use: Monitor live structured data
   - Best for: Post-deployment monitoring

### Browser Extensions

1. **Structured Data Testing Tool** (Chrome)
2. **Schema.org Validator** (Firefox)
3. **SEO Meta in 1 Click** (Chrome/Firefox)

### Command Line Tools

```bash
# Validate JSON syntax
cat schema.json | jq .

# Extract JSON-LD from HTML
curl https://example.com | grep -o '<script type="application/ld+json">.*</script>'
```

---

## Success Criteria

### Immediate (Post-Deployment)

- ✅ Zero errors in Schema.org Validator
- ✅ Zero errors in Google Rich Results Test
- ✅ All required environment variables set
- ✅ Schema data matches visible content

### Short-term (2-4 Weeks)

- ✅ Pages eligible for rich results in GSC
- ✅ FAQ rich snippets appear in search results
- ✅ Breadcrumbs appear in search results
- ✅ Zero structured data errors in GSC

### Long-term (2-3 Months)

- ✅ 15-25% increase in CTR for pages with rich results
- ✅ Improved local search visibility
- ✅ Higher rankings for target keywords
- ✅ Increased organic traffic

---

## Rollback Procedure

**If critical errors are detected:**

1. **Immediate Actions:**
   - [ ] Revert to previous deployment
   - [ ] Document the error
   - [ ] Notify stakeholders

2. **Investigation:**
   - [ ] Identify root cause
   - [ ] Test fix in staging
   - [ ] Re-validate with all tools

3. **Re-deployment:**
   - [ ] Deploy fix
   - [ ] Re-run all validation tests
   - [ ] Monitor GSC for 48 hours

---

**Document Status:** ✅ READY FOR USE  
**Last Updated:** January 2025  
**Next Review:** After first deployment

