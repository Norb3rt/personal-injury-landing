import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Page Not Found | Personal Injury Lawyers",
    description: "The page you're looking for doesn't exist. Find a personal injury lawyer in your area.",
    robots: {
        index: false,
        follow: true,
    },
}

export default function NotFound() {
    // Featured locations for quick navigation
    const featuredLocations = [
        { state: "California", city: "Los Angeles", slug: "/personal-injury-lawyer/california/los-angeles" },
        { state: "Texas", city: "Houston", slug: "/personal-injury-lawyer/texas/houston" },
        { state: "Florida", city: "Miami", slug: "/personal-injury-lawyer/florida/miami" },
        { state: "Arizona", city: "Phoenix", slug: "/personal-injury-lawyer/arizona/phoenix" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex items-center justify-center px-4 py-12">
            <Card className="max-w-3xl w-full shadow-2xl border-0 overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#0B6B65] to-[#0a5a55] text-white py-8 px-8 text-center">
                    <div className="text-7xl mb-4">⚖️</div>
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-xl text-teal-100">Page Not Found</p>
                </div>

                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">
                            Oops! This page doesn&apos;t exist.
                        </h2>
                        <p className="text-lg text-slate-600">
                            The page you&apos;re looking for may have been moved, deleted, or never existed.
                            Let us help you find what you need.
                        </p>
                    </div>

                    {/* Helpful suggestions */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-8">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Search className="h-5 w-5 text-teal-600" />
                            Looking for a Personal Injury Lawyer?
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Browse our network of experienced attorneys in these popular locations:
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {featuredLocations.map((location) => (
                                <Link
                                    key={location.slug}
                                    href={location.slug}
                                    className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md hover:bg-teal-50 transition-all duration-300 group"
                                >
                                    <MapPin className="h-5 w-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium text-slate-800 text-sm">{location.city}</span>
                                    <span className="text-xs text-slate-500">{location.state}</span>
                                </Link>
                            ))}
                        </div>
                    </div>                    {/* Action Button */}
                    <div>
                        <Link href="/" className="block">
                            <Button
                                size="lg"
                                className="w-full text-white hover:opacity-90 text-lg py-6"
                                style={{ backgroundColor: '#0B6B65' }}
                            >
                                <Home className="h-5 w-5 mr-2" />
                                Go to Home Page
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* Footer note */}
                    <div className="mt-8 pt-6 border-t text-center">
                        <p className="text-sm text-slate-500">
                            Need immediate legal assistance? Our network of attorneys is available 24/7.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
