import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, CheckCircle2, Scale, FileText, Users, Clock } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from 'next/navigation'

import { StickyFooterCTA } from "@/components/sticky-footer-cta"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"

import { StateDataLoader } from "@/lib/data/state-loader"
import { PRACTICE_AREAS, getPracticeAreaBySlug, getAllPracticeAreaSlugs } from "@/lib/data/practice-areas-config"
import { orgSchema, websiteSchema, serviceSchema } from "@/lib/seo"
import { getMergedPageConfig } from "@/lib/page-content"

// Import animation components
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedButton,
  GlowEffect,
  ParallaxScroll,
  FloatingParticles,
} from "@/components/animations"

// Import territory / lawyer cards
import { LawyerTerritoryCard } from "@/components/lawyers/lawyer-territory-card"
import { TerritoryAvailableCard } from "@/components/lawyers/territory-available-card"
import { getLawyerForTerritory } from "@/lib/get-lawyer-for-territory"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    state: string
    city: string
    practice: string
  }>
}

// Generate metadata for SEO using Supabase templates and overrides
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city, practice } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com';
  const config = await getMergedPageConfig(state, city, practice);
  const canonicalUrl = `${baseUrl}/personal-injury-lawyer/${state}/${city}/${practice}`;

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

export default async function PracticeAreaPage({ params }: PageProps) {
  const { state: paramState, city: paramCity, practice } = await params;
  // Validate location exists
  const isValidLocation = await validateLocation(paramState, paramCity)
  if (!isValidLocation) {
    notFound()
  }

  // Validate practice area exists
  const practiceArea = getPracticeAreaBySlug(practice)
  if (!practiceArea) {
    notFound()
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
  const stateSlug = paramState

  // ── Fetch lawyer assigned to this territory ──
  const assignedLawyer = await getLawyerForTerritory(paramState, paramCity)

  // Load dynamic page configuration
  const config = await getMergedPageConfig(paramState, paramCity, practice);

  // Get other practice areas for internal linking (sibling pages)
  const otherPracticeAreas = PRACTICE_AREAS.filter(area => area.slug !== practice)

  const stateConfig = await StateDataLoader.getStateConfig(paramState);
  const stateCode = stateConfig?.abbreviation || paramState.toUpperCase().substring(0, 2);

  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'
  const pageUrl = `${baseUrl}/personal-injury-lawyer/${paramState}/${paramCity}/${practice}`;

  const organizationSchemaObj = orgSchema();
  const webSiteSchemaObj = websiteSchema();
  const serviceSchemaObj = serviceSchema(city, state, stateCode, practiceArea.name);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faq.items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

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
        "item": `${baseUrl}/personal-injury-lawyer/${paramState}/${paramCity}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": practiceArea.name,
        "item": pageUrl
      }
    ]
  };

  const schemas = [
    organizationSchemaObj,
    webSiteSchemaObj,
    serviceSchemaObj,
    faqSchema,
    breadcrumbSchema
  ];

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white py-20 px-4 overflow-hidden">
          <ParallaxScroll speed={0.5} className="absolute inset-0 opacity-20">
            <FloatingParticles count={30} particleColor="rgba(255, 255, 255, 0.3)" />
          </ParallaxScroll>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Breadcrumb Navigation */}
            <FadeIn direction="down" delay={0.1}>
              <div className="mb-6">
                <Link
                  href={`/personal-injury-lawyer/${stateSlug}/${citySlug}`}
                  className="inline-flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {city} Personal Injury Services
                </Link>
              </div>
            </FadeIn>

            <div className="text-center">
              <FadeIn direction="up" delay={0.2}>
                <div className="text-6xl mb-6">{config.hero.icon || practiceArea.icon}</div>
              </FadeIn>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {config.hero.h1}
              </h1>

              <FadeIn direction="up" delay={0.4}>
                <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
                  {config.hero.subtitle}
                </p>
              </FadeIn>

               <FadeIn direction="up" delay={0.5}>
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
                    
                    source={`hero-${practice}`}
                    city={city}
                    state={state}
                    caseType={config.meta?.name || practiceArea.name}
                  />
                </AnimatedButton>
              </FadeIn>

              <FadeIn direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    No Recovery, No Fee* 
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Free Consultation
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                    <Scale className="h-4 w-4 mr-2" />
                    Experienced Attorneys
                  </Badge>
                </div>
                <p className="text-xs text-blue-200/80 mt-4 mb-8 italic max-w-lg mx-auto text-center">
                  *No attorney&apos;s fee unless there is a recovery. The client may be responsible for court costs and case expenses.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Territory / Lawyer Card (same city as city page) ── */}
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

        {/* About This Practice Area */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
                {config.about?.title || `About ${config.meta?.name || practiceArea.name} Cases in ${city}`}
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {config.about?.longDescription || practiceArea.longDescription}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-8 border border-blue-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {config.about?.commonInjuriesTitle || `Common Injuries in ${config.meta?.name || practiceArea.name} Cases`}
                </h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {(config.about?.commonInjuries && config.about.commonInjuries.length > 0 ? config.about.commonInjuries : practiceArea.commonInjuries).map((injury, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{injury}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.4}>
                <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button
                        size="lg"
                        className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90"
                        style={{ backgroundColor: '#0B6B65' }}
                      >
                        {config.about?.ctaText || `Discuss Your ${practiceArea.name} Case`}
                      </Button>
                    }
                    source={`about-${practice}`}
                    city={city}
                    state={state}
                    caseType={practiceArea.name}
                  />
                </AnimatedButton>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Why Choose Our Network */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                {config.whyChoose?.title || `Why Choose Our ${config.meta?.name || practiceArea.name} Attorneys in ${city}`}
              </h2>
            </FadeIn>
            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8">
              {((config.whyChoose?.items && config.whyChoose.items.length > 0) ? config.whyChoose.items : [
                {
                  title: "Proven Track Record",
                  desc: `We bring experience and dedication to every ${(config.meta?.name || practiceArea.name).toLowerCase()} case we handle, fighting to pursue the compensation our clients deserve.`
                },
                {
                  title: "Personalized Attention",
                  desc: `Every case is unique. Our attorneys provide personalized strategies tailored to your specific ${(config.meta?.name || practiceArea.name).toLowerCase()} situation.`
                },
                {
                  title: "No Upfront Costs",
                  desc: "We work on a contingency fee basis — no attorney's fees unless we recover compensation for your case."
                }
              ]).map((item, idx) => {
                const CardIcon = idx === 0 ? Scale : idx === 1 ? Users : FileText
                return (
                  <StaggerItem key={idx}>
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <GlowEffect glowColor="rgba(59, 130, 246, 0.3)" intensity={0.8} className="mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                            <CardIcon className="h-8 w-8 text-white" />
                          </div>
                        </GlowEffect>
                        <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                {config.faq.title}
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4">
                {config.faq.items.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-gray-50">
                    <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-teal-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>
        </section>

        {/* Other Practice Areas (Internal Linking) */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
                Other Personal Injury Services in {city}
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                We also connect clients with attorneys specializing in these practice areas
              </p>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPracticeAreas.map((area) => (
                <StaggerItem key={area.slug}>
                  <Link href={`/personal-injury-lawyer/${stateSlug}/${citySlug}/${area.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                          {area.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-teal-600 transition-colors">
                          {area.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{area.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.3}>
                <Link href={`/personal-injury-lawyer/${stateSlug}/${citySlug}`}>
                  <Button variant="outline" size="lg" className="service-button">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    View All {city} Services
                  </Button>
                </Link>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started with Your {practiceArea.name} Case?
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl mb-8 text-blue-100">
                Don&apos;t wait. The sooner you act, the stronger your case. Get your free consultation today.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      className="text-white font-bold text-lg px-8 py-4 shadow-2xl hover:opacity-90"
                      style={{ backgroundColor: '#e06e00' }}
                    >
                      Get My Free Case Evaluation
                    </Button>
                  }
                  source={`final-cta-${practice}`}
                  city={city}
                  state={state}
                  caseType={practiceArea.name}
                />
              </AnimatedButton>
            </FadeIn>
          </div>
        </section>

      </div>
    </AnalyticsProvider>
  )
}

// Generate static params for all state/city/practice combinations
export async function generateStaticParams() {
  try {
    const allLocations = await StateDataLoader.getAllProcessedLocations()
    const practiceAreaSlugs = getAllPracticeAreaSlugs()

    const combinations = allLocations.flatMap((location) =>
      practiceAreaSlugs.map((practiceSlug) => ({
        state: location.stateSlug,
        city: location.citySlug,
        practice: practiceSlug,
      }))
    )

    console.log(`🏗️ Generating static params for ${combinations.length} state/city/practice combinations`)

    return combinations
  } catch (error) {
    console.error('Error generating static params for practice pages:', error)

    // Fallback to basic combinations
    const fallbackCombinations = [
      { state: 'california', city: 'los-angeles', practice: 'car-accident' },
      { state: 'california', city: 'san-francisco', practice: 'car-accident' },
    ]

    console.log(`🔄 Fallback: Using ${fallbackCombinations.length} basic combinations`)
    return fallbackCombinations
  }
}

// Validate if the location exists
async function validateLocation(stateSlug: string, citySlug: string): Promise<boolean> {
  try {
    const cities = await StateDataLoader.loadStateData(stateSlug)
    if (!cities || cities.length === 0) {
      return false
    }

    const match = cities.some(c =>
      StateDataLoader.slugify(c.city) === citySlug &&
      StateDataLoader.slugify(c.state) === stateSlug
    )

    return match
  } catch (error) {
    console.error('Error validating location:', error)
    return false
  }
}
