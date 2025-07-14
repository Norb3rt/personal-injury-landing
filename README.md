# Personal Injury Landing Page - Programmatic SEO Ready

A Next.js 14 personal injury landing page optimized for programmatic SEO with Strapi Cloud API integration.

## 🚀 Features

### SEO Optimization
- ✅ Dynamic city-based routing (`/[city]`)
- ✅ Comprehensive metadata generation
- ✅ Structured data (JSON-LD) for local business
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Open Graph and Twitter Card optimization
- ✅ Geo-targeting with coordinates
- ✅ Core Web Vitals optimization

### Analytics & Tracking
- ✅ Google Analytics 4 integration
- ✅ Google Ads conversion tracking
- ✅ Facebook Pixel integration
- ✅ Lead conversion tracking
- ✅ Environment-based configuration

### CMS Integration
- ✅ Strapi Cloud API ready
- ✅ Dynamic content management
- ✅ Lead submission to Strapi
- ✅ Fallback for offline mode

### Performance
- ✅ Static site generation (SSG)
- ✅ Image optimization
- ✅ Compression enabled
- ✅ Optimized bundle size

## 🛠️ Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Required - Replace with your actual values
NEXT_PUBLIC_DOMAIN=https://your-domain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_PHONE_NUMBER=+1-800-123-4567

# Strapi Cloud Configuration
STRAPI_API_URL=https://your-strapi-instance.strapiapp.com/api
STRAPI_API_TOKEN=your-strapi-api-token

# Optional - Email and CRM integrations
SENDGRID_API_KEY=your-sendgrid-api-key
HUBSPOT_API_KEY=your-hubspot-api-key
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Development

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

### 4. Build for Production

```bash
pnpm build
# or
npm run build
# or
yarn build
```

## 📊 Strapi Cloud Setup

### Content Types Required

Create the following content types in your Strapi instance:

#### 1. Cities Collection
```json
{
  "name": "Text (required)",
  "slug": "Text (required, unique)",
  "state": "Text (required)",
  "population": "Number",
  "coordinates": "JSON",
  "seoTitle": "Text",
  "seoDescription": "Text",
  "seoKeywords": "JSON (array)",
  "localKeywords": "JSON (array)",
  "practiceAreas": "JSON (array)",
  "testimonials": "JSON (array)",
  "localStats": "JSON"
}
```

#### 2. Leads Collection
```json
{
  "firstName": "Text (required)",
  "lastName": "Text (required)",
  "email": "Email (required)",
  "phone": "Text (required)",
  "caseType": "Text (required)",
  "description": "Text",
  "city": "Text",
  "source": "Text",
  "status": "Enumeration (new, contacted, qualified, converted)",
  "submittedAt": "DateTime"
}
```

#### 3. Practice Areas Collection
```json
{
  "name": "Text (required)",
  "slug": "Text (required, unique)",
  "description": "Text",
  "icon": "Text",
  "seoTitle": "Text",
  "seoDescription": "Text",
  "keywords": "JSON (array)",
  "averageSettlement": "Text"
}
```

### API Permissions

Ensure the following permissions are set for the public role:
- Cities: `find`, `findOne`
- Practice Areas: `find`, `findOne`
- Leads: `create`

## 🎯 SEO Configuration

### 1. Update Domain References

Replace all instances of `https://your-domain.com` with your actual domain in:
- `app/layout.tsx`
- `app/[city]/page.tsx`
- `lib/seo.ts`
- `lib/strapi.ts`

### 2. Add City Coordinates

Update the `CALIFORNIA_CITIES` object in `lib/seo.ts` with accurate coordinates for each city.

### 3. Generate OG Images

Create Open Graph images for each city:
- Size: 1200x630 pixels
- Location: `public/og-images/[city-slug].jpg`
- Include city name and branding

### 4. Google Search Console

1. Verify your domain in Google Search Console
2. Submit your sitemap: `https://your-domain.com/sitemap.xml`
3. Monitor indexing status

## 📈 Analytics Setup

### Google Analytics 4
1. Create a GA4 property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Google Ads
1. Set up Google Ads account
2. Create conversion actions
3. Get your Conversion ID (AW-XXXXXXXXXX)
4. Add to `NEXT_PUBLIC_GOOGLE_ADS_ID`

### Facebook Pixel
1. Create Facebook Business account
2. Set up Facebook Pixel
3. Get your Pixel ID
4. Add to `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

### Custom Server
1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Ensure environment variables are set

## 🔧 Customization

### Adding New Cities
1. Add city data to `CALIFORNIA_CITIES` in `lib/seo.ts`
2. Include coordinates and local keywords
3. Generate OG image for the city
4. Rebuild and deploy

### Modifying Content
1. Update content in Strapi Cloud
2. Content will be automatically fetched
3. Fallback content is available if Strapi is unavailable

### Styling Changes
- Modify Tailwind classes in components
- Update `tailwind.config.ts` for theme changes
- Add custom CSS in `app/globals.css`

## 📋 SEO Checklist

- [ ] Domain configured in environment variables
- [ ] Google Analytics tracking ID added
- [ ] Google Ads conversion tracking configured
- [ ] Facebook Pixel ID added
- [ ] Strapi Cloud API connected
- [ ] City coordinates updated
- [ ] OG images generated for all cities
- [ ] Sitemap submitted to Google Search Console
- [ ] Robots.txt configured
- [ ] SSL certificate installed
- [ ] Core Web Vitals optimized
- [ ] Mobile responsiveness tested
- [ ] Page speed optimized

## 🆘 Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure Strapi API is accessible
4. Test in development mode first

## 📄 License

This project is licensed under the MIT License.
