"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { TwoStepLeadModal } from "@/components/two-step-lead-modal"

interface NewsItem {
    title: string
    source: string
    publishedAt: string
    link: string
}

interface LocalNewsProps {
    city: string
    state: string
    citySlug: string
    stateSlug: string
    initialNews?: NewsItem[]
    initialIsFallback?: boolean
}

export function LocalNews({ city, state, citySlug, stateSlug, initialNews, initialIsFallback }: LocalNewsProps) {
    const [news, setNews] = useState<NewsItem[]>(initialNews || [])
    const [loading, setLoading] = useState(!initialNews)
    const [error, setError] = useState(false)
    const [isFallback, setIsFallback] = useState(initialIsFallback || false)

    useEffect(() => {
        if (initialNews) {
            return // Use preloaded server-side news, do not fetch on client
        }
        const fetchNews = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/news?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`)

                if (!response.ok) throw new Error('Failed to fetch news')

                const data = await response.json()
                setNews(data.news || [])
                setIsFallback(data.fallback || false)
                setError(false)
            } catch (err) {
                console.error('Error fetching news:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchNews()
    }, [city, state])

    if (loading) {
        return (
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin" />
                        <p className="text-gray-500 mt-4">Loading local news...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (error || news.length === 0) {
        return null // Don't show section if no news available
    }

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <FadeIn direction="up" delay={0.1}>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <Newspaper className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Recent Accidents Near {city}
                            </h2>
                        </div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Stay informed about road safety incidents in {city}, {state}.
                            {!isFallback && " Real-time news from local sources."}
                        </p>
                    </div>
                </FadeIn>

                <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-2 gap-4 mb-8">
                    {news.slice(0, 4).map((item, index) => (
                        <StaggerItem key={index}>
                            <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 to-white group">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                            <AlertCircle className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">
                                                    {item.source} • {item.publishedAt}
                                                </span>
                                                {item.link !== '#' && (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                <FadeIn direction="up" delay={0.4}>
                    <div className="text-center bg-gradient-to-r from-red-50 via-orange-50 to-red-50 rounded-xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Were You Involved in an Accident?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                            If you or a loved one was injured in a {city} accident, you may be entitled to compensation.
                            Get a free case review today.
                        </p>
                        <TwoStepLeadModal
                            trigger={
                                <Button
                                    size="lg"
                                    className="text-white font-bold px-8 shadow-lg hover:opacity-90"
                                    style={{ backgroundColor: '#e06e00' }}
                                >
                                    Get A Free Case Review
                                </Button>
                            }
                            source="local-news"
                            city={city}
                            state={state}
                        />
                    </div>
                </FadeIn>

                {isFallback && (
                    <p className="text-xs text-gray-400 text-center mt-6">
                        News shown represents typical incidents in the area. For current news, visit local news sources.
                    </p>
                )}
            </div>
        </section>
    )
}
