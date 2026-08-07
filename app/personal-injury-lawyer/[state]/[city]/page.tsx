import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MapPin, Star, Shield, Clock, FileText, Users, Handshake, Scale } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from 'next/navigation'

import { StickyFooterCTA } from "@/components/sticky-footer-cta"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { DynamicCitySpotlight } from "@/components/dynamic-city-spotlight"

import { generateCityMetadata, orgSchema, websiteSchema, citySchema, datasetSchema, newsArticleSchema } from "@/lib/seo"
// Import new data loading system
import { StateDataLoader } from "@/lib/data/state-loader"
import { getMergedPageConfig } from "@/lib/page-content"
import { fetchGoogleNewsRSS, generateFallbackNews } from "@/lib/news"
import { practiceAreaNameToSlug } from "@/lib/data/practice-areas-config"

// Import new content enhancement components
import { NearbyCities } from "@/components/nearby-cities"
import { StateLegalInfo } from "@/components/state-legal-info"
import { LocalResources } from "@/components/local-resources"
import { AccidentStatistics } from "@/components/accident-statistics"
import { LocalNews } from "@/components/local-news"
import { CityGoogleMap } from "@/components/city-google-map"
// Import territory / lawyer cards
import { LawyerTerritoryCard } from "@/components/lawyers/lawyer-territory-card"
import { TerritoryAvailableCard } from "@/components/lawyers/territory-available-card"
import { getLawyerForTerritory } from "@/lib/get-lawyer-for-territory"
import { getStateLawInfo } from "@/data/state-laws"
import { generateAccidentStats } from "@/data/accident-stats"

// Import animation components
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedNumber,
  AnimatedButton,
  FloatingParticles,
  GlowEffect,
  ParallaxScroll,
  ScrollProgress,
} from "@/components/animations"


export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    state: string
    city: string
  }>
}

