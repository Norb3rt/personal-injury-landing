import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MapPin, Star, Shield, Clock, DollarSign, FileText, Users, Scale, Handshake } from "lucide-react"
import { StickyFooterCTA } from "@/components/sticky-footer-cta"
import { TopCitiesGrid } from "@/components/top-cities-grid"
import type { Metadata } from "next"

import { AnalyticsProvider } from "@/components/analytics-provider"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { NationwideMapWrapper } from "@/components/nationwide-map-wrapper"
import { StateDataLoader } from "@/lib/data/state-loader"
import { orgSchema, websiteSchema } from "@/lib/seo"
import { getHomepageConfig } from "@/lib/page-content"

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

export async function generateMetadata(): Promise<Metadata> {
  const config = await getHomepageConfig();
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com';
  const ogImageUrl = `${baseUrl}/images/og-image.jpg`;

  return {
    title: config.seo.metaTitle,
    description: config.seo.metaDescription,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      url: baseUrl,
      siteName: 'LawProactive',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          type: 'image/jpeg',
          width: 1200,
          height: 630,
          alt: 'LawProactive Personal Injury Lawyers',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function HomePage() {
  const config = await getHomepageConfig()
  const schemas = [orgSchema(), websiteSchema()]

  // Fetch ALL active states for the map
  const states = await StateDataLoader.getAllStates()

  // Map using slug keys (lowercase with hyphens) to match getAllStates() output
  const stateCoordinates: Record<string, { name: string, lat: number, lng: number }> = {
    "alabama": { name: "Alabama", lat: 32.8067, lng: -86.7911 },
    "alaska": { name: "Alaska", lat: 61.3707, lng: -152.4044 },
    "arizona": { name: "Arizona", lat: 33.7298, lng: -111.4312 },
    "arkansas": { name: "Arkansas", lat: 34.9697, lng: -92.3731 },
    "california": { name: "California", lat: 36.1162, lng: -119.6816 },
    "colorado": { name: "Colorado", lat: 39.0598, lng: -105.3111 },
    "connecticut": { name: "Connecticut", lat: 41.5978, lng: -72.7554 },
    "delaware": { name: "Delaware", lat: 39.3185, lng: -75.5071 },
    "florida": { name: "Florida", lat: 27.7663, lng: -81.6868 },
    "georgia": { name: "Georgia", lat: 33.0406, lng: -83.6431 },
    "hawaii": { name: "Hawaii", lat: 21.0943, lng: -157.4983 },
    "idaho": { name: "Idaho", lat: 44.2405, lng: -114.4788 },
    "illinois": { name: "Illinois", lat: 40.3495, lng: -88.9861 },
    "indiana": { name: "Indiana", lat: 39.8494, lng: -86.2583 },
    "iowa": { name: "Iowa", lat: 42.0115, lng: -93.2105 },
    "kansas": { name: "Kansas", lat: 38.5266, lng: -96.7265 },
    "kentucky": { name: "Kentucky", lat: 37.6681, lng: -84.6701 },
    "louisiana": { name: "Louisiana", lat: 31.1695, lng: -91.8678 },
    "maine": { name: "Maine", lat: 44.6939, lng: -69.3819 },
    "maryland": { name: "Maryland", lat: 39.0639, lng: -76.8021 },
    "massachusetts": { name: "Massachusetts", lat: 42.2302, lng: -71.5301 },
    "michigan": { name: "Michigan", lat: 43.3266, lng: -84.5361 },
    "minnesota": { name: "Minnesota", lat: 45.6945, lng: -93.9002 },
    "mississippi": { name: "Mississippi", lat: 32.7416, lng: -89.6787 },
    "missouri": { name: "Missouri", lat: 38.4561, lng: -92.2884 },
    "montana": { name: "Montana", lat: 46.9219, lng: -110.4544 },
    "nebraska": { name: "Nebraska", lat: 41.1254, lng: -98.2681 },
    "nevada": { name: "Nevada", lat: 38.3135, lng: -117.0554 },
    "new-hampshire": { name: "New Hampshire", lat: 43.4525, lng: -71.5639 },
    "new-jersey": { name: "New Jersey", lat: 40.2989, lng: -74.5210 },
    "new-mexico": { name: "New Mexico", lat: 34.8405, lng: -106.2485 },
    "new-york": { name: "New York", lat: 42.1657, lng: -74.9481 },
    "north-carolina": { name: "North Carolina", lat: 35.6301, lng: -79.8064 },
    "north-dakota": { name: "North Dakota", lat: 47.5289, lng: -99.7840 },
    "ohio": { name: "Ohio", lat: 40.3888, lng: -82.7649 },
    "oklahoma": { name: "Oklahoma", lat: 35.5653, lng: -96.9289 },
    "oregon": { name: "Oregon", lat: 44.5720, lng: -122.0709 },
    "pennsylvania": { name: "Pennsylvania", lat: 40.5908, lng: -77.2098 },
    "rhode-island": { name: "Rhode Island", lat: 41.6809, lng: -71.5118 },
    "south-carolina": { name: "South Carolina", lat: 33.8569, lng: -80.9450 },
    "south-dakota": { name: "South Dakota", lat: 44.2998, lng: -99.4388 },
    "tennessee": { name: "Tennessee", lat: 35.7478, lng: -86.6923 },
    "texas": { name: "Texas", lat: 31.0545, lng: -97.5635 },
    "utah": { name: "Utah", lat: 39.3055, lng: -111.6703 },
    "vermont": { name: "Vermont", lat: 44.0459, lng: -72.7107 },
    "virginia": { name: "Virginia", lat: 37.7693, lng: -78.1700 },
    "washington": { name: "Washington", lat: 47.4009, lng: -121.4905 },
    "west-virginia": { name: "West Virginia", lat: 38.4912, lng: -80.9545 },
    "wisconsin": { name: "Wisconsin", lat: 44.2685, lng: -89.6165 },
    "wyoming": { name: "Wyoming", lat: 42.7560, lng: -107.3025 }
  }

  const activeStatesData = states
    .filter(stateSlug => stateCoordinates[stateSlug])
    .map(stateSlug => ({
      name: stateCoordinates[stateSlug].name,
      slug: stateSlug,
      lat: stateCoordinates[stateSlug].lat,
      lng: stateCoordinates[stateSlug].lng
    }))

  // Load top cities for the indexable "Popular Locations" section.
  // Filters to the curated majorCities of each state, then ranks by population.
  const allLocations = await StateDataLoader.getAllProcessedLocations()
  const topCities = await Promise.all(
    allLocations.map(async (loc) => {
      const stateConfig = await StateDataLoader.getStateConfig(loc.stateSlug).catch(() => null)
      return { loc, stateConfig }
    })
  ).then((entries) =>
    entries
      .filter(({ loc, stateConfig }) => {
        if (!stateConfig?.majorCities) return false
        return stateConfig.majorCities.some(
          (mc) => mc.toLowerCase() === loc.city.toLowerCase()
        )
      })
      .sort((a, b) => (b.loc.population || 0) - (a.loc.population || 0))
      .slice(0, 18)
      .map(({ loc, stateConfig }) => ({
        name: loc.city,
        citySlug: loc.citySlug,
        stateSlug: loc.stateSlug,
        stateName: stateConfig?.name || loc.state,
        stateAbbreviation: stateConfig?.abbreviation || loc.stateSlug.toUpperCase().slice(0, 2),
      }))
  )

  const services = config.services.items
  const testimonials = config.testimonials.items
  const faqItems = config.faq.items

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-white">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />

        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Hero Section */}
        <section className="relative text-white py-20 px-4 overflow-hidden" style={{ backgroundColor: '#0B6B65' }}>
          {/* Disclaimer Banner */}
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

          <FloatingParticles
            count={30}
            particleColor="rgba(255, 255, 255, 0.1)"
            className="pointer-events-none"
          />

          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative max-w-6xl mx-auto text-center mt-8">
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
                  source="hero-home"
                  city="Nationwide"
                  state="USA"
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
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 bg-gray-50" id="services">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                {config.services.title || "Our Practice Areas"}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group">
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
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Combined Locations & Map Section */}
        <section className="py-20 px-4 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-50"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 px-4 py-1 border-teal-600 text-teal-700 bg-teal-50">
                  Nationwide Coverage
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Serving Clients Across the USA
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our extensive network of experienced attorneys covers all 50 states.
                  Select your location on the map to find dedicated legal representation near you.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 max-w-5xl mx-auto">
                <NationwideMapWrapper activeStates={activeStatesData} />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Popular Cities — server-rendered indexable links (SEO) */}
        <TopCitiesGrid cities={topCities} />

        {/* Pain Points Section */}
        <section className="py-16 px-4 bg-red-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-red-800">
                {config.painPoints.title}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 gap-6 text-left mb-8">
              {config.painPoints.items.map((item, index) => (
                <StaggerItem key={index}>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">{item}</p>
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
                  source="pain-points-home"
                  city="Nationwide"
                  state="USA"
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
                    source="value-prop-home"
                    city="Nationwide"
                    state="USA"
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
                    source="how-it-works-home"
                    city="Nationwide"
                    state="USA"
                  />
                </AnimatedButton>
              </FadeIn>
            </div>
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-800">
                {config.reassurance.title || "Ready to Get Started?"}
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button size="lg" className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90" style={{ backgroundColor: '#e06e00' }}>
                      {config.reassurance.ctaText || "Get Your Free Case Review"}
                    </Button>
                  }
                  source="footer-cta-home"
                  city="Nationwide"
                  state="USA"
                />
              </AnimatedButton>
            </FadeIn>
          </div>
        </section>

        {/* Sticky Footer CTA */}
        <StickyFooterCTA city={""} />
      </div>
    </AnalyticsProvider>
  )
}