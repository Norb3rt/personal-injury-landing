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

interface PageProps {
  params: Promise<{
    state: string
    city: string
    practice: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city, practice } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'

  const practiceArea = getPracticeAreaBySlug(practice)
  if (!practiceArea) {
    return {
      title: 'Practice Area Not Found',
      description: 'The requested practice area could not be found.'
    }
  }

  const cityName = city
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const stateName = state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const title = `${practiceArea.name} Lawyer in ${cityName}, ${stateName} | Free Consultation`
  const description = `Injured in a ${practiceArea.name.toLowerCase()} in ${cityName}? Get the settlement you deserve. Connect with experienced ${practiceArea.name.toLowerCase()} attorneys. No win, no fee. Free case evaluation.`

  return {
    title,
    description,
    keywords: [
      ...practiceArea.keywords,
      `${cityName} ${practiceArea.name.toLowerCase()}`,
      `${cityName} personal injury lawyer`,
      `${stateName} ${practiceArea.name.toLowerCase()} attorney`
    ].join(', '),
    openGraph: {
      title,
      description,
      url: `${baseUrl}/personal-injury-lawyer/${state}/${city}/${practice}`,
      siteName: 'LawProactive',
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
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

  // Get other practice areas for internal linking (sibling pages)
  const otherPracticeAreas = PRACTICE_AREAS.filter(area => area.slug !== practice)

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white py-20 px-4 overflow-hidden">
          <ParallaxScroll speed={0.5} className="absolute inset-0 opacity-20">
            <FloatingParticles count={50} particleColor="rgba(255, 255, 255, 0.3)" />
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
                <div className="text-6xl mb-6">{practiceArea.icon}</div>
              </FadeIn>

              <FadeIn direction="up" delay={0.3}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {practiceArea.name} Lawyer in {city}, {state}
                </h1>
              </FadeIn>

              <FadeIn direction="up" delay={0.4}>
                <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
                  {practiceArea.description}. Get the compensation you deserve with experienced legal representation.
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
                        Get a Free Case Review
                      </Button>
                    }
                    source={`hero-${practice}`}
                    city={city}
                    state={state}
                    caseType={practiceArea.name}
                  />
                </AnimatedButton>
              </FadeIn>

              <FadeIn direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    No Win, No Fee
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
              </FadeIn>
            </div>
          </div>
        </section>

        {/* About This Practice Area */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
                About {practiceArea.name} Cases in {city}
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {practiceArea.longDescription}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-8 border border-blue-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Common Injuries in {practiceArea.name} Cases</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {practiceArea.commonInjuries.map((injury, index) => (
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
                        Discuss Your {practiceArea.name} Case
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
                Why Choose Our {practiceArea.name} Attorneys in {city}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <GlowEffect glowColor="rgba(59, 130, 246, 0.3)" intensity={0.8} className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                        <Scale className="h-8 w-8 text-white" />
                      </div>
                    </GlowEffect>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Proven Track Record</h3>
                    <p className="text-gray-600">
                      Our network of attorneys has successfully handled thousands of {practiceArea.name.toLowerCase()} cases, securing millions in compensation for clients.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <GlowEffect glowColor="rgba(59, 130, 246, 0.3)" intensity={0.8} className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </GlowEffect>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Personalized Attention</h3>
                    <p className="text-gray-600">
                      Every case is unique. Our attorneys provide personalized strategies tailored to your specific {practiceArea.name.toLowerCase()} situation.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <GlowEffect glowColor="rgba(59, 130, 246, 0.3)" intensity={0.8} className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                    </GlowEffect>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">No Upfront Costs</h3>
                    <p className="text-gray-600">
                      We work on a contingency fee basis. You pay nothing unless we win your {practiceArea.name.toLowerCase()} case.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                Frequently Asked Questions About {practiceArea.name}
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4">
                {practiceArea.faqItems.map((faq, index) => (
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

        <StickyFooterCTA city={city} state={state} />
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
