"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, X } from "lucide-react"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"

interface StickyFooterCTAProps {
  city: string
  state?: string
}

export function StickyFooterCTA({ city, state }: StickyFooterCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky footer after minimal scroll
      setIsVisible(window.scrollY > 5)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Listen for modal open/close events from ANY TwoStepLeadModal on the page
  useEffect(() => {
    const handleModalOpen = () => {
      setIsModalOpen(true)
    }

    const handleModalClose = () => {
      setIsModalOpen(false)
    }

    window.addEventListener("leadModalOpen", handleModalOpen)
    window.addEventListener("leadModalClose", handleModalClose)

    return () => {
      window.removeEventListener("leadModalOpen", handleModalOpen)
      window.removeEventListener("leadModalClose", handleModalClose)
    }
  }, [])

  // Get phone number from environment or use default
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+1-800-123-4567"

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    // This is still used for the modal inside the banner
    setIsModalOpen(open)
  }

  // Hide banner if dismissed OR if modal is open
  if (!isVisible || isDismissed || isModalOpen) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full text-white p-4 shadow-lg border-t-4"
      style={{
        backgroundColor: '#0B6B65',
        borderTopColor: '#e06e00',
        zIndex: 9999,
        position: 'fixed'
      }}
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-white/80 hover:text-white" />
      </button>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-lg">Take the First Step Toward Financial Recovery.</p>
          <p className="text-white/80 text-sm">Free consultation • No win, no fee • Available 24/7</p>
        </div>
        <div className="flex gap-3">
          {/* <a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}>
            <Button
              className="text-white font-bold transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: '#0B6B65', borderColor: '#0B6B65' }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </a> */}
          <TwoStepLeadModal
            trigger={
              <Button
                className="text-white font-bold transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: '#e06e00', borderColor: '#e06e00' }}
              >
                Get My Free Case Review
              </Button>
            }
            source="sticky-footer"
            city={city}
            state={state}
            onOpenChange={handleModalOpenChange}
          />
        </div>
      </div>
    </div>
  )
}
