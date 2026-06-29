"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Shield, Clock, Phone } from "lucide-react"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { FadeIn, GlowEffect, AnimatedButton } from "@/components/animations"

interface CityGoogleMapProps {
    cityName: string
    stateName: string
    latitude?: number
    longitude?: number
}

export function CityGoogleMap({ cityName, stateName, latitude, longitude }: CityGoogleMapProps) {
    // Standard Google Maps free embed query
    // Centers exactly on the City and State
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${cityName}, ${stateName}`)}&t=&z=12&ie=UTF8&iwloc=&output=embed`

    return (
        <section className="py-10 md:py-16 px-4 bg-slate-50 relative overflow-hidden" id="service-area">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                    
                    {/* Left Column: Local Context & CTA */}
                    <div className="md:col-span-5 space-y-4 md:space-y-6 text-center md:text-left">
                        <FadeIn direction="right" delay={0.1}>
                            <Badge variant="outline" className="px-4 py-1 border-teal-600 text-teal-700 bg-teal-50/50 inline-flex">
                                <MapPin className="h-3.5 w-3.5 mr-1 animate-pulse text-teal-600" />
                                Local Service Area
                            </Badge>
                        </FadeIn>

                        <FadeIn direction="right" delay={0.2}>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                                Serving Injury Victims in <span className="text-teal-600">{cityName}</span> & Surrounding Communities
                            </h2>
                        </FadeIn>

                        <FadeIn direction="right" delay={0.3}>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                If you were injured in an accident in or near <span className="font-semibold">{cityName}, {stateName}</span>, our advertising platform connects you with licensed attorneys who serve the {cityName} area. Request a free, no-obligation case evaluation and let a local {stateName} attorney review your claim.
                            </p>
                        </FadeIn>

                        {/* Local trust elements */}
                        <FadeIn direction="right" delay={0.4}>
                            <div className="space-y-3 pt-2 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-teal-100/80 text-teal-700 mt-1">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">No Win, No Fee</p>
                                        <p className="text-xs text-gray-500">Attorneys serving {cityName} work on contingency — No Recovery, No Attorney’s Fee.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-teal-100/80 text-teal-700 mt-1">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Available 24 Hours a Day</p>
                                        <p className="text-xs text-gray-500">Request a free case review from a {stateName}-licensed attorney — anytime, day or night.</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 italic">*No attorney&apos;s fee unless there is a recovery. The client may be responsible for court costs and case expenses.</p>
                            </div>
                        </FadeIn>

                        {/* Interactive CTA */}
                        <FadeIn direction="right" delay={0.5}>
                            <div className="pt-4 flex flex-wrap gap-4 items-center justify-center md:justify-start">
                                <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                                    <TwoStepLeadModal
                                        trigger={
                                            <Button
                                                size="lg"
                                                className="text-white font-bold text-base px-6 py-5 shadow-xl hover:opacity-95 transition-all duration-300 w-full sm:w-auto"
                                                style={{ backgroundColor: '#e06e00' }}
                                            >
                                                Start Your Free Evaluation
                                            </Button>
                                        }
                                        source="city-map"
                                        city={cityName}
                                        state={stateName}
                                    />
                                </AnimatedButton>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right Column: Embedded Map */}
                    <div className="md:col-span-7 order-last">
                        <FadeIn direction="left" delay={0.3}>
                            <GlowEffect glowColor="rgba(11, 107, 101, 0.15)" intensity={0.5} className="w-full">
                                <Card className="p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-slate-100 overflow-hidden">
                                    {/* Map Wrapper with explicit dimensions to prevent Cumulative Layout Shift (CLS) */}
                                    <div className="w-full h-[280px] sm:h-[350px] md:h-[450px] relative overflow-hidden rounded-xl bg-slate-100">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            allowFullScreen
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`Google Map of ${cityName}, ${stateName}`}
                                            src={mapEmbedUrl}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </Card>
                            </GlowEffect>
                        </FadeIn>
                    </div>

                </div>
            </div>
        </section>
    )
}
