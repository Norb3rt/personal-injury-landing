"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MapPin } from "lucide-react"

// Fix for default marker icon in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

interface StateData {
    name: string
    slug: string
    lat: number
    lng: number
}

interface NationwideMapProps {
    activeStates?: StateData[]
}

// Default states if none provided (fallback)
const defaultStates: StateData[] = [
    { name: "California", slug: "california", lat: 36.7783, lng: -119.4179 },
    { name: "Texas", slug: "texas", lat: 31.9686, lng: -99.9018 },
    { name: "Florida", slug: "florida", lat: 27.6648, lng: -81.5158 },
    { name: "New York", slug: "new-york", lat: 40.7128, lng: -74.0060 },
    { name: "Illinois", slug: "illinois", lat: 40.6331, lng: -89.3985 },
    { name: "Pennsylvania", slug: "pennsylvania", lat: 41.2033, lng: -77.1945 },
    { name: "Ohio", slug: "ohio", lat: 40.4173, lng: -82.9071 },
    { name: "Georgia", slug: "georgia", lat: 32.1656, lng: -82.9001 },
    { name: "North Carolina", slug: "north-carolina", lat: 35.7596, lng: -79.0193 },
    { name: "Michigan", slug: "michigan", lat: 44.3148, lng: -85.6024 },
]

function MapController({ bounds }: { bounds: L.LatLngBoundsExpression }) {
    const map = useMap()
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [map, bounds])
    return null
}

export default function NationwideMap({ activeStates = defaultStates }: NationwideMapProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="h-[500px] w-full bg-slate-100 rounded-xl flex items-center justify-center animate-pulse border border-slate-200">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-medium">Loading Map...</p>
                </div>
            </div>
        )
    }

    // Calculate bounds to fit all markers
    const bounds = L.latLngBounds(activeStates.map(s => [s.lat, s.lng]))

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-2xl border border-gray-200 relative" style={{ zIndex: 1 }}>
            <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <MapController bounds={bounds} />

                {activeStates.map((state) => (
                    <Marker
                        key={state.slug}
                        position={[state.lat, state.lng]}
                        icon={customIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-800">
                                    <MapPin className="h-4 w-4 text-teal-600" />
                                    {state.name}
                                </h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    We have attorneys available in {state.name}.
                                </p>

                                <div className="space-y-2">
                                    {/* <Link href={`/personal-injury-lawyer/${state.slug}`} className="w-full block">
                                        <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs">
                                            View State Page
                                        </Button>
                                    </Link> */}

                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-[10px] font-semibold text-gray-400 mb-1 uppercase tracking-wider">Find Your City</p>
                                        <CitySearchInput stateSlug={state.slug} />
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

function CitySearchInput({ stateSlug }: { stateSlug: string }) {
    const [city, setCity] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (city.trim()) {
            // Simple slugify: lowercase and replace spaces with hyphens
            const citySlug = city.toLowerCase().trim().replace(/\s+/g, '-')
            router.push(`/personal-injury-lawyer/${stateSlug}/${citySlug}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="flex gap-1">
            <Input
                placeholder="City name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-7 text-xs px-2"
            />
            <Button type="submit" size="icon" className="h-7 w-7 bg-slate-800 hover:bg-slate-700">
                <ArrowRight className="h-3 w-3" />
            </Button>
        </form>
    )
}
