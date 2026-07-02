"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Minus,
    Car,
    Clock,
    MapPin,
    Activity,
    Info
} from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, GlowEffect, AnimatedNumber } from "@/components/animations"
import type { AccidentStats } from "@/data/accident-stats"

interface AccidentStatisticsProps {
    stats: AccidentStats
}

export function AccidentStatistics({ stats }: AccidentStatisticsProps) {
    const getTrendIcon = () => {
        if (stats.yearOverYearChange > 0) {
            return <TrendingUp className="h-4 w-4 text-red-500" />
        } else if (stats.yearOverYearChange < 0) {
            return <TrendingDown className="h-4 w-4 text-green-500" />
        }
        return <Minus className="h-4 w-4 text-gray-500" />
    }

    const getTrendColor = () => {
        if (stats.yearOverYearChange > 0) return "text-red-600"
        if (stats.yearOverYearChange < 0) return "text-green-600"
        return "text-gray-600"
    }

    const getComparisonBadge = () => {
        const colors = {
            above: "bg-red-100 text-red-700 border-red-200",
            below: "bg-green-100 text-green-700 border-green-200",
            average: "bg-gray-100 text-gray-700 border-gray-200"
        }
        const labels = {
            above: `~${stats.comparedToStateAvgPercent}% Above State Avg`,
            below: `~${stats.comparedToStateAvgPercent}% Below State Avg`,
            average: "~At State Average"
        }
        return (
            <Badge variant="outline" className={`${colors[stats.comparedToStateAvg]} font-medium`}>
                {labels[stats.comparedToStateAvg]}
            </Badge>
        )
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
            <div className="max-w-6xl mx-auto">
                <FadeIn direction="up" delay={0.1}>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {stats.city} Traffic Safety Estimate
                            </h2>
                        </div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Understanding local traffic risk patterns can help you stay safe and know what to
                            expect if you're injured in {stats.city}, {stats.stateAbbr}.
                        </p>
                        {stats.isEstimated && (
                            <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
                                <Info className="h-3.5 w-3.5" />
                                Modeled estimate — not official crash records
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Main Stats Grid */}
                <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-4 gap-4 mb-8">
                    <StaggerItem>
                        <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <GlowEffect glowColor="rgba(239, 68, 68, 0.2)">
                                    <Car className="h-8 w-8 mx-auto mb-3 text-red-500" />
                                </GlowEffect>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    ~<AnimatedNumber value={stats.annualAccidents} />
                                </div>
                                <p className="text-sm text-gray-600">Est. Annual Accidents</p>
                                <div className={`flex items-center justify-center gap-1 mt-2 text-xs ${getTrendColor()}`}>
                                    {getTrendIcon()}
                                    <span>{Math.abs(stats.yearOverYearChange)}% vs last year (modeled)</span>
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <GlowEffect glowColor="rgba(234, 179, 8, 0.2)">
                                    <Activity className="h-8 w-8 mx-auto mb-3 text-amber-500" />
                                </GlowEffect>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    ~<AnimatedNumber value={stats.annualInjuries} />
                                </div>
                                <p className="text-sm text-gray-600">Est. Injuries Reported</p>
                                <p className="text-xs text-gray-500 mt-2">Modeled per-year average</p>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <GlowEffect glowColor="rgba(107, 114, 128, 0.2)">
                                    <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-gray-600" />
                                </GlowEffect>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    ~<AnimatedNumber value={stats.annualFatalities} />
                                </div>
                                <p className="text-sm text-gray-600">Est. Fatalities</p>
                                <p className="text-xs text-gray-500 mt-2">Modeled annual average</p>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <GlowEffect glowColor="rgba(59, 130, 246, 0.2)">
                                    <MapPin className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                                </GlowEffect>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    ~<AnimatedNumber value={stats.accidentRate} />
                                </div>
                                <p className="text-sm text-gray-600">Est. Per 100K Residents</p>
                                <div className="mt-2">
                                    {getComparisonBadge()}
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>
                </StaggerContainer>

                {/* Secondary Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Accident Types */}
                    <FadeIn direction="up" delay={0.3}>
                        <Card className="h-full border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Car className="h-5 w-5 text-orange-500" />
                                    Most Common Accident Types (Modeled)
                                </h3>
                                <div className="space-y-3">
                                    {stats.topAccidentTypes.map((type, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="text-xl">{type.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-gray-700">{type.type}</span>
                                                    <span className="text-sm font-bold text-gray-900">~{type.percentage}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000"
                                                        style={{ width: `${type.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </FadeIn>

                    {/* Dangerous Roads & Peak Times */}
                    <FadeIn direction="up" delay={0.4}>
                        <Card className="h-full border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* High-Risk Areas */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-red-500" />
                                            Nearby High-Traffic Roads in {stats.city}
                                        </h3>
                                        <ul className="space-y-2">
                                            {stats.dangerousRoads.map((road, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                                                    {road}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Peak Accident Times */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-amber-500" />
                                            Typical Peak Risk Times (Modeled)
                                        </h3>
                                        <ul className="space-y-2">
                                            {stats.peakAccidentTimes.map((time, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                                                    {time}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeIn>
                </div>

                {/* Disclaimer — sourced from the data layer itself, never hardcoded here.
                    This is intentionally NOT tiny/buried gray text: it sits in its own
                    labeled callout so it reads as a real caveat, not legal filler. */}
                <FadeIn direction="up" delay={0.5}>
                    <div className="mt-8 max-w-2xl mx-auto rounded-lg border border-gray-200 bg-white/70 px-5 py-4">
                        <p className="text-sm text-gray-700 flex items-start gap-2">
                            <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span>{stats.disclaimer}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2 pl-6">
                            {stats.methodologyNote} Actual figures may vary and should not be used as the
                            sole basis for legal or safety decisions.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}