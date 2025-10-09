# 🚀 CRM Integration Guide - Landing Page to CRM

## ✅ Status: FULLY FUNCTIONAL

The landing page is now successfully integrated with the CRM. All leads submitted through the form are automatically stored in Supabase and appear in the CRM dashboard.

---

## 🔧 Recent Fixes Applied (2025-10-09)

### Fix 1: TerritoryService Server-Side Error
**Problem**: `TerritoryService.findTerritoryByCityState is not a function`  
**Cause**: TerritoryService has `"use client"` directive and cannot be used in API routes  
**Solution**: Replaced with direct Supabase query using `supabaseAdmin`

### Fix 2: Source Field Constraint Violation
**Problem**: `violates check constraint "leads_source_check"`  
**Cause**: Form was sending dynamic source values like "hero-primary"  
**Solution**: Changed form to always send `"Landing Page"`

---

## 📋 Configuration

### Environment Variables (.env.local)

```env
# CRM API Configuration
NEXT_PUBLIC_CRM_API_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://oknfrljfupaiwosszame.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-key]
```

### CORS Configuration (CRM)

**Allowed Origins**:
- Development: `http://localhost:3001`, `http://localhost:3000`
- Production: `https://personalinjury.lawproactive.com`
- Wildcard: `*.lawproactive.com` (all subdomains)

---

## 📊 Field Mapping

| Form Field | Supabase Column | Required | Notes |
|-----------|----------------|----------|-------|
| firstName | first_name | ✅ | Min 2 characters |
| lastName | last_name | ✅ | Min 2 characters |
| email | email | ✅ | Valid email format |
| phone | phone | ✅ | Min 10 characters |
| caseType | case_type | ✅ | Auto-mapped to display name |
| accidentDate | accident_date | ❌ | ISO date format |
| urgency | urgency | ✅ | Mapped: immediate/urgent→high, normal→medium, planning→low |
| description | description | ✅ | Min 10 characters |
| city | city | ✅ | From page context |
| state | state | ✅ | From page context |
| source | source | ✅ | Always "Landing Page" |
| timestamp | timestamp | ❌ | Auto-generated |

---

## 🎯 How It Works

### 1. User Fills Form
- Landing page: `http://localhost:3001/california/los-angeles`
- Two-step modal form (TwoStepLeadModal component)

### 2. Form Submission
- POST request to `http://localhost:3000/api/leads`
- CORS validation passes
- Request body validated with Zod schema

### 3. Territory Assignment (Optional)
- Queries `territory_overview` table
- Looks for matching city/state
- If found and occupied, assigns to territory owner
- If not found, continues without assignment

### 4. Lead Creation
- Creates lead in Supabase `leads` table
- Auto-generates ID and timestamps
- Sets status to "new"

### 5. Dashboard Display
- Lead appears in CRM dashboard
- Real-time sync via Supabase
- Filterable and sortable

---

## 🧪 Testing

### Quick Test
1. Open `http://localhost:3001/california/los-angeles`
2. Click "Get Free Consultation"
3. Fill out the form
4. Submit
5. Check `http://localhost:3000/dashboard/leads`

### Expected Results
- ✅ Success message in modal
- ✅ No errors in browser console
- ✅ Lead appears in dashboard
- ✅ All fields populated correctly

---

## 🐛 Troubleshooting

### CORS Error
**Symptom**: `Access to fetch ... has been blocked by CORS policy`  
**Solution**: Verify both servers are running and on correct ports

### 400 Validation Error
**Symptom**: `POST /api/leads 400 (Bad Request)`  
**Causes**:
- Email format invalid
- Phone too short (< 10 chars)
- Description too short (< 10 chars)
- Consent not checked

### 500 Server Error
**Symptom**: `POST /api/leads 500 (Internal Server Error)`  
**Solution**: Check CRM server logs for specific error

### Lead Not Appearing
**Solution**:
1. Check Supabase directly (Table Editor → leads)
2. Refresh dashboard
3. Check dashboard filters

---

## 🚀 Production Deployment

### Landing Page
1. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CRM_API_URL=https://your-crm-domain.com
   ```
2. Deploy to hosting platform
3. Set environment variables in platform settings

### CRM
1. Verify production domain in CORS whitelist
2. Deploy CRM
3. Test end-to-end

---

## 📝 Adding New Landing Pages

### Step 1: Copy Form Component
```bash
cp components/two-step-lead-modal.tsx [new-landing]/components/
```

### Step 2: Configure Environment
```env
NEXT_PUBLIC_CRM_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://oknfrljfupaiwosszame.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
```

### Step 3: Use Component
```tsx
<TwoStepLeadModal
  trigger={<Button>Get Free Consultation</Button>}
  source="hero-section"  // For analytics only
  city="New York"
  state="New York"
  caseType="Car Accident"
/>
```

### Step 4: Update CORS (if needed)
If new domain is NOT a subdomain of `lawproactive.com`:
1. Edit `lib/cors-config.ts` in CRM
2. Add domain to `ALLOWED_ORIGINS`
3. Redeploy CRM

---

## 📚 Important Notes

### Source Field
- Always sends `"Landing Page"` to CRM
- The `source` prop is only for analytics tracking
- Do NOT change this value

### Urgency Mapping
- Form values: `immediate`, `urgent`, `normal`, `planning`
- Database values: `high`, `high`, `medium`, `low`
- Mapping is automatic in CRM API

### Territory Assignment
- Optional feature
- Requires matching city/state in `territory_overview`
- Gracefully continues if no territory found

### Consent Field
- Required in form validation
- NOT stored in database
- Used for legal compliance only

---

## 🔍 Monitoring

### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Verify POST request returns 200 OK
- **Response**: Check for success message

### CRM Server Logs
Look for:
- `✅ [CORS] Request approved`
- `📝 [LEADS] Received lead creation request`
- `✅ [LEADS] Lead created successfully`
- `POST /api/leads 200`

### Supabase
- Table Editor → `leads`
- Verify new leads appear
- Check all fields populated

---

## 📞 Support

### Common Issues
1. **CORS Error**: Check server ports and CORS config
2. **Validation Error**: Check field formats and requirements
3. **Server Error**: Check CRM logs for details
4. **Lead Missing**: Check Supabase directly

### Files Modified
- **CRM**: `app/api/leads/route.ts`
- **Landing**: `components/two-step-lead-modal.tsx`

### Documentation
- This file: Complete integration guide
- `FIXES_APPLIED.md`: Recent fixes and changes

---

**Last Updated**: 2025-10-09  
**Status**: ✅ FULLY FUNCTIONAL  
**Version**: 1.0

