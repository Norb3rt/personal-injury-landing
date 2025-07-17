
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MapPin, Star, Shield, Clock, DollarSign, FileText, Users } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

import { StickyFooterCTA } from "@/components/sticky-footer-cta"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { generateCityMetadata, generateLocalBusinessStructuredData, getAllCitySlugs } from "@/lib/seo"

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
    slug: string
  }
}

// Generate metadata for SEO - use static data for reliable builds
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com'

  // Use static metadata for reliable deployment
  return generateCityMetadata(params.slug, baseUrl)
}

export default function PersonalInjuryLanding({ params }: PageProps) {
  const city = params.slug.charAt(0).toUpperCase() + params.slug.slice(1).replace(/-/g, " ")
  const citySlug = params.slug
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com'

  // Use static data for reliable deployment
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

  // Generate structured data using utility function
  const structuredData = generateLocalBusinessStructuredData(citySlug, baseUrl)

  const defaultTestimonials = [
    {
      name: "Maria Rodriguez",
      location: "Los Angeles, CA",
      case: "Car Accident",
      settlement: "$285,000",
      quote:
        "After my accident, I was overwhelmed with medical bills and insurance calls. The attorney they connected me with fought hard and got me almost 3x what insurance initially offered.",
      rating: 5,
    },
    {
      name: "James Chen",
      location: "Orange County, CA",
      case: "Slip & Fall",
      settlement: "$150,000",
      quote:
        "Professional, responsive, and got results. I couldn't have navigated this process alone. Highly recommend their network of attorneys.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      location: "Riverside, CA",
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
        <section className="relative text-white py-20 px-4 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #0B6B65, #0B6B65, #374151)' }}>
          {/* Floating Particles Background */}
          <FloatingParticles
            count={60}
            particleColor="rgba(255, 255, 255, 0.15)"
            className="pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

          <div className="relative max-w-6xl mx-auto text-center">
            <FadeIn direction="down" delay={0.1}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <AnimatedText text="Injured in" className="inline-block mr-2" staggerDelay={0.03} />
                <span className="inline-block" style={{ color: '#e06e00' }}>
                  <TypingEffect
                    text={city}
                    speed={50}
                    className=""
                    showCursor={false}
                  />
                </span>
                <span style={{ color: '#e06e00' }}>?</span>
                <br />
                <AnimatedText
                  text="Get the Settlement You Deserve."
                  staggerDelay={0.04}
                  className="block mt-2"
                />
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto">
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
                      className="text-white font-bold text-lg px-8 py-4 mb-8 shadow-2xl transition-all duration-300 hover:opacity-90"
                      style={{ backgroundColor: '#e06e00', borderColor: '#e06e00' }}
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
                <GlowEffect glowColor="rgba(224, 110, 0, 0.4)" intensity={1.2}>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <DollarSign className="h-5 w-5" style={{ color: '#e06e00' }} />
                    <span className="text-white font-medium">Millions Recovered</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
              <StaggerItem>
                <GlowEffect glowColor="rgba(224, 110, 0, 0.4)" intensity={1.2}>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <Shield className="h-5 w-5" style={{ color: '#e06e00' }} />
                    <span className="text-white font-medium">No Win, No Fee</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
              <StaggerItem>
                <GlowEffect glowColor="rgba(224, 110, 0, 0.4)" intensity={1.2}>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <Clock className="h-5 w-5" style={{ color: '#e06e00' }} />
                    <span className="text-white font-medium">Available 24/7</span>
                  </div>
                </GlowEffect>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 bg-slate-50" id="services">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
                Personal Injury Services in {city}
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <GlowEffect
                        glowColor="rgba(11, 107, 101, 0.3)"
                        intensity={0.8}
                        className="mb-4"
                      >
                        <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">
                          {service.icon}
                        </div>
                      </GlowEffect>

                      <h3 className="text-xl font-semibold mb-2 text-slate-800">{service.name}</h3>
                      <p className="text-slate-600 mb-4 flex-grow">{service.description}</p>

                      <AnimatedButton magneticStrength={0.15} hoverScale={1.02}>
                        <TwoStepLeadModal
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent service-button"
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
        <section className="py-16 px-4 bg-rose-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-rose-800">
                Insurance Companies Hope You&apos;ll Settle for Less.
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="space-y-4">
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-rose-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Medical bills stacking up?</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-rose-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Missed work and lost paychecks?</p>
                  </div>
                </StaggerItem>
              </div>
              <div className="space-y-4">
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-rose-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Emotional stress on top of physical pain?</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-rose-500 rounded-full mt-2 animate-pulse"></div>
                    <p className="text-lg font-medium">Insurance adjusters pushing low offers?</p>
                  </div>
                </StaggerItem>
              </div>
            </StaggerContainer>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      className="text-white font-bold text-lg px-8 py-4 shadow-xl transition-all duration-300 hover:opacity-90"
                      style={{ backgroundColor: '#e06e00', borderColor: '#e06e00' }}
                    >
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
        <section className="py-16 px-4 bg-teal-50 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <FadeIn direction="up" delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-teal-800">
                  We Make It Simple to Get Maximum Compensation.
                </h2>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <p className="text-xl mb-8 text-slate-700 max-w-4xl mx-auto">
                  Our network of skilled personal injury lawyers in {city} fights for every dollar you're owed. You pay
                  nothing unless you win — guaranteed.
                </p>
              </FadeIn>
            </div>

            {/* Statistics Section */}
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <StaggerItem>
                <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center min-h-[140px]">
                  <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                    <AnimatedNumber value={92} suffix="%" />
                  </div>
                  <p className="text-slate-700 font-semibold">Client Satisfaction</p>
                  <p className="text-sm text-slate-600 mt-1">We put people first</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center min-h-[140px]">
                  <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                    <AnimatedNumber value={20} suffix="+" />
                  </div>
                  <p className="text-slate-700 font-semibold">Years Combined Experience</p>
                  <p className="text-sm text-slate-600 mt-1">Serving  (local communities) {city}</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center min-h-[140px]">
                  <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                    <AnimatedNumber value={100} prefix="$" suffix="K" />
                  </div>
                  <p className="text-slate-700 font-semibold">Typical Case Value</p>
                  <p className="text-sm text-slate-600 mt-1">Fighting for maximum results</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <div className="text-center">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button
                        size="lg"
                        className="text-white font-bold text-lg px-8 py-4 shadow-xl transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: '#0B6B65', borderColor: '#0B6B65' }}
                      >
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

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
                Real Results for Real People
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 transform hover:scale-[1.02]">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <GlowEffect key={i} glowColor="rgba(251, 191, 36, 0.4)">
                            <Star className="h-5 w-5 fill-amber-400 text-amber-400 animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }} />
                          </GlowEffect>
                        ))}
                      </div>

                      <p className="text-slate-600 mb-4 italic flex-grow leading-relaxed">
                        "{testimonial.quote}"
                      </p>

                      <div className="border-t pt-4 mt-auto">
                        <p className="font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-sm text-slate-500 mb-2">{testimonial.location}</p>
                        <GlowEffect glowColor="rgba(45, 212, 191, 0.3)">
                          <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors">
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
                        className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
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
        <section className="py-16 px-4 bg-slate-50 relative overflow-hidden">
          <ParallaxScroll speed={0.3} className="absolute inset-0 opacity-10">
            <FloatingParticles count={30} particleColor="rgba(45, 212, 191, 0.2)" />
          </ParallaxScroll>

          <div className="max-w-4xl mx-auto text-center relative">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">Still Weighing Your Options?</h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl mb-8 text-slate-700">
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
                      className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-bold text-lg px-8 py-4 bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
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

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-white relative overflow-hidden" id="how-it-works">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
                Only Three Steps to Your Peace of Mind.
              </h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Lines */}
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200"></div>

              <StaggerItem>
                <div className="text-center relative">
                  <GlowEffect glowColor="rgba(45, 212, 191, 0.4)" intensity={1.2}>
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                      <AnimatedNumber value={1} />
                    </div>
                  </GlowEffect>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Tell Us About Your Accident</h3>
                  <p className="text-slate-600">Free, no-obligation case evaluation.</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center relative">
                  <GlowEffect glowColor="rgba(45, 212, 191, 0.4)" intensity={1.2}>
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                      <AnimatedNumber value={2} />
                    </div>
                  </GlowEffect>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Get Matched With a Local Attorney</h3>
                  <p className="text-slate-600">Specialized in personal injury claims like yours.</p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center relative">
                  <GlowEffect glowColor="rgba(45, 212, 191, 0.4)" intensity={1.2}>
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                      <AnimatedNumber value={3} />
                    </div>
                  </GlowEffect>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Collect Your Compensation</h3>
                  <p className="text-slate-600">Pay nothing out of pocket. Fees come from your settlement.</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <div className="text-center mt-8">
              <FadeIn direction="up" delay={0.3}>
                <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                  <TwoStepLeadModal
                    trigger={
                      <Button
                        size="lg"
                        className="text-white font-bold text-lg px-8 py-4 shadow-xl transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: '#0B6B65', borderColor: '#0B6B65' }}
                      >
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
        <section className="py-16 px-4 bg-amber-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-800">
                <GlowEffect glowColor="rgba(251, 191, 36, 0.3)">
                  No Recovery, No Fee — Ever.
                </GlowEffect>
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl text-slate-700 mb-8">
                You'll never pay upfront. Our partner attorneys only get paid if they win your case.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.2} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      className="text-white font-bold text-lg px-8 py-4 shadow-xl transition-all duration-300 hover:opacity-90"
                      style={{ backgroundColor: '#e06e00', borderColor: '#e06e00' }}
                    >
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

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-slate-50" id="faq">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
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
                      <AccordionTrigger className="text-left font-semibold hover:text-teal-600 transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed">
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
                  <h3 className="font-semibold mb-2 text-slate-800">Expert Matching</h3>
                  <p className="text-slate-600">Connected to specialized attorneys</p>
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

        {/* Sticky Footer CTA */}
        <StickyFooterCTA city={city} />

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 px-4 pb-20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-slate-400 mb-4">
              LawProactive is a legal document and lead generation platform. We connect you with independent attorneys
              who handle your case directly.
            </p>
            {/* <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-yellow-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-yellow-400">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="hover:text-yellow-400">
                Legal Disclaimer
              </Link>
            </div> */}
            <p className="text-slate-500 text-sm mt-4">© 2025 LawProactive. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AnalyticsProvider>
  )
}

// Generate static params for all cities using utility function
export async function generateStaticParams() {
  // Get all city slugs (includes both old format and new california-city format)
  const allCities = getAllCitySlugs()

  console.log(`🏗️ Generating static params for ${allCities.length} cities`)

  return allCities.map((citySlug) => ({
    slug: citySlug,
  }))
}


