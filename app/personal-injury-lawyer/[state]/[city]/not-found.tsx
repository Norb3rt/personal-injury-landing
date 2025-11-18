import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, MapPin } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🏛️</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Location Not Found
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              We couldn&apos;t find a personal injury lawyer page for this location.
              This might be because:
            </p>

            <div className="text-left space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
                <p className="text-slate-600">The city or state name might be misspelled</p>
              </div>
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-teal-600 mt-0.5" />
                <p className="text-slate-600">We haven&apos;t added this location to our service area yet</p>
              </div>
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-teal-600 mt-0.5" />
                <p className="text-slate-600">The URL format might be incorrect</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/">
              <Button size="lg" className="w-full text-white hover:opacity-90" style={{ backgroundColor: '#0B6B65' }}>
                <Home className="h-5 w-5 mr-2" />
                Return to Home Page
              </Button>
            </Link>

            <Link href="/personal-injury-lawyer/california/los-angeles">
              <Button size="lg" variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white">
                <MapPin className="h-5 w-5 mr-2" />
                View Los Angeles Example
              </Button>
            </Link>

            {/* Agregar sugerencias de ciudades cercanas */}
            <div className="mt-6">
              <p className="text-sm text-slate-600 mb-3">Popular locations we serve:</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/personal-injury-lawyer/california/san-francisco" className="text-teal-600 hover:underline text-sm">
                  San Francisco, CA
                </Link>
                <Link href="/personal-injury-lawyer/california/san-diego" className="text-teal-600 hover:underline text-sm">
                  San Diego, CA
                </Link>
                <Link href="/personal-injury-lawyer/texas/houston" className="text-teal-600 hover:underline text-sm">
                  Houston, TX
                </Link>
                <Link href="/personal-injury-lawyer/florida/miami" className="text-teal-600 hover:underline text-sm">
                  Miami, FL
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              <strong>Need help with a personal injury case?</strong><br />
              Call us at <span className="font-semibold" style={{ color: '#0B6B65' }}>(213) 394-5864 </span>
              and we&apos;ll connect you with a qualified attorney in your area.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
