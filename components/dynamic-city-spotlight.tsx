"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users, Shield, Building, Award } from "lucide-react"
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedNumber,
  AnimatedButton,
  GlowEffect,
} from "@/components/animations"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"

// Import types
import type { StateConfig } from "@/lib/types/location.types"

interface CityData {
  city: string
  landmark: string
  population: number
  slug: string
}

interface DynamicCitySpotlightProps {
  currentState: string // State slug (e.g., "california", "texas")
  currentCity: string // Current city slug
  stateDisplayName: string // Display name for state
  cityDisplayName: string // Display name for city
}

export function DynamicCitySpotlight({
  currentState,
  currentCity,
  stateDisplayName,
  cityDisplayName
}: DynamicCitySpotlightProps) {
  const [cityData, setCityData] = useState<CityData | null>(null)
  const [stateConfig, setStateConfig] = useState<StateConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load city and state data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Load cities data for the current state
        let citiesData: CityData[] = []
        let config: StateConfig | null = null

        try {
          // Try to load state-specific cities data
          const citiesModule = await import(`@/data/states/${currentState}-cities.json`)
          citiesData = citiesModule.default as CityData[]

          // Load state config
          const statesConfig = await import("@/data/metadata/states-config.json")
          config = (statesConfig.default as any)[currentState] as StateConfig
        } catch (importErr) {
          console.warn(`No data file found for ${currentState}, using fallback`)
          // Fallback: create basic config
          config = {
            name: stateDisplayName,
            abbreviation: currentState.substring(0, 2).toUpperCase(),
            slug: currentState,
            timezone: "America/New_York",
            majorCities: [],
            seoModifiers: [],
            defaultCoordinates: { lat: 39.8283, lng: -98.5795 },
            enabled: true
          }
        }

        // Find the current city data
        const currentCityData = citiesData.find(c =>
          c.slug === currentCity || c.slug === currentCity.toLowerCase()
        )

        setCityData(currentCityData || null)
        setStateConfig(config)
      } catch (err) {
        console.error(`Error loading data for ${currentState}/${currentCity}:`, err)
        setError(`Unable to load data for ${cityDisplayName}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentState, currentCity, stateDisplayName, cityDisplayName])

  // Get state display name
  const stateDisplayNameFinal = stateConfig?.name || stateDisplayName

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading city information...</p>
        </div>
      </section>
    )
  }

  if (error || !cityData) {
    // Fallback content when no specific city data is available - SIMPLIFIED
    return (
      <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Serving Cities Across {stateDisplayNameFinal}
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-600 mb-4">
                {cityDisplayName}
              </h3>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Our network of experienced personal injury attorneys provides legal services throughout {stateDisplayNameFinal}.
                Find professional legal assistance in your {cityDisplayName}.
              </p>
            </FadeIn>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StaggerItem>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Support</p>
                    <p className="text-xl font-bold text-gray-900">24/7 Available</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Fee Structure</p>
                    <p className="text-lg font-bold text-gray-900">No Win, No Fee</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          <div className="text-center mt-6">
            <FadeIn direction="up" delay={0.3}>
              <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
                <TwoStepLeadModal
                  trigger={
                    <Button
                      size="lg"
                      className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90"
                      style={{ backgroundColor: '#0B6B65' }}
                    >
                      Get Legal Help in {cityDisplayName}
                    </Button>
                  }
                  source="city-spotlight-fallback"
                  city={cityDisplayName}
                  state={stateDisplayNameFinal}
                />
              </AnimatedButton>
            </FadeIn>
          </div>
        </div>
      </section>
    )
  }

  // Main content with city data - SIMPLIFIED VERSION
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FadeIn direction="up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Serving Cities Across {stateDisplayNameFinal}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Our network of experienced personal injury attorneys provides legal services throughout {stateDisplayNameFinal}.
              Find professional legal assistance in your city.
            </p>
          </FadeIn>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Population */}
            <StaggerItem>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Population</p>
                  <p className="text-xl font-bold text-gray-900">
                    {cityData.population > 0 ? cityData.population.toLocaleString() : "Local Community"}
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Landmark */}
            <StaggerItem>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Landmark</p>
                  <p className="text-lg font-bold text-gray-900">
                    {cityData.landmark || "Local Landmarks"}
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Simple CTA */}
        <div className="text-center mt-6">
          <FadeIn direction="up" delay={0.3}>
            <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
              <TwoStepLeadModal
                trigger={
                  <Button
                    size="lg"
                    className="text-white font-bold text-lg px-8 py-4 shadow-xl hover:opacity-90"
                    style={{ backgroundColor: '#0B6B65' }}
                  >
                    Get Legal Help in {cityData.city}
                  </Button>
                }
                source="city-spotlight-simple"
                city={cityDisplayName}
                state={stateDisplayNameFinal}
              />
            </AnimatedButton>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
