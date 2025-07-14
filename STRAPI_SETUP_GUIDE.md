# Strapi Cloud Setup Guide for Programmatic SEO

This comprehensive guide will walk you through setting up Strapi Cloud API for your personal injury landing page's programmatic SEO needs.

## 🚀 Phase 1: Strapi Cloud Account Setup

### Step 1: Create Strapi Cloud Account

1. **Visit Strapi Cloud**: Go to [https://cloud.strapi.io](https://cloud.strapi.io)
2. **Sign Up**: Click "Start your free trial" or "Sign up"
3. **Choose Plan**: 
   - **Free Plan**: Good for development and testing (up to 2 content types, 1GB storage)
   - **Pro Plan**: Recommended for production ($99/month, unlimited content types)
4. **Verify Email**: Check your email and verify your account

### Step 2: Create New Project

1. **Click "Create Project"**
2. **Project Configuration**:
   - **Project Name**: `personal-injury-seo`
   - **Region**: Choose closest to your target audience (US East/West)
   - **Template**: Select "Start from scratch"
3. **Wait for Deployment**: This takes 2-3 minutes

### Step 3: Access Your Strapi Instance

1. **Get Your URLs**:
   - **Admin Panel**: `https://your-project-name.strapiapp.com/admin`
   - **API Base URL**: `https://your-project-name.strapiapp.com/api`
2. **Create Admin Account**:
   - First Name: Your name
   - Last Name: Your last name
   - Email: Your email
   - Password: Strong password (save this!)

## 📊 Phase 2: Content Types Creation

### Step 1: Create Cities Content Type

1. **Navigate to Content-Types Builder** (left sidebar)
2. **Click "Create new collection type"**
3. **Display Name**: `City`
4. **API ID**: `city` (auto-generated)
5. **Advanced Settings**: 
   - ✅ Draft & Publish
   - ✅ Internationalization (if needed)

#### City Fields Configuration:

**Basic Information:**
```
1. name (Text - Required)
   - Type: Text
   - Name: name
   - Required: Yes
   - Unique: No

2. slug (Text - Required, Unique)
   - Type: Text  
   - Name: slug
   - Required: Yes
   - Unique: Yes
   - Regex Pattern: ^[a-z0-9-]+$

3. state (Text - Required)
   - Type: Text
   - Name: state
   - Required: Yes
   - Default: "CA"

4. population (Number)
   - Type: Number
   - Name: population
   - Number Format: Integer
```

**SEO Fields:**
```
5. seoTitle (Text - Required)
   - Type: Text
   - Name: seoTitle
   - Required: Yes
   - Max Length: 60

6. seoDescription (Text - Required)
   - Type: Text
   - Name: seoDescription
   - Required: Yes
   - Max Length: 160

7. seoKeywords (JSON)
   - Type: JSON
   - Name: seoKeywords
   - Description: Array of SEO keywords

8. localKeywords (JSON)
   - Type: JSON
   - Name: localKeywords
   - Description: Local-specific keywords
```

**Location & Content:**
```
9. coordinates (JSON - Required)
   - Type: JSON
   - Name: coordinates
   - Required: Yes
   - Description: {lat: number, lng: number}

10. practiceAreas (JSON)
    - Type: JSON
    - Name: practiceAreas
    - Description: Array of practice areas

11. testimonials (JSON)
    - Type: JSON
    - Name: testimonials
    - Description: Array of testimonial objects

12. localStats (JSON)
    - Type: JSON
    - Name: localStats
    - Description: Local statistics object
```

### Step 2: Create Leads Content Type

1. **Create new collection type**: `Lead`
2. **API ID**: `lead`

#### Lead Fields Configuration:

```
1. firstName (Text - Required)
2. lastName (Text - Required)  
3. email (Email - Required)
4. phone (Text - Required)
5. caseType (Text - Required)
6. accidentDate (Date)
7. urgency (Enumeration)
   - Values: low, medium, high, urgent
8. description (Text - Required)
9. consent (Boolean - Required)
10. city (Text - Required)
11. source (Text - Required)
12. status (Enumeration - Required)
    - Values: new, contacted, qualified, converted
    - Default: new
13. submittedAt (DateTime - Required)
14. notes (Rich Text)
```

### Step 3: Create Practice Areas Content Type

1. **Create new collection type**: `Practice Area`
2. **API ID**: `practice-area`

#### Practice Area Fields:

```
1. name (Text - Required)
2. slug (Text - Required, Unique)
3. description (Rich Text)
4. icon (Text) - For emoji or icon class
5. seoTitle (Text)
6. seoDescription (Text)
7. keywords (JSON)
8. averageSettlement (Text)
9. featured (Boolean) - Default: false
```

## 🔐 Phase 3: API Permissions Configuration

### Step 1: Configure Public Role Permissions

1. **Navigate to Settings → Roles → Public**
2. **Configure Permissions**:

**Cities Collection:**
- ✅ `find` - Allow fetching all cities
- ✅ `findOne` - Allow fetching single city
- ❌ `create` - Deny
- ❌ `update` - Deny  
- ❌ `delete` - Deny

**Practice Areas Collection:**
- ✅ `find` - Allow fetching all practice areas
- ✅ `findOne` - Allow fetching single practice area
- ❌ `create` - Deny
- ❌ `update` - Deny
- ❌ `delete` - Deny

**Leads Collection:**
- ❌ `find` - Deny (sensitive data)
- ❌ `findOne` - Deny (sensitive data)
- ✅ `create` - Allow lead submission
- ❌ `update` - Deny
- ❌ `delete` - Deny

3. **Click "Save"**

### Step 2: Create API Token

1. **Navigate to Settings → API Tokens**
2. **Click "Create new API Token"**
3. **Configuration**:
   - **Name**: `personal-injury-frontend`
   - **Description**: `Token for Next.js frontend`
   - **Token Duration**: `Unlimited`
   - **Token Type**: `Read-only` (for public content)
4. **Copy the token** - You'll need this for your `.env.local`

## 📝 Phase 4: Sample Data Creation

### Step 1: Add Sample Cities

1. **Navigate to Content Manager → Cities**
2. **Click "Create new entry"**
3. **Add Los Angeles Example**:

```json
{
  "name": "Los Angeles",
  "slug": "los-angeles",
  "state": "CA",
  "population": 3898747,
  "seoTitle": "Personal Injury Lawyer in Los Angeles, CA | Free Consultation",
  "seoDescription": "Injured in Los Angeles? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee. Call now for free case review.",
  "seoKeywords": [
    "personal injury lawyer Los Angeles",
    "car accident attorney Los Angeles", 
    "slip and fall lawyer Los Angeles",
    "medical malpractice attorney Los Angeles"
  ],
  "localKeywords": [
    "Hollywood accident lawyer",
    "Beverly Hills injury attorney",
    "Santa Monica personal injury",
    "Downtown LA accident lawyer"
  ],
  "coordinates": {
    "lat": 34.0522,
    "lng": -118.2437
  },
  "practiceAreas": [
    "Car Accidents",
    "Slip & Fall", 
    "Medical Malpractice",
    "Workplace Injuries",
    "Product Liability",
    "Wrongful Death"
  ],
  "testimonials": [
    {
      "name": "Maria Rodriguez",
      "rating": 5,
      "review": "Excellent service, got me the settlement I deserved after my car accident.",
      "caseType": "Car Accident"
    }
  ],
  "localStats": {
    "averageSettlement": "$125,000",
    "casesWon": 95,
    "yearsExperience": 15
  }
}
```

4. **Click "Save" and "Publish"**

### Step 2: Add More Cities

Repeat for other major California cities:
- Orange County
- San Diego  
- San Francisco
- Sacramento

## 🔗 Phase 5: Project Integration

### Step 1: Update Environment Variables

Update your `.env.local` file:

```env
# Strapi Cloud Configuration
STRAPI_API_URL=https://your-project-name.strapiapp.com/api
STRAPI_API_TOKEN=your-api-token-here

# Your domain
NEXT_PUBLIC_DOMAIN=https://your-domain.com
```

### Step 2: Test API Connection

1. **Test in browser**: Visit `https://your-project-name.strapiapp.com/api/cities`
2. **Should return**: JSON array of cities
3. **Test specific city**: `https://your-project-name.strapiapp.com/api/cities?filters[slug][$eq]=los-angeles`

## ✅ Phase 6: Verification & Testing

### Step 1: Test Strapi Integration

Run your Next.js development server:

```bash
npm run dev
```

Visit: `http://localhost:3000/los-angeles`

**Check for**:
- ✅ Page loads without errors
- ✅ SEO metadata is populated from Strapi
- ✅ Console shows "Lead successfully submitted to Strapi" when testing forms

### Step 2: Test Lead Submission

1. **Fill out contact form** on any city page
2. **Submit the form**
3. **Check Strapi Admin**: Navigate to Content Manager → Leads
4. **Verify**: New lead appears with all data

### Step 3: Test Fallback Mode

1. **Temporarily break Strapi connection** (wrong API URL)
2. **Reload page**: Should still work with fallback data
3. **Restore connection**: Verify dynamic content returns

## 🚀 Next Steps

After completing Strapi setup, you're ready for the final deployment steps:

1. **Generate OG Images** (covered in next phase)
2. **Deploy to Production** (Vercel/Netlify)
3. **Configure Domain & SSL**
4. **Submit to Search Console**

Your Strapi Cloud API is now fully integrated and ready for programmatic SEO! 🎉

## 🧪 Phase 7: Testing & Validation

### Step 1: Generate Sample Data

Run the data generation script:

```bash
npm run generate-strapi-data
```

This creates sample city data in the `strapi-data/` folder that you can import into Strapi.

### Step 2: Test Integration

Run the integration test script:

```bash
npm run test-strapi
```

This will test:
- ✅ API connection
- ✅ Cities endpoint
- ✅ Specific city queries
- ✅ Lead submission
- ✅ Practice areas

### Step 3: Manual Testing

1. **Start development server**: `npm run dev`
2. **Visit city page**: `http://localhost:3000/los-angeles`
3. **Check browser console** for Strapi connection logs
4. **Submit contact form** and verify lead appears in Strapi admin

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### 1. "Connection failed" Error
**Problem**: Cannot connect to Strapi API
**Solutions**:
- ✅ Verify `STRAPI_API_URL` in `.env.local`
- ✅ Check Strapi instance is running (visit admin panel)
- ✅ Ensure API token is correct
- ✅ Check network connectivity

#### 2. "No cities found" Warning
**Problem**: Cities endpoint returns empty array
**Solutions**:
- ✅ Add city data using the generated JSON files
- ✅ Ensure cities are **published** (not just saved as drafts)
- ✅ Check API permissions for public role

#### 3. "Lead submission failed" Error
**Problem**: Cannot submit leads to Strapi
**Solutions**:
- ✅ Verify Leads content type exists
- ✅ Check public role has `create` permission for Leads
- ✅ Ensure all required fields are configured correctly

#### 4. "Practice areas failed" Error
**Problem**: Cannot fetch practice areas
**Solutions**:
- ✅ Create Practice Areas content type
- ✅ Add sample practice area data
- ✅ Set public role permissions for `find`

#### 5. Page Shows Fallback Data
**Problem**: Page loads but uses static data instead of Strapi
**Solutions**:
- ✅ Check city slug matches exactly (e.g., "los-angeles")
- ✅ Verify city is published in Strapi
- ✅ Check browser network tab for API calls
- ✅ Ensure populate parameter is working

### Debug Mode

Add debug logging to your `.env.local`:

```env
NODE_ENV=development
DEBUG=strapi:*
```

This will show detailed API call logs in your console.

## 📊 Performance Optimization

### Caching Strategy

The integration includes built-in caching:
- **City data**: Revalidated every hour (`revalidate: 3600`)
- **Practice areas**: Revalidated daily (`revalidate: 86400`)
- **Static fallback**: Always available if Strapi is down

### Production Considerations

1. **API Rate Limits**: Strapi Cloud has rate limits - implement request caching
2. **Error Handling**: Graceful fallback to static data
3. **Monitoring**: Set up alerts for API failures
4. **Backup**: Export Strapi data regularly

## 🚀 Advanced Features

### Dynamic Sitemap with Strapi

Update `app/sitemap.ts` to fetch cities from Strapi:

```typescript
import { getAllCities } from '@/lib/strapi'

export default async function sitemap(): MetadataRoute.Sitemap {
  const strapiCities = await getAllCities()
  const cities = strapiCities.map(city => city.attributes.slug)

  return cities.map((city) => ({
    url: `${baseUrl}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
}
```

### Content Scheduling

Use Strapi's publish scheduling to:
- Launch new city pages automatically
- Update seasonal content
- Schedule promotional campaigns

### Multi-language Support

Enable Strapi's internationalization plugin for:
- Spanish language support
- Localized content per city
- Regional legal variations

## 📈 SEO Monitoring

### Key Metrics to Track

1. **Indexing Rate**: How quickly new cities get indexed
2. **Ranking Positions**: Track keyword rankings per city
3. **Organic Traffic**: Monitor traffic growth by location
4. **Conversion Rate**: Lead submissions per city page

### Recommended Tools

- **Google Search Console**: Monitor indexing and performance
- **SEMrush/Ahrefs**: Track keyword rankings
- **Google Analytics**: Traffic and conversion analysis
- **Strapi Analytics**: Content performance insights

Your Strapi Cloud integration is now complete and production-ready! 🎉
