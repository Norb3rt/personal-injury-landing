# Personal Injury Landing Page - Programmatic SEO Ready

A Next.js 14 personal injury landing page optimized for programmatic SEO with **Perfex CRM integration** and automated lead management system. Features 487 California cities with dynamic content generation and seamless CRM integration.

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

### CRM Integration
- ✅ **Perfex CRM REST API integration**
- ✅ **Automated lead capture and processing**
- ✅ **Custom source tracking ("Personal Injury")**
- ✅ **Structured lead data with case details**
- ✅ **Form-data API format support**
- ✅ **Real-time lead submission**
- ✅ **Comprehensive error handling**
- ✅ **Local fallback system**

### Performance & Technical
- ✅ Static site generation (SSG) for 487 cities
- ✅ Image optimization with Next.js
- ✅ Compression enabled
- ✅ Optimized bundle size
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Responsive design for all devices
- ✅ Fast page load times

## 🎯 Perfex CRM Integration Features

### Lead Capture & Processing
- **Comprehensive form data**: Captures name, email, phone, case type, accident date, urgency, and description
- **Structured data format**: Organizes lead information in a professional format within Perfex CRM
- **Custom source tracking**: Automatically assigns "Personal Injury" source (ID 4) to all leads
- **Real-time submission**: Instant lead processing with immediate feedback
- **Error handling**: Robust error management with local fallback storage

### Lead Data Structure
Each lead includes:
- **📋 CASE DETAILS**: Type of case, accident date, urgency level
- **📝 DESCRIPTION**: Client's detailed description of their situation
- **👤 CONTACT INFO**: Name, email, phone number, city
- **🏷️ METADATA**: Source tracking, timestamp, form location

### Supported Case Types
- 🚗 **Car Accident**: Motor vehicle collision cases
- 🏥 **Slip & Fall**: Premises liability incidents
- 🩺 **Medical Malpractice**: Healthcare negligence cases
- 🏭 **Workplace Injury**: Work-related accident claims
- 📦 **Product Liability**: Defective product injuries
- ⚰️ **Wrongful Death**: Fatal accident cases
- 📋 **Other**: Additional case types

### Urgency Levels
- 🔴 **Immediate (24 hours)**: Critical cases requiring immediate attention
- 🟡 **Urgent (1 week)**: High-priority cases needing quick response
- 🟢 **Normal (1 month)**: Standard cases with regular processing
- 🔵 **Planning (Future)**: Consultation planning cases

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create your `.env.local` file with the following configuration:

```bash
# Copy the provided .env.local file or create a new one
```

**Required Environment Variables:**

```env
# Perfex CRM API Configuration (Primary)
PERFEX_API_URL=https://your-perfex-instance.com/api
PERFEX_API_TOKEN=your-jwt-token-here
PERFEX_ADMIN_EMAIL=admin@yourcompany.com

# Analytics & Tracking
NEXT_PUBLIC_DOMAIN=https://your-domain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_PHONE_NUMBER=+1-800-123-4567
```

**Example .env.local:**
```env
# Perfex CRM API Configuration
PERFEX_API_URL=https://olive-porcupine-600254.hostingersite.com/api
PERFEX_API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiTm9yYmVydCIsIm5hbWUiOiJOb3JiZXJ0IiwiQVBJX1RJTUUiOjE3NTI1NDkzODZ9.oJeS18ED5jKzKQ6qs4RN0Ne1mUdd0T1sqkiQTiye890
PERFEX_ADMIN_EMAIL=admin@tuempresa.com
```

### 2. Perfex CRM Setup

