import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MapPin, Star, Shield, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

import { StickyFooterCTA } from "@/components/sticky-footer-cta"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { generateCityMetadata, generateLocalBusinessStructuredData, getAllCitySlugs } from "@/lib/seo"
import { getCityData, generateCityMetadata as generateStrapiMetadata } from "@/lib/strapi"

interface PageProps {
  params: {
    city: string
  }
}

// Generate metadata for SEO - try Strapi first, fallback to static
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com'

  // Try to get metadata from Strapi first
  const strapiMetadata = await generateStrapiMetadata(params.city)
  if (strapiMetadata && strapiMetadata.title) {
    return {
      title: strapiMetadata.title,
      description: strapiMetadata.description,
      keywords: strapiMetadata.keywords,
      metadataBase: new URL(baseUrl),
      alternates: { canonical: `/${params.city}` },
      openGraph: {
        title: strapiMetadata.title,
        description: strapiMetadata.description,
        url: `${baseUrl}/${params.city}`,
        siteName: 'LawProactive',
        locale: 'en_US',
        type: 'website',
      },
      robots: { index: true, follow: true },
      other: strapiMetadata.coordinates ? {
        'geo.region': 'US-CA',
        'geo.placename': strapiMetadata.coordinates.lat ? params.city.replace(/-/g, ' ') : undefined,
        'geo.position': strapiMetadata.coordinates.lat ? `${strapiMetadata.coordinates.lat};${strapiMetadata.coordinates.lng}` : undefined,
      } : {},
    }
  }

  // Fallback to static metadata
  return generateCityMetadata(params.city, baseUrl)
}