// Generate metadata for SEO using Supabase templates and overrides
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com';
  const config = await getMergedPageConfig(state, city);
  const canonicalUrl = `${baseUrl}/personal-injury-lawyer/${state}/${city}`;

  return {
    title: config.seo.metaTitle,
    description: config.seo.metaDescription,
    keywords: `personal injury lawyer ${city}, accident attorney ${city}`,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      url: canonicalUrl,
      siteName: 'LawProactive',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          secureUrl: `${baseUrl}/images/og-image.jpg`,
          type: 'image/jpeg',
          width: 1200,
          height: 630,
          alt: `${city} Personal Injury Lawyer`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PersonalInjuryLanding({ params }: PageProps) {
  const { state: paramState, city: paramCity } = await params;
  // Validar que la combinación estado/ciudad existe
  const isValidLocation = await validateLocation(paramState, paramCity);

  if (!isValidLocation) {
    notFound() // Esto mostrará tu not-found.tsx
  }

  // Helper function to convert slug to proper title case
  const toTitleCase = (slug: string) => {
    return slug
      .replace(/-/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const city = toTitleCase(paramCity)
  const state = toTitleCase(paramState)
  const citySlug = paramCity
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'

  // Fetch real city data
  const cityLocation = await StateDataLoader.findLocation(paramState, paramCity)

  // Fetch nearby cities for internal linking
  const nearbyCities = await StateDataLoader.getNearbyCities(paramState, paramCity, 8)

  // ── Fetch lawyer assigned to this territory ──
  const assignedLawyer = await getLawyerForTerritory(paramState, paramCity)

  // Get state-specific legal information
  const stateLawInfo = getStateLawInfo(paramState)

  // Generate accident statistics for this city
  const accidentStats = generateAccidentStats(city, state, paramState, cityLocation?.population, cityLocation?.coordinates)

  // Fetch news articles server-side for rendering and schema generation
  let newsItems = await fetchGoogleNewsRSS(city, state);
  const isNewsFallback = newsItems.length === 0;
  if (isNewsFallback) {
    newsItems = generateFallbackNews(city, state);
  }

  // Generate dynamic stats based on city population/name for uniqueness
  const generateDynamicStats = (cityName: string, population?: number) => {
    // Use city name hash for deterministic variation
    const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Base values with variation
    const baseSettlement = 95000 + (hash % 80) * 1000 // $95,000 - $175,000
    const casesWon = 92 + (hash % 7) // 92% - 98%
    const yearsExperience = 12 + (hash % 10) // 12 - 21 years

    // Population-based modifier for larger cities
    const popModifier = population ? Math.min(1 + (population / 500000) * 0.3, 1.5) : 1
    const adjustedSettlement = Math.round(baseSettlement * popModifier / 1000) * 1000

    return {
      averageSettlement: `$${new Intl.NumberFormat('en-US').format(adjustedSettlement)}`,
      casesWon,
      yearsExperience,
      population: population ? new Intl.NumberFormat('en-US').format(population) : null,
      landmark: cityLocation?.landmark
    }
  }

  // Load configuration from Supabase (Template + Overrides)
  const config = await getMergedPageConfig(paramState, paramCity);

  const cityData = {
    name: city,
    practiceAreas: [],
    testimonials: [],
    localStats: generateDynamicStats(city, cityLocation?.population)
  }

  const testimonials = config.testimonials.items;
  const services = config.services.items;
  const faqItems = config.faq.items;
  // --- Enhanced SEO Structured Data ---
  const pageUrl = `${baseUrl}/personal-injury-lawyer/${paramState}/${paramCity}`;

  const stateConfig = await StateDataLoader.getStateConfig(paramState);
  const stateCode = stateConfig?.abbreviation || paramState.toUpperCase().substring(0, 2);
  const lat = cityLocation?.coordinates?.lat || cityLocation?.latitude;
  const lng = cityLocation?.coordinates?.lng || cityLocation?.longitude;

  // 1. Generate core schemas from the template specifications
  const organizationSchemaObj = orgSchema();
  const webSiteSchemaObj = websiteSchema();
  const citySchemaObj = citySchema(city, state, stateCode, lat, lng);
  const datasetSchemaObj = datasetSchema(city, state, stateCode, accidentStats);

  // 2. Generate NewsArticle schemas for the server-fetched news
  const newsArticleSchemas = newsItems.slice(0, 4).map(item => 
    newsArticleSchema(city, item.link === '#' ? pageUrl : item.link, item.title, item.title, item.publishedAt)
  );

  // 3. FAQPage Schema (Local to this page's content)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": state,
        "item": `${baseUrl}/personal-injury-lawyer/${paramState}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": city,
        "item": pageUrl
      }
    ]
  };

  // Combine into a clean flat array of self-contained schemas
  const allStructuredData = [
    organizationSchemaObj,
    webSiteSchemaObj,
    citySchemaObj,
    datasetSchemaObj,
    ...newsArticleSchemas,
    faqSchema,
    breadcrumbSchema
  ];

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-white">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(allStructuredData) }}
        />

        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Hero Section */}
        <section className="relative text-white py-20 px-4 overflow-hidden" style={{ backgroundColor: '#0B6B65' }}>
          {/* Disclaimer Banner - Positioned at top of hero section */}
          <FadeIn direction="down" delay={0.05}>
            <div className="absolute top-0 left-0 right-0 flex justify-center pt-1 z-10">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 hover:shadow-lg group">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:bg-green-300 transition-colors duration-300"></div>
                <span className="text-sm font-medium text-white/90 tracking-wide group-hover:text-white transition-colors duration-300">
                  DISCLAIMER: ATTORNEY ADVERTISING
                </span>
              </div>
            </div>
          </FadeIn>
          {/* Floating Particles Background */}
          <FloatingParticles
            count={30} // Reduced from 60 for performance
            particleColor="rgba(255, 255, 255, 0.1)"
            className="pointer-events-none"
          />

          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative max-w-6xl mx-auto text-center">
            {/* Título principal (H1) dinámico y optimizado para SEO */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {config.hero.h1}
            </h1>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
                {config.hero.subtitle}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      className="text-white font-bold text-lg px-8 py-4 mb-8 shadow-2xl hover:opacity-90"
                      style={{ backgroundColor: '#e06e00' }}
                    >
                      {config.hero.ctaText}
                    </Button>
                  }
                  source="hero-primary"
                  city={city}
                  state={state}
                />
              </AnimatedButton>
            </FadeIn>
 
            <StaggerContainer staggerDelay={0.05} className="flex flex-wrap justify-center items-center gap-6 text-sm mb-6">
              <StaggerItem>
                <GlowEffect glowColor="rgba(224, 110, 0, 0.3)">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5" style={{ color: '#e06e00' }} />
                    <span>Local Attorney</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
              <StaggerItem>
                <GlowEffect glowColor="rgba(224, 110, 0, 0.3)">
                  <div className="flex items-center gap-2">
                    <Handshake className="h-5 w-5" style={{ color: '#e06e00' }} />
                    <span>No Recovery, No Fee*</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
              <StaggerItem>
                <GlowEffect glowColor="rgba(224, 110, 0, 0.3)">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" style={{ color: '#e06e00' }} />
                    <span>Available 24/7</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
            </StaggerContainer>

            <FadeIn direction="up" delay={0.6}>
              <p className="text-xs text-blue-200/80 mt-2 mb-8 italic max-w-lg mx-auto text-center">
                *No attorney&apos;s fee unless there is a recovery. The client may be responsible for court costs and case expenses.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ── Territory / Lawyer Card (below hero) ── */}
        {assignedLawyer ? (
          <LawyerTerritoryCard
            lawyer={assignedLawyer}
            city={city}
            state={state}
          />
        ) : (
          <TerritoryAvailableCard
            city={city}
            state={state}
          />
        )}

        {/* Services Section */}
        <section className="py-16 px-4 bg-gray-50" id="services">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                {config.services.title}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">              {services.map((service, index) => (
              <StaggerItem key={index}>
                <Link href={`/personal-injury-lawyer/${paramState}/${paramCity}/${service.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm cursor-pointer group">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <GlowEffect
                        glowColor="rgba(59, 130, 246, 0.3)"
                        intensity={0.8}
                        className="mb-4"
                      >
                        <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                          {service.icon}
                        </div>
                      </GlowEffect>

                      <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-teal-600 transition-colors">{service.name}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>

                      <AnimatedButton magneticStrength={0.15} hoverScale={1.02}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent service-button"
                        >
                          Learn More →
                        </Button>
                      </AnimatedButton>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Accident Statistics Section */}
        <AccidentStatistics stats={accidentStats} />

        {/* Local News Section */}
        <LocalNews
          city={city}
          state={state}
          citySlug={paramCity}
          stateSlug={paramState}
          initialNews={newsItems}
          initialIsFallback={isNewsFallback}
        />

        {/* Pain Points Section */}
        <section className="py-16 px-4 bg-red-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-red-800">
                {config.painPoints.title}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 gap-6 text-left mb-8">
              {config.painPoints.items.map((painPoint, index) => (
                <StaggerItem key={index}>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">{painPoint}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button size="lg" className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90" style={{ backgroundColor: '#e06e00' }}>
                      {config.painPoints.ctaText}
                    </Button>
                  }
                  source="pain-points"
                  city={city}
                  state={state}
                />
              </AnimatedButton>
            </FadeIn>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 px-4 bg-green-50 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <FadeIn direction="up" delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">
                  {config.valueProp.title}
                </h2>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <p className="text-xl mb-8 text-gray-700 max-w-4xl mx-auto">
                  {config.valueProp.subtitle}
                </p>
              </FadeIn>
            </div>

            {/* Statistics Section */}
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {config.valueProp.stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center min-h-[140px]">
                    <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-gray-700 font-semibold">{stat.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="text-center">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button size="lg" className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90" style={{ backgroundColor: '#0B6B65' }}>
                        {config.valueProp.ctaText}
                      </Button>
                    }
                    source="value-prop"
                    city={city}
                    state={state}
                  />
                </AnimatedButton>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-white relative overflow-hidden" id="how-it-works">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                {config.howItWorks.title}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Lines */}
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5" style={{ background: 'linear-gradient(to right, rgba(11, 107, 101, 0.3), #0B6B65, rgba(11, 107, 101, 0.3))' }}></div>

              {config.howItWorks.steps.map((step, index) => (
                <StaggerItem key={index}>
                  <div className="text-center relative">
                    <GlowEffect glowColor="rgba(59, 130, 246, 0.4)" intensity={1.2}>
                      <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110" style={{ background: 'linear-gradient(to bottom right, #0B6B65, #0B6B65)' }}>
                        <AnimatedNumber value={index + 1} />
                      </div>
                    </GlowEffect>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button size="lg" className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90" style={{ backgroundColor: '#0B6B65' }}>
                        {config.howItWorks.ctaText}
                      </Button>
                    }
                    source="how-it-works"
                    city={city}
                    state={state}
                  />
                </AnimatedButton>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Risk Reversal Section */}
        <section className="py-16 px-4 bg-yellow-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-800">
                <GlowEffect glowColor="rgba(234, 179, 8, 0.3)">
                  {config.riskReversal.title}
                </GlowEffect>
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl text-gray-700 mb-4">
                {config.riskReversal.desc}
              </p>
              <p className="text-xs text-gray-700 mb-8 italic">
                {config.riskReversal.disclaimer}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button size="lg" className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90" style={{ backgroundColor: '#e06e00' }}>
                      {config.riskReversal.ctaText}
                    </Button>
                  }
                  source="risk-reversal"
                  city={city}
                  state={state}
                />
              </AnimatedButton>
            </FadeIn>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                {config.testimonials.title}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 transform hover:scale-[1.02]">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <GlowEffect key={i} glowColor="rgba(234, 179, 8, 0.4)">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }} />
                          </GlowEffect>
                        ))}
                      </div>

                      <p className="text-gray-600 mb-4 italic flex-grow leading-relaxed">
                        &quot;{testimonial.quote}&quot;
                      </p>

                      <div className="border-t pt-4 mt-auto">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 mb-2">{testimonial.location}</p>
                        <GlowEffect glowColor="rgba(59, 130, 246, 0.3)">
                          <Badge variant="secondary" className="text-white hover:opacity-90 transition-colors" style={{ backgroundColor: '#0B6B65' }}>
                            {testimonial.case} - {testimonial.settlement}
                          </Badge>
                        </GlowEffect>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <p className="text-xs text-gray-500 text-center mt-8 max-w-3xl mx-auto italic">
              Testimonials do not constitute a guarantee, warranty, or prediction regarding the outcome of your legal matter. Past results do not guarantee future outcomes.
            </p>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-transparent shadow-lg hover:shadow-xl transition-all duration-300 service-button"
                      >
                        {config.testimonials.ctaText}
                      </Button>
                    }
                    source="testimonials"
                    city={city}
                    state={state}
                  />
                </AnimatedButton>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="py-16 px-4 bg-slate-50 relative overflow-hidden">
          <ParallaxScroll speed={0.3} className="absolute inset-0 opacity-10">
            <FloatingParticles count={30} particleColor="rgba(45, 212, 191, 0.2)" />
          </ParallaxScroll>

          <div className="max-w-4xl mx-auto text-center relative">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">{config.reassurance.title}</h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl mb-8 text-slate-700">
                {config.reassurance.desc}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-bold text-lg px-8 py-4 bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {config.reassurance.ctaText}
                    </Button>
                  }
                  source="reassurance"
                  city={city}
                  state={state}
                />
              </AnimatedButton>
            </FadeIn>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-slate-50" id="faq">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
                {config.faq.title}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05}>
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <StaggerItem key={index}>
                    <AccordionItem
                      value={`item-${index}`}
                      className="bg-white rounded-lg px-6 shadow-sm hover:shadow-md transition-all duration-300 border-0"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:text-blue-600 transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </StaggerItem>
                ))}
              </Accordion>
            </StaggerContainer>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {config.faq.ctaText}
                      </Button>
                    }
                    source="faq"
                    city={city}
                    state={state}
                  />
                </AnimatedButton>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-800">Ready to Get Started?</h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-3 gap-8 mb-8">
              <StaggerItem>
                <div className="flex flex-col items-center p-6 rounded-xl hover:bg-slate-50 transition-all duration-300">
                  <GlowEffect glowColor="rgba(45, 212, 191, 0.3)">
                    <FileText className="h-12 w-12 text-teal-600 mb-4 hover:scale-110 transition-transform duration-300" />
                  </GlowEffect>
                  <h3 className="font-semibold mb-2 text-slate-800">Free Case Review</h3>
                  <p className="text-slate-600">Get your case evaluated instantly</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col items-center p-6 rounded-xl hover:bg-slate-50 transition-all duration-300">
                  <GlowEffect glowColor="rgba(45, 212, 191, 0.3)">
                    <Users className="h-12 w-12 text-teal-600 mb-4 hover:scale-110 transition-transform duration-300" />
                  </GlowEffect>
                  <h3 className="font-semibold mb-2 text-slate-800">Have Questions</h3>
                  <p className="text-slate-600">Connect to A Licensed Attorney</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col items-center p-6 rounded-xl hover:bg-slate-50 transition-all duration-300">
                  <GlowEffect glowColor="rgba(45, 212, 191, 0.3)">
                    <MapPin className="h-12 w-12 text-teal-600 mb-4 hover:scale-110 transition-transform duration-300" />
                  </GlowEffect>
                  <h3 className="font-semibold mb-2 text-slate-800">Serving</h3>
                  <p className="text-slate-600">{city} & Surrounding Areas</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>


        {/* State-Specific Legal Information */}
        <StateLegalInfo lawInfo={stateLawInfo} cityName={city} />

        {/* Local Resources Section */}
        <LocalResources
          cityName={city}
          stateName={state}
          landmark={cityData.localStats.landmark}
        />

        {/* City Google Map Section */}
        <CityGoogleMap
          cityName={city}
          stateName={state}
          latitude={lat}
          longitude={lng}
        />

        {/* Nearby Cities Section */}
        <NearbyCities
          cities={nearbyCities}
          stateSlug={paramState}
          stateName={state}
          currentCity={city}
        />

        {/* Dynamic City Spotlight Section */}
        <DynamicCitySpotlight
          currentState={paramState}
          currentCity={paramCity}
          stateDisplayName={state}
          cityDisplayName={city}
        />

        {/* Sticky Footer CTA */}
        <StickyFooterCTA city={city} state={state} />
      </div >
    </AnalyticsProvider >
  )
}

