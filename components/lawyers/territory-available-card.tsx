"use client"

import { Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"

interface TerritoryAvailableCardProps {
  city: string
  state: string
}

export function TerritoryAvailableCard({ city, state }: TerritoryAvailableCardProps) {
  return (
    <FadeIn direction="up" delay={0.1}>
      {/* Warm amber background — visually distinct from the teal lawyer card */}
      <section className="py-8 px-4 bg-amber-50">
        <div className="max-w-3xl mx-auto">

          {/* ── Badge ── */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-semibold
                         border border-amber-400 bg-amber-100 text-amber-800 shadow-sm"
            >
              <Search className="h-4 w-4" />
              Finding Attorneys in {city}, {state}
            </span>
          </div>

          {/* ── Card ── */}
          <div
            className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden
                       transition-all duration-300 hover:shadow-xl"
          >
            {/* Top accent strip — uses the landing's primary green */}
            <div className="h-1.5 w-full" style={{ backgroundColor: "#0B6B65" }} />

            <div className="p-6 sm:p-8">
              <StaggerContainer staggerDelay={0.08}>

                {/* Heading */}
                <StaggerItem>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3">
                    No attorney has claimed {city} territory yet.
                  </h2>
                </StaggerItem>

                {/* Sub-copy */}
                <StaggerItem>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed max-w-xl mx-auto">
                    This page is part of our attorney marketing software platform. Visitors are potential clients actively seeking legal help in
                    <span className="font-semibold text-gray-800"> {city}</span> All consultations are handled directly by the renting
                    <span className="font-semibold"> Attorney.</span>
                  </p>
                </StaggerItem>

                {/* Trust signals — mirroring the hero section's style */}
                <StaggerItem>
                  <div className="flex flex-wrap justify-center gap-4 mb-7 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      No Recovery, No Fee*
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      Available 24/7
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      Free Consultation
                    </span>
                  </div>
                </StaggerItem>

                {/* Primary CTA — same orange as every other button on the landing */}
                {/* <StaggerItem>
                  <div className="flex justify-center">
                    <TwoStepLeadModal
                      trigger={
                        <Button
                          size="lg"
                          className="text-white font-bold px-8 py-3 shadow-lg hover:opacity-90
                                     transition-all duration-300 text-base"
                          style={{ backgroundColor: "#e06e00" }}
                        >
                          Connect with an attorney - free
                        </Button>
                      }
                      source="territory-available-card"
                      city={city}
                      state={state}
                    />
                  </div>
                </StaggerItem> */}

              </StaggerContainer>
            </div>

            {/* ── Bottom strip for attorney upsell ── */}
            <div
              className="px-6 py-4 border-t border-amber-100 flex flex-col sm:flex-row
                         items-center justify-between gap-3"
              style={{ backgroundColor: "#fffbeb" }}
            >
              <p className="text-sm text-gray-500 text-center sm:text-left">
                One attorney. One city.{" "}
                <span className="font-semibold text-gray-700">Unlimited potential</span>
              </p>
              <a
                href="http://leads.lawproactive.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap
                           transition-colors duration-200 hover:opacity-80"
                style={{ color: "#0B6B65" }}
              >
                Claim it before someone else does
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>
    </FadeIn>
  )
}