export default async function PersonalInjuryLanding({ params }: PageProps) {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1).replace(/-/g, " ")
  const citySlug = params.city
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com'

  // Try to get city data from Strapi
  const strapiCityData = await getCityData(citySlug)

  // Use Strapi data if available, otherwise use defaults
  const cityData = strapiCityData ? {
    name: strapiCityData.attributes.name,
    practiceAreas: strapiCityData.attributes.practiceAreas || [],
    testimonials: strapiCityData.attributes.testimonials || [],
    localStats: strapiCityData.attributes.localStats || {
      averageSettlement: "$125,000",
      casesWon: 95,
      yearsExperience: 15
    }
  } : {
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

  const services = [
    { name: "Car Accidents", icon: "🚗", description: "Get compensation for vehicle collisions and injuries" },
    { name: "Slip & Fall", icon: "⚠️", description: "Property owner negligence claims" },
    { name: "Medical Malpractice", icon: "🏥", description: "Healthcare provider negligence cases" },
    { name: "Workplace Injuries", icon: "🏗️", description: "On-the-job accident compensation" },
    { name: "Product Liability", icon: "📦", description: "Defective product injury claims" },
    { name: "Wrongful Death", icon: "💔", description: "Justice for families who lost loved ones" },
  ]

  const testimonials = [
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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Injured in <span className="text-yellow-400">{city}</span>?<br />
              Get the Settlement You Deserve.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Connect instantly with top personal injury attorneys in {city} — so you can focus on healing, not fighting
              insurance companies.
            </p>
            <TwoStepLeadModal
              trigger={
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-8 py-4 mb-8"
                >
                  Get a Free Case Review
                </Button>
              }
              source="hero-primary"
              city={city}
            />
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                <span>Millions Recovered</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span>No Win, No Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>Available 24/7</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 bg-gray-50" id="services">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Personal Injury Services in {city}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <TwoStepLeadModal
                      trigger={
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Get Help Now
                        </Button>
                      }
                      source={`service-${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                      city={city}
                      caseType={service.name}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-16 px-4 bg-red-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-red-800">
              Insurance Companies Hope You'll Settle for Less.
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-lg">Medical bills stacking up?</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-lg">Missed work and lost paychecks?</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-lg">Emotional stress on top of physical pain?</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-lg">Insurance adjusters pushing low offers?</p>
                </div>
              </div>
            </div>
            <TwoStepLeadModal
              trigger={
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4">
                  Don't Let Them Win - Get Help Now
                </Button>
              }
              source="pain-points"
              city={city}
            />
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 px-4 bg-green-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">
              We Make It Simple to Get Maximum Compensation.
            </h2>
            <p className="text-xl mb-8 text-gray-700">
              Our network of skilled personal injury lawyers in {city} fights for every dollar you're owed. You pay
              nothing unless you win — guaranteed.
            </p>
            <TwoStepLeadModal
              trigger={
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4">
                  Find Out What Your Case is Worth
                </Button>
              }
              source="value-prop"
              city={city}
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Real Results for Real People
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                      <Badge variant="secondary" className="mt-2">
                        {testimonial.case} - {testimonial.settlement}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <TwoStepLeadModal
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                  >
                    Get Your Success Story Started
                  </Button>
                }
                source="testimonials"
                city={city}
              />
            </div>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="py-16 px-4 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-800">Still Weighing Your Options?</h2>
            <p className="text-xl mb-8 text-gray-700">
              If you're not ready yet, that's perfectly fine. Explore your options, and when you're ready to take
              action, we'll be here — prepared to fight for your full compensation.
            </p>
            <TwoStepLeadModal
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-lg px-8 py-4 bg-transparent"
                >
                  Get Your Free Case Review When Ready
                </Button>
              }
              source="reassurance"
              city={city}
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-white" id="how-it-works">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Only Three Steps to Your Peace of Mind.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Tell Us About Your Accident</h3>
                <p className="text-gray-600">Free, no-obligation case evaluation.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Matched With a Local Attorney</h3>
                <p className="text-gray-600">Specialized in personal injury claims like yours.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Collect Your Compensation</h3>
                <p className="text-gray-600">Pay nothing out of pocket. Fees come from your settlement.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <TwoStepLeadModal
                trigger={
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4">
                    Start Step 1 Now
                  </Button>
                }
                source="how-it-works"
                city={city}
              />
            </div>
          </div>
        </section>

        {/* Risk Reversal Section */}
        <section className="py-16 px-4 bg-yellow-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-800">No Recovery, No Fee — Ever.</h2>
            <p className="text-xl text-gray-700 mb-8">
              You'll never pay upfront. Our partner attorneys only get paid if they win your case.
            </p>
            <TwoStepLeadModal
              trigger={
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg px-8 py-4">
                  Risk-Free Consultation
                </Button>
              }
              source="risk-reversal"
              city={city}
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50" id="faq">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
              <TwoStepLeadModal
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white bg-transparent"
                  >
                    Still Have Questions? Get Answers Now
                  </Button>
                }
                source="faq"
                city={city}
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Ready to Get Started?</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <Phone className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Call Now</h3>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600">info@lawproactive.com</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Serving</h3>
                <p className="text-gray-600">{city} & Surrounding Areas</p>
              </div>
            </div>
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
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-yellow-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-yellow-400">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="hover:text-yellow-400">
                Legal Disclaimer
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-4">© 2025 LawProactive. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AnalyticsProvider>
  )
}

// Generate static params for all cities using utility function
export async function generateStaticParams() {
  const cities = getAllCitySlugs()

  // Add additional cities not in the main database
  const additionalCities = [
    "riverside",
    "san-bernardino",
    "ventura",
    "santa-barbara",
    "kern",
    "imperial",
    "fresno",
    "bakersfield",
    "stockton",
    "modesto",
    "oxnard",
    "fontana",
    "moreno-valley",
    "huntington-beach",
    "glendale",
    "santa-clarita",
    "garden-grove",
    "oceanside",
    "rancho-cucamonga",
    "santa-rosa",
    "ontario",
    "lancaster",
    "elk-grove",
    "palmdale",
    "corona",
    "salinas",
    "pomona",
    "hayward",
    "escondido",
    "torrance",
    "sunnyvale",
    "orange",
    "fullerton",
    "pasadena",
    "thousand-oaks",
    "visalia",
    "simi-valley",
    "concord"
  ]

  const allCities = [...cities, ...additionalCities]

  return allCities.map((city) => ({
    city: city,
  }))
}