// Generate static params for all state/city combinations
export async function generateStaticParams() {
  try {
    const allLocations = await StateDataLoader.getAllProcessedLocations()

    console.log(`🏗️ Generating static params for ${allLocations.length} state/city combinations`)

    return allLocations.map((location) => ({
      state: location.stateSlug,
      city: location.citySlug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)

    // Fallback to basic combinations
    const fallbackCombinations = [
      { state: 'california', city: 'los-angeles' },
      { state: 'california', city: 'san-francisco' },
      { state: 'texas', city: 'houston' },
      { state: 'florida', city: 'miami' },
    ]

    console.log(`🔄 Using fallback: ${fallbackCombinations.length} combinations`)
    return fallbackCombinations
  }
}

// Validate if the location exists using state-scoped lookup (more robust and faster)
async function validateLocation(stateSlug: string, citySlug: string): Promise<boolean> {
  try {
    const cities = await StateDataLoader.loadStateData(stateSlug)
    if (!cities || cities.length === 0) {
      console.warn(`No cities loaded for state: ${stateSlug}`)
      return false
    }

    // Compare by slugified city name to avoid casing/spacing issues
    const match = cities.some(c =>
      StateDataLoader.slugify(c.city) === citySlug &&
      StateDataLoader.slugify(c.state) === stateSlug
    )

    return match
  } catch (error) {
    console.error('Error validating location:', error)
    return false // If there's an error, show 404
  }
}