**Step 1: Create Lead Source**
1. Go to **Setup → Lead Sources** in your Perfex CRM
2. Create a new source called **"Personal Injury"**
3. Note the Source ID (should be 4 if it's your first custom source)

**Step 2: Create Custom Fields (Optional)**
If you want the case details to appear as separate fields instead of in the description:

1. Go to **Setup → Custom Fields**
2. Select **"Leads"** from the dropdown
3. Create these fields:

**case_type** (Select/Dropdown):
- Field Name: `case_type`
- Type: Select
- Options: `Car Accident,Slip & Fall,Medical Malpractice,Workplace Injury,Product Liability,Wrongful Death,Other`

**accident_date** (Date):
- Field Name: `accident_date`
- Type: Date

**urgency** (Select/Dropdown):
- Field Name: `urgency`
- Type: Select
- Options: `High,Medium,Low`

**Note:** Even without custom fields, all lead information will be properly organized in the lead's description field.

### 3. Install Dependencies

```bash
npm install
```

### 4. Development

```bash
# Start the development server
npm run dev

# Process California cities data (if needed)
npm run process-california-cities

# Access the application
# Landing page: http://localhost:3000
# City-specific pages: http://localhost:3000/los-angeles
# API test: http://localhost:3000/api/perfex/test-connection
```

### 5. Test Perfex CRM Integration

```bash
# Test the connection to your Perfex CRM
curl http://localhost:3000/api/perfex/test-connection

# Test lead submission
curl -X POST http://localhost:3000/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "caseType": "car-accident",
    "urgency": "urgent",
    "description": "Test lead submission",
    "city": "Los Angeles",
    "accidentDate": "2024-01-15",
    "consent": true
  }'
```

### 6. Build for Production

```bash
npm run build
npm start
```

## 📊 California Cities Coverage

This landing page includes **487 California cities** with programmatic SEO optimization:

### Major Cities Included
- Los Angeles, San Francisco, San Diego, Sacramento, Fresno
- Oakland, Bakersfield, Long Beach, Anaheim, Santa Ana
- Riverside, Stockton, Irvine, Chula Vista, Fremont
- And 472 more cities across California

### Dynamic Content Features
- **City-specific URLs**: Each city has its own optimized landing page
- **Local SEO optimization**: Tailored meta tags and content for each location
- **Geographic targeting**: Precise coordinates and local keywords
- **Structured data**: JSON-LD markup for local business optimization

### Content Structure
Each city page includes:
- **Hero section** with city-specific messaging
- **Practice areas** relevant to local laws and regulations
- **Local statistics** and demographic information
- **Contact forms** with city pre-filled
- **SEO optimization** with local keywords and meta tags

## 🎯 SEO Configuration

### 1. Update Domain References

Replace all instances of `https://your-domain.com` with your actual domain in:
- `app/layout.tsx`
- `app/[city]/page.tsx`
- `lib/seo.ts`
- Environment variables

### 2. Verify City Data

The `CALIFORNIA_CITIES` object in `data/california-cities.ts` includes:
- 487 California cities with coordinates
- Population data and local keywords
- SEO-optimized slugs and metadata

### 3. Generate OG Images (Optional)

Create Open Graph images for each city:
- Size: 1200x630 pixels
- Location: `public/og-images/[city-slug].jpg`
- Include city name and branding

### 4. Google Search Console

1. Verify your domain in Google Search Console
2. Submit your sitemap: `https://your-domain.com/sitemap.xml`
3. Monitor indexing status for all 487 city pages

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

## 📁 Project Structure

```
personal-injury-landing/
├── app/                          # Next.js 14 App Router
│   ├── [city]/                   # Dynamic city pages (487 cities)
│   ├── api/                      # API routes
│   │   ├── perfex/              # Perfex CRM integration
│   │   └── submit-lead/         # Lead submission endpoint
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── two-step-lead-modal.tsx  # Main lead capture form
│   └── ...                     # Other UI components
├── data/                        # Static data
│   └── california-cities.ts     # 487 California cities data
├── lib/                         # Utilities and business logic
│   ├── perfex/                  # Perfex CRM integration
│   │   ├── api.ts              # API client
│   │   └── simple-leads.ts     # Lead processing
│   ├── actions.ts               # Server actions
│   ├── seo.ts                   # SEO utilities
│   └── utils.ts                 # General utilities
├── public/                      # Static assets
├── scripts/                     # Build and utility scripts
└── .env.local                   # Environment variables
```

## 🔧 Customization

### Adding New Cities
1. Add city data to `CALIFORNIA_CITIES` in `data/california-cities.ts`
2. Include coordinates, population, and local keywords
3. Rebuild and deploy to generate new static pages

### Modifying Lead Form
1. Update form fields in `components/two-step-lead-modal.tsx`
2. Modify data mapping in `lib/perfex/simple-leads.ts`
3. Update Perfex CRM custom fields if needed

### Styling Changes
- Modify Tailwind classes in components
- Update `tailwind.config.ts` for theme changes
- Add custom CSS in `app/globals.css`

### Content Updates
- Update static content in component files
- Modify SEO metadata in `lib/seo.ts`
- Update practice areas and testimonials as needed

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Perfex CRM API URL and token configured
- [ ] "Personal Injury" source created in Perfex CRM (ID 4)
- [ ] Domain configured in environment variables
- [ ] Google Analytics tracking ID added
- [ ] Google Ads conversion tracking configured
- [ ] Facebook Pixel ID added

### Post-Deployment
- [ ] Test lead submission functionality
- [ ] Verify leads appear in Perfex CRM with correct source
- [ ] Check all 487 city pages are accessible
- [ ] Submit sitemap to Google Search Console
- [ ] Verify SSL certificate installation
- [ ] Test mobile responsiveness
- [ ] Monitor Core Web Vitals
- [ ] Set up conversion tracking

## 🆘 Troubleshooting

### Common Issues

**Leads not appearing in Perfex CRM:**
1. Check Perfex API URL and token in `.env.local`
2. Verify "Personal Injury" source exists (ID 4)
3. Test connection: `curl http://localhost:3000/api/perfex/test-connection`
4. Check browser console for error messages

**Build errors:**
1. Ensure all dependencies are installed: `npm install`
2. Check for TypeScript errors: `npm run build`
3. Verify environment variables are set

**Performance issues:**
1. Enable static generation for better performance
2. Optimize images in `public/` directory
3. Monitor Core Web Vitals in production

### Support
For additional support:
1. Check the browser console for detailed error messages
2. Verify all environment variables are correctly set
3. Test the Perfex CRM connection independently
4. Ensure your Perfex CRM instance is accessible

## 📄 License

This project is licensed under the MIT License.
