"use client"

import { useState } from "react"
import { Shield, MapPin, FileText, ChevronDown } from "lucide-react"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations"
import { cn } from "@/lib/utils"

export interface LawyerPublicProfile {
  name: string | null
  location: string | null
  barNumber: string | null
  streetAddress?: string | null
  suiteUnit?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
}

interface LawyerTerritoryCardProps {
  lawyer: LawyerPublicProfile
  city: string
  state: string
}

export function LawyerTerritoryCard({ lawyer, city, state }: LawyerTerritoryCardProps) {
  const [isOpen, setIsOpen] = useState(false)

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
              Exclusive Territory Responsible Attorney — {city}, {state}
            </span>
          </div>

          {/* ── Card ── */}
          <div
            className="bg-white rounded-2xl shadow-lg border
                       transition-all duration-300 hover:shadow-xl"
            style={{ borderColor: "#b2dbd8" }}
          >
            <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
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
              {(lawyer.streetAddress || lawyer.city || lawyer.state || lawyer.zipCode) ? (
                <div className="flex items-start justify-center sm:justify-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#0B6B65" }} />
                  <span className="text-sm text-gray-600 leading-snug">
                    {lawyer.streetAddress}
                    {lawyer.suiteUnit && `, ${lawyer.suiteUnit}`}
                    <br />
                    {lawyer.city && `${lawyer.city}, `}
                    {lawyer.state} {lawyer.zipCode}
                  </span>
                </div>
              ) : lawyer.location ? (
                <div className="flex items-start justify-center sm:justify-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#0B6B65" }} />
                  <span className="text-sm text-gray-600 leading-snug">{lawyer.location}</span>
                </div>
              ) : null}
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

          {/* Disclaimer & Disclosure Section */}
            <div className="px-6 py-4 bg-gray-50 border-t rounded-b-2xl text-xs text-gray-500 space-y-2">
              <p className="leading-relaxed font-medium text-gray-600 text-center sm:text-left">
                This advertisement is paid for and the sole responsibility of the above attorney/firm.
              </p>
              
              <div className="flex justify-center sm:justify-start">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center gap-1 font-semibold hover:opacity-85 transition-opacity focus:outline-none"
                  style={{ color: "#0B6B65" }}
                >
                  <span>{isOpen ? "Hide full disclosures" : "View full disclosures"}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>
              </div>

              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out text-gray-500 leading-relaxed text-[11px] text-center sm:text-left",
                  isOpen ? "max-h-[500px] opacity-100 mt-2 border-t pt-2 border-gray-200" : "max-h-0 opacity-0 pointer-events-none"
                )}
              >
                This is an advertisement. LawProactive is not a law firm and does not provide legal services or referrals. No attorney-client relationship is formed by contacting us or viewing this page. Results are not guaranteed. All cases are handled directly by the responsible attorney shown above. For license verification, visit the State Bar of California. Prior results do not guarantee a similar outcome. This communication is not a substitute for legal advice.
              </div>
            </div>
          </div>

        </div>
      </section>
    </FadeIn>
  )
}
