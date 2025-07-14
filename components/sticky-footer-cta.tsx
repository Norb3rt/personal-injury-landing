"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

interface StickyFooterCTAProps {
  city: string
}

export function StickyFooterCTA({ city }: StickyFooterCTAProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky footer after scrolling 500px
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToForm = () => {
    const formElement = document.querySelector("[data-hero-form]")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white p-4 shadow-lg z-50 border-t-4 border-yellow-400">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-lg">Take the First Step Toward Financial Recovery.</p>
          <p className="text-blue-200 text-sm">Free consultation • No win, no fee • Available 24/7</p>
        </div>
        <div className="flex gap-3">
          <a href="tel:5551234567">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </a>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold" onClick={scrollToForm}>
            Get My Free Case Review
          </Button>
        </div>
      </div>
    </div>
  )
}
