import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MapPin, Star, Shield, Clock, DollarSign, FileText, Users } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from 'next/navigation'

import { StickyFooterCTA } from "@/components/sticky-footer-cta"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { generateCityMetadata, generateLocalBusinessStructuredData } from "@/lib/seo"

// Import new data loading system
import { StateDataLoader } from "@/lib/data/state-loader"

// Import animation components
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedNumber,
  AnimatedButton,
  TypingEffect,
  AnimatedText,
  FloatingParticles,
  GlowEffect,
  ParallaxScroll,
  ScrollProgress,
} from "@/components/animations"


interface PageProps {
  params: {
    state: string
    city: string
  }
}

// Generate metadata for SEO - use same system as legacy for consistency
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com'

  // Use the same metadata generation as legacy pages
  return generateCityMetadata(params.city, baseUrl)
}

export default async function PersonalInjuryLanding({ params }: PageProps) {
  // Validar que la combinación estado/ciudad existe
  const isValidLocation = await validateLocation(params.state, params.city)

  if (!isValidLocation) {
    notFound() // Esto mostrará tu not-found.tsx
  }

  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1).replace(/-/g, " ")
  const state = params.state.charAt(0).toUpperCase() + params.state.slice(1).replace(/-/g, " ")
  const citySlug = params.city
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com'

  // Use static data for reliable deployment (same as legacy)
  const cityData = {
    name: city,
    practiceAreas: [],
    testimonials: [],
    localStats: {
      averageSettlement: "$125,000",
      casesWon: 95,
      yearsExperience: 15
    }
  }

  // Generate structured data using utility function (same as legacy)
  const structuredData = generateLocalBusinessStructuredData(citySlug, baseUrl)

  const defaultTestimonials = [
    {
      name: "Maria Rodriguez",
      location: `${city}, ${state}`,
      case: "Car Accident",
      settlement: "$285,000",
      quote:
        "After my accident, I was overwhelmed with medical bills and insurance calls. The attorney they connected me with fought hard and got me almost 3x what insurance initially offered.",
      rating: 5,
    },
    {
      name: "James Chen",
      location: `${city}, ${state}`,
      case: "Slip & Fall",
      settlement: "$150,000",
      quote:
        "Professional, responsive, and got results. I couldn't have navigated this process alone. Highly recommend their network of attorneys.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      location: `${city}, ${state}`,
      case: "Medical Malpractice",
      settlement: "$420,000",
      quote:
        "They matched me with a specialist who understood my case completely. The settlement covered all my medical expenses and more.",
      rating: 5,
    },
  ]

  const testimonials = cityData.testimonials.length > 0 ? cityData.testimonials : defaultTestimonials

  const services = [
    { name: "Car Accidents", icon: "🚗", description: "Get compensation for vehicle collisions and injuries" },
    { name: "Slip & Fall", icon: "⚠️", description: "Property owner negligence claims" },
    { name: "Medical Malpractice", icon: "🏥", description: "Healthcare provider negligence cases" },
    { name: "Workplace Injuries", icon: "🏗️", description: "On-the-job accident compensation" },
    { name: "Product Liability", icon: "📦", description: "Defective product injury claims" },
    { name: "Wrongful Death", icon: "💔", description: "Justice for families who lost loved ones" },
  ]

  const faqItems = [
    {
      question: `How much does it cost to hire a personal injury lawyer in ${city}?`,
      answer:
        "Nothing upfront. Our partner attorneys work on a contingency fee basis, meaning they only get paid when they win your case. You'll never pay out of pocket.",
    },
    {
      question: "How long will my case take?",
      answer:
        "It depends on the specifics of your case, but your attorney will aim to settle quickly and fairly. Most cases resolve within 6-18 months, though complex cases may take longer.",
    },
    {
      question: "What if I already got an insurance offer?",
      answer:
        "That initial offer is often much lower than what you deserve. An experienced attorney can negotiate for significantly more compensation based on the true value of your injuries and damages.",
    },
    {
      question: "What types of compensation can I receive?",
      answer:
        "You may be entitled to medical expenses, lost wages, pain and suffering, property damage, and in some cases, punitive damages.",
    },
    {
      question: "How quickly should I contact an attorney after my accident?",
      answer:
        "The sooner the better. Evidence can disappear, witnesses' memories fade, and there are legal deadlines (statutes of limitations) that must be met.",
    },
  ]

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-white">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4 overflow-hidden">
          {/* Floating Particles Background */}
          <FloatingParticles
            count={60}
            particleColor="rgba(255, 255, 255, 0.1)"
            className="pointer-events-none"
          />

          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative max-w-6xl mx-auto text-center">
            <FadeIn direction="down" delay={0.1}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <AnimatedText text="Injured in" className="inline-block mr-2" staggerDelay={0.03} />
                <span className="text-yellow-400 inline-block">
                  <TypingEffect
                    text={city}
                    speed={50}
                    className="text-yellow-400"
                    showCursor={false}
                  />
                </span>
                <span className="text-yellow-400">?</span>
                <br />
                <AnimatedText
                  text="Get the Settlement You Deserve."
                  staggerDelay={0.04}
                  className="block mt-2"
                />
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
                Connect instantly with top personal injury attorneys in {city} — so you can focus on healing, not fighting
                insurance companies.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.4}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-8 py-4 mb-8 shadow-2xl"
                    >
                      Get a Free Case Review
                    </Button>
                  }
                  source="hero-primary"
                  city={city}
                />
              </AnimatedButton>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <StaggerItem>
                <GlowEffect glowColor="rgba(234, 179, 8, 0.3)">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-yellow-400" />
                    <span>Millions Recovered</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
              <StaggerItem>
                <GlowEffect glowColor="rgba(234, 179, 8, 0.3)">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span>No Win, No Fee</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
              <StaggerItem>
                <GlowEffect glowColor="rgba(234, 179, 8, 0.3)">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
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
                Personal Injury Services in {city}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <GlowEffect
                        glowColor="rgba(59, 130, 246, 0.3)"
                        intensity={0.8}
                        className="mb-4"
                      >
                        <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">
                          {service.icon}
                        </div>
                      </GlowEffect>

                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>

                      <AnimatedButton magneticStrength={0.15} hoverScale={1.02}>
                        <TwoStepLeadModal
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent hover:bg-blue-50 border-blue-200 hover:border-blue-400 transition-all duration-300"
                            >
                              Get Help Now
                            </Button>
                          }
                          source={`service-${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                          city={city}
                          caseType={service.name}
                        />
                      </AnimatedButton>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-16 px-4 bg-red-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-red-800">
                Insurance Companies Hope You'll Settle for Less.
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="space-y-4">
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Medical bills stacking up?</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Missed work and lost paychecks?</p>
                  </div>
                </StaggerItem>
              </div>
              <div className="space-y-4">
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Emotional stress on top of physical pain?</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Insurance adjusters pushing low offers?</p>
                  </div>
                </StaggerItem>
              </div>
            </StaggerContainer>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 shadow-xl">
                      Don't Let Them Win - Get Help Now
                    </Button>
                  }
                  source="pain-points"
                  city={city}
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
                  We Make It Simple to Get Maximum Compensation.
                </h2>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <p className="text-xl mb-8 text-gray-700 max-w-4xl mx-auto">
                  Our network of skilled personal injury lawyers in {city} fights for every dollar you're owed. You pay
                  nothing unless you win — guaranteed.
                </p>
              </FadeIn>
            </div>

            {/* Statistics Section */}
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <StaggerItem>
                <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center min-h-[140px]">
                  <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                    <AnimatedNumber value={92} suffix="%" />
                  </div>
                  <p className="text-gray-700 font-semibold">Client Satisfaction</p>
                  <p className="text-sm text-gray-600 mt-1">We put people first</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center min-h-[140px]">
                  <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                    <AnimatedNumber value={20} suffix="+" />
                  </div>
                  <p className="text-gray-700 font-semibold">Years Combined Experience</p>
                  <p className="text-sm text-gray-600 mt-1">Serving  (local communities) {city}</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center min-h-[140px]">
                  <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                    <AnimatedNumber value={100} prefix="$" suffix="K" />
                  </div>
                  <p className="text-gray-700 font-semibold">Typical Case Value</p>
                  <p className="text-sm text-gray-600 mt-1">Fighting for maximum results</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <div className="text-center">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 shadow-xl">
                        Find Out What Your Case is Worth
                      </Button>
                    }
                    source="value-prop"
                    city={city}
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
                Only Three Steps to Your Peace of Mind.
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Lines */}
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>

              <StaggerItem>
                <div className="text-center relative">
                  <GlowEffect glowColor="rgba(59, 130, 246, 0.4)" intensity={1.2}>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                      <AnimatedNumber value={1} />
                    </div>
                  </GlowEffect>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Tell Us About Your Accident</h3>
                  <p className="text-gray-600">Free, no-obligation case evaluation.</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center relative">
                  <GlowEffect glowColor="rgba(59, 130, 246, 0.4)" intensity={1.2}>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                      <AnimatedNumber value={2} />
                    </div>
                  </GlowEffect>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Get Matched With a Local Attorney</h3>
                  <p className="text-gray-600">Specialized in personal injury claims like yours.</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center relative">
                  <GlowEffect glowColor="rgba(59, 130, 246, 0.4)" intensity={1.2}>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                      <AnimatedNumber value={3} />
                    </div>
                  </GlowEffect>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Collect Your Compensation</h3>
                  <p className="text-gray-600">Pay nothing out of pocket. Fees come from your settlement.</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 shadow-xl">
                        Start Step 1 Now
                      </Button>
                    }
                    source="how-it-works"
                    city={city}
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
                  No Recovery, No Fee — Ever.
                </GlowEffect>
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl text-gray-700 mb-8">
                You'll never pay upfront. Our partner attorneys only get paid if they win your case.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg px-8 py-4 shadow-xl">
                      Risk-Free Consultation
                    </Button>
                  }
                  source="risk-reversal"
                  city={city}
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
                Real Results for Real People
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
                        "{testimonial.quote}"
                      </p>

                      <div className="border-t pt-4 mt-auto">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 mb-2">{testimonial.location}</p>
                        <GlowEffect glowColor="rgba(59, 130, 246, 0.3)">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                            {testimonial.case} - {testimonial.settlement}
                          </Badge>
                        </GlowEffect>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Get Your Success Story Started
                      </Button>
                    }
                    source="testimonials"
                    city={city}
                  />
                </AnimatedButton>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="py-16 px-4 bg-blue-50 relative overflow-hidden">
          <ParallaxScroll speed={0.3} className="absolute inset-0 opacity-10">
            <FloatingParticles count={30} particleColor="rgba(59, 130, 246, 0.2)" />
          </ParallaxScroll>

          <div className="max-w-4xl mx-auto text-center relative">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-800">Still Weighing Your Options?</h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl mb-8 text-gray-700">
                If you're not ready yet, that's perfectly fine. Explore your options, and when you're ready to take
                action, we'll be here — prepared to fight for your full compensation.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-lg px-8 py-4 bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Get Your Free Case Review When Ready
                    </Button>
                  }
                  source="reassurance"
                  city={city}
                />
              </AnimatedButton>
            </FadeIn>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50" id="faq">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                Frequently Asked Questions
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
                        className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Still Have Questions? Get Answers Now
                      </Button>
                    }
                    source="faq"
                    city={city}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Ready to Get Started?</h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-3 gap-8 mb-8">
              <StaggerItem>
                <div className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <GlowEffect glowColor="rgba(59, 130, 246, 0.3)">
                    <FileText className="h-12 w-12 text-blue-600 mb-4 hover:scale-110 transition-transform duration-300" />
                  </GlowEffect>
                  <h3 className="font-semibold mb-2 text-gray-900">Free Case Review</h3>
                  <p className="text-gray-600">Get your case evaluated instantly</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <GlowEffect glowColor="rgba(59, 130, 246, 0.3)">
                    <Users className="h-12 w-12 text-blue-600 mb-4 hover:scale-110 transition-transform duration-300" />
                  </GlowEffect>
                  <h3 className="font-semibold mb-2 text-gray-900">Expert Matching</h3>
                  <p className="text-gray-600">Connected to specialized attorneys</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <GlowEffect glowColor="rgba(59, 130, 246, 0.3)">
                    <MapPin className="h-12 w-12 text-blue-600 mb-4 hover:scale-110 transition-transform duration-300" />
                  </GlowEffect>
                  <h3 className="font-semibold mb-2 text-gray-900">Serving</h3>
                  <p className="text-gray-600">{city} & Surrounding Areas</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>



        {/* Sticky Footer CTA */}
        <StickyFooterCTA city={city} />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 px-4 pb-20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 mb-4">
              LawProactive is a legal document and lead generation platform. We connect you with independent attorneys
              who handle your case directly.
            </p>
            <p className="text-gray-500 text-sm mt-4">© 2025 LawProactive. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AnalyticsProvider>
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

// Función para validar si la ubicación existe
async function validateLocation(stateSlug: string, citySlug: string): Promise<boolean> {
  try {
    const allLocations = await StateDataLoader.getAllProcessedLocations()

    return allLocations.some(location =>
      location.stateSlug === stateSlug && location.citySlug === citySlug
    )
  } catch (error) {
    console.error('Error validating location:', error)
    return false // Si hay error, mostrar 404
  }
}


