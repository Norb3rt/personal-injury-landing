"use client"

import { Shield, MapPin, FileText } from "lucide-react"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations"

export interface LawyerPublicProfile {
  name: string | null
  location: string | null
  barNumber: string | null
}

interface LawyerTerritoryCardProps {
  lawyer: LawyerPublicProfile
  city: string
  state: string
}

export function LawyerTerritoryCard({ lawyer, city, state }: LawyerTerritoryCardProps) {
  // Generate avatar initials from the lawyer's name
  const initials = (lawyer.name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("") || "⚖️"

  return (
    <FadeIn direction="up" delay={0.1}>
      {/* Matches the teal/green palette: same #0B6B65 as the hero and CTAs */}
      <section className="py-8 px-4" style={{ backgroundColor: "#f0fafa" }}>
        <div className="max-w-3xl mx-auto">

          {/* ── Badge ── */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-semibold
                         border shadow-sm"
              style={{
                backgroundColor: "#e6f4f3",
                borderColor: "#0B6B65",
                color: "#0B6B65",
              }}
            >
              <Shield className="h-4 w-4" />
              Exclusive Territory Attorney — {city}, {state}
            </span>
          </div>

          {/* ── Card ── */}
          <div
            className="bg-white rounded-2xl shadow-lg border p-6
                       flex flex-col sm:flex-row items-center sm:items-start gap-6
                       transition-all duration-300 hover:shadow-xl"
            style={{ borderColor: "#b2dbd8" }}
          >
            {/* Avatar */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center
                         text-white text-xl font-bold shadow-md select-none"
              style={{ backgroundColor: "#0B6B65" }}
            >
              {initials}
            </div>

            {/* Info block */}
            <div className="flex-1 min-w-0 text-center sm:text-left space-y-2.5">
              {/* Name */}
              {lawyer.name && (
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {lawyer.name}
                </h2>
              )}

              {/* Bar Number */}
              {lawyer.barNumber && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <FileText className="h-4 w-4 flex-shrink-0" style={{ color: "#0B6B65" }} />
                  <span className="text-sm text-gray-600">
                    Bar No.{" "}
                    <span className="font-semibold text-gray-800">{lawyer.barNumber}</span>
                  </span>
                </div>
              )}

              {/* Address / Location */}
              {lawyer.location && (
                <div className="flex items-start justify-center sm:justify-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#0B6B65" }} />
                  <span className="text-sm text-gray-600 leading-snug">{lawyer.location}</span>
                </div>
              )}
            </div>

            {/* CTA — same orange #e06e00 as every other button on the landing */}
            <div className="flex-shrink-0 self-center sm:self-start">
              <TwoStepLeadModal
                trigger={
                  <Button
                    className="text-white font-bold px-5 py-2.5 shadow-md hover:opacity-90
                               transition-all duration-300 whitespace-nowrap"
                    style={{ backgroundColor: "#e06e00" }}
                  >
                    Get Free Review
                  </Button>
                }
                source="lawyer-territory-card"
                city={city}
                state={state}
              />
            </div>
          </div>

        </div>
      </section>
    </FadeIn>
  )
}
