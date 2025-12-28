"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Phone, Landmark, Hospital, Shield } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, GlowEffect } from "@/components/animations"

interface LocalResourcesProps {
    cityName: string
    stateName: string
    landmark?: string | null
}

export function LocalResources({ cityName, stateName, landmark }: LocalResourcesProps) {
    // Generate local resource names dynamically based on city
    const resources = [
        {
            icon: Hospital,
            title: `${cityName} Medical Centers`,
            description: "Seek immediate medical attention for your injuries",
            color: "text-red-500"
        },
        {
            icon: Shield,
            title: `${cityName} Police Department`,
            description: "File an accident report if you haven't already",
            color: "text-blue-600"
        },
        {
            icon: Building2,
            title: `${cityName} Superior Court`,
            description: "Where personal injury lawsuits are filed",
            color: "text-purple-600"
        },
        {
            icon: Phone,
            title: "Emergency Services",
            description: "Call 911 for immediate emergencies",
            color: "text-orange-500"
        }
    ]

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <FadeIn direction="up" delay={0.1}>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800">
                        Local Resources in {cityName}
                    </h2>
                    <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                        Essential contacts for accident victims in {cityName}, {stateName}.
                        {landmark && (
                            <span className="block mt-2 text-teal-600 font-medium">
                                Proudly serving the community near {landmark}.
                            </span>
                        )}
                    </p>
                </FadeIn>

                <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((resource, index) => (
                        <StaggerItem key={index}>
                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white group">
                                <CardContent className="p-6 text-center">
                                    <GlowEffect glowColor="rgba(45, 212, 191, 0.2)" className="mb-4">
                                        <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <resource.icon className={`h-7 w-7 ${resource.color}`} />
                                        </div>
                                    </GlowEffect>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{resource.title}</h3>
                                    <p className="text-gray-600 text-sm">{resource.description}</p>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {landmark && (
                    <FadeIn direction="up" delay={0.3}>
                        <div className="mt-12 text-center">
                            <Card className="inline-block border-0 shadow-md bg-gradient-to-r from-teal-50 to-blue-50">
                                {/* <CardContent className="p-6 flex items-center gap-4">
                                    <Landmark className="h-8 w-8 text-teal-600" />
                                    <div className="text-left">
                                        <p className="text-sm text-gray-600">Local Landmark</p>
                                        <p className="text-lg font-semibold text-gray-800">{landmark}</p>
                                    </div>
                                </CardContent> */}
                            </Card>
                        </div>
                    </FadeIn>
                )}
            </div>
        </section>
    )
}
