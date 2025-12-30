"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calculator, DollarSign, AlertTriangle, TrendingUp } from "lucide-react"
import { FadeIn, GlowEffect, AnimatedNumber } from "@/components/animations"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"

interface CompensationCalculatorProps {
    city: string
    state: string
    stateSlug: string
}

interface CalculatorInputs {
    injuryType: string
    medicalBills: number
    daysMissedWork: number
    dailyWage: number
}

const injuryTypes = [
    { value: "whiplash", label: "Whiplash / Neck Injury", multiplier: 1.5 },
    { value: "soft-tissue", label: "Soft Tissue Injuries", multiplier: 1.2 },
    { value: "broken-bone", label: "Broken Bones / Fractures", multiplier: 2.5 },
    { value: "back-injury", label: "Back / Spinal Injury", multiplier: 4.0 },
    { value: "head-injury", label: "Head / Brain Injury", multiplier: 5.0 },
    { value: "internal", label: "Internal Injuries", multiplier: 3.5 },
    { value: "other", label: "Other Injuries", multiplier: 2.0 },
]

// State-specific multipliers (for demo - reflects different legal environments)
const stateMultipliers: Record<string, number> = {
    "california": 1.15,
    "new-york": 1.10,
    "florida": 1.05,
    "texas": 0.95,
    "arizona": 1.0,
}

export function CompensationCalculator({ city, state, stateSlug }: CompensationCalculatorProps) {
    const [inputs, setInputs] = useState<CalculatorInputs>({
        injuryType: "whiplash",
        medicalBills: 5000,
        daysMissedWork: 14,
        dailyWage: 200,
    })

    const [showResults, setShowResults] = useState(false)

    const estimate = useMemo(() => {
        const injury = injuryTypes.find(i => i.value === inputs.injuryType) || injuryTypes[0]
        const stateMultiplier = stateMultipliers[stateSlug.toLowerCase()] || 1.0

        const medicalCosts = inputs.medicalBills
        const lostWages = inputs.daysMissedWork * inputs.dailyWage
        const painSuffering = medicalCosts * injury.multiplier

        const baseEstimate = medicalCosts + lostWages + painSuffering
        const adjustedEstimate = baseEstimate * stateMultiplier

        return {
            low: Math.round(adjustedEstimate * 0.7 / 1000) * 1000,
            high: Math.round(adjustedEstimate * 1.4 / 1000) * 1000,
            medicalCosts,
            lostWages,
            painSuffering: Math.round(painSuffering),
        }
    }, [inputs, stateSlug])

    const handleCalculate = () => {
        setShowResults(true)
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50">
            <div className="max-w-4xl mx-auto">
                <FadeIn direction="up" delay={0.1}>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <Calculator className="h-8 w-8 text-teal-600" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Estimate Your Compensation
                            </h2>
                        </div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Get a quick estimate of what your {city} personal injury case might be worth.
                            This calculator provides a rough range based on typical settlements.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.2}>
                    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-6 md:p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Injury Type */}
                                <div>
                                    <Label htmlFor="injuryType" className="text-gray-700 font-medium mb-2 block">
                                        Type of Injury
                                    </Label>
                                    <select
                                        id="injuryType"
                                        value={inputs.injuryType}
                                        onChange={(e) => setInputs(prev => ({ ...prev, injuryType: e.target.value }))}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                    >
                                        {injuryTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Medical Bills */}
                                <div>
                                    <Label htmlFor="medicalBills" className="text-gray-700 font-medium mb-2 block">
                                        Total Medical Bills ($)
                                    </Label>
                                    <input
                                        id="medicalBills"
                                        type="number"
                                        min="0"
                                        step="500"
                                        value={inputs.medicalBills}
                                        onChange={(e) => setInputs(prev => ({ ...prev, medicalBills: parseInt(e.target.value) || 0 }))}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="5000"
                                    />
                                </div>

                                {/* Days Missed */}
                                <div>
                                    <Label htmlFor="daysMissed" className="text-gray-700 font-medium mb-2 block">
                                        Days Missed from Work
                                    </Label>
                                    <input
                                        id="daysMissed"
                                        type="number"
                                        min="0"
                                        value={inputs.daysMissedWork}
                                        onChange={(e) => setInputs(prev => ({ ...prev, daysMissedWork: parseInt(e.target.value) || 0 }))}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="14"
                                    />
                                </div>

                                {/* Daily Wage */}
                                <div>
                                    <Label htmlFor="dailyWage" className="text-gray-700 font-medium mb-2 block">
                                        Daily Wage / Income ($)
                                    </Label>
                                    <input
                                        id="dailyWage"
                                        type="number"
                                        min="0"
                                        step="25"
                                        value={inputs.dailyWage}
                                        onChange={(e) => setInputs(prev => ({ ...prev, dailyWage: parseInt(e.target.value) || 0 }))}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="200"
                                    />
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <Button
                                    onClick={handleCalculate}
                                    size="lg"
                                    className="text-white font-bold px-10 py-6 text-lg shadow-lg hover:opacity-90"
                                    style={{ backgroundColor: '#0B6B65' }}
                                >
                                    <Calculator className="mr-2 h-5 w-5" />
                                    Calculate My Estimate
                                </Button>
                            </div>

                            {/* Results */}
                            {showResults && (
                                <FadeIn direction="up" delay={0.1}>
                                    <div className="border-t pt-8 mt-6">
                                        <div className="text-center mb-6">
                                            <p className="text-gray-600 mb-2">Your Estimated Compensation Range</p>
                                            <div className="flex items-center justify-center gap-3">
                                                <GlowEffect glowColor="rgba(45, 212, 191, 0.3)">
                                                    <div className="text-3xl md:text-4xl font-bold text-teal-600">
                                                        {formatCurrency(estimate.low)} - {formatCurrency(estimate.high)}
                                                    </div>
                                                </GlowEffect>
                                            </div>
                                        </div>

                                        {/* Breakdown */}
                                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                                <DollarSign className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                                                <p className="text-sm text-gray-600">Medical Costs</p>
                                                <p className="font-bold text-gray-900">{formatCurrency(estimate.medicalCosts)}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                                <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-2" />
                                                <p className="text-sm text-gray-600">Lost Wages</p>
                                                <p className="font-bold text-gray-900">{formatCurrency(estimate.lostWages)}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                                <AlertTriangle className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                                                <p className="text-sm text-gray-600">Pain & Suffering</p>
                                                <p className="font-bold text-gray-900">{formatCurrency(estimate.painSuffering)}</p>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 text-center">
                                            <p className="text-gray-700 mb-4">
                                                <strong>Want an accurate estimate?</strong> Actual settlements vary based on fault,
                                                evidence, insurance limits, and other factors. Speak with a {city} attorney for a
                                                personalized case evaluation.
                                            </p>
                                            <TwoStepLeadModal
                                                trigger={
                                                    <Button
                                                        size="lg"
                                                        className="text-white font-bold px-8 shadow-lg hover:opacity-90"
                                                        style={{ backgroundColor: '#e06e00' }}
                                                    >
                                                        Get Your Free Case Review
                                                    </Button>
                                                }
                                                source="calculator"
                                                city={city}
                                                state={state}
                                            />
                                        </div>
                                    </div>
                                </FadeIn>
                            )}

                            {/* Disclaimer */}
                            <p className="text-xs text-gray-500 text-center mt-6">
                                This calculator provides estimates only and is not legal advice. Actual case values
                                depend on many factors including evidence, liability, insurance coverage, and {state} law.
                                Consult with a licensed attorney for accurate evaluation.
                            </p>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
        </section>
    )
}
