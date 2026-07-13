"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Scale, Clock, Shield, AlertTriangle } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, GlowEffect } from "@/components/animations"
import type { StateLawInfo } from "@/data/state-laws"

interface StateLegalInfoProps {
    lawInfo: StateLawInfo
    cityName: string
}

export function StateLegalInfo({ lawInfo, cityName }: StateLegalInfoProps) {
    const infoCards = [
        {
            icon: Clock,
            title: "Statute of Limitations",
            value: lawInfo.statuteOfLimitations,
            color: "text-blue-600"
        },
        {
            icon: Scale,
            title: "Fault System",
            value: lawInfo.faultSystem,
            color: "text-teal-600"
        },
        {
            icon: Shield,
            title: "Minimum Insurance",
            value: lawInfo.minInsurance,
            color: "text-green-600"
        }
    ]

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-slate-100 to-blue-50">
            <div className="max-w-6xl mx-auto">
                <FadeIn direction="up" delay={0.1}>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800">
                        {lawInfo.stateName} Personal Injury Law
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Important legal information for accident victims in {cityName}, {lawInfo.stateName}.
                    </p>
                </FadeIn>

                <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-6 mb-12">
                    {infoCards.map((card, index) => (
                        <StaggerItem key={index}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-6 text-center">
                                    <GlowEffect glowColor="rgba(59, 130, 246, 0.2)" className="mb-4">
                                        <card.icon className={`h-10 w-10 mx-auto ${card.color}`} />
                                    </GlowEffect>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{card.title}</h3>
                                    <p className="text-gray-600 text-sm">{card.value}</p>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                <FadeIn direction="up" delay={0.3}>
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Key Facts for {lawInfo.stateName} Injury Victims
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Understanding these rules can significantly impact your case outcome.
                                    </p>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {lawInfo.keyFacts.map((fact, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-700">{fact}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn direction="up" delay={0.6}>
                    <p className="text-xs text-gray-600 mt-8 mb-6 italic max-w-lg mx-auto text-center">
                        Disclaimer: This is general legal information, not legal advice. Statutes of limitations vary by case and exceptions may apply — consult a licensed attorney about your specific deadline.
                    </p>
                </FadeIn>
            </div>
        </section>
    )
}
