import { NextRequest, NextResponse } from 'next/server'
import { fetchGoogleNewsRSS, generateFallbackNews, NewsItem } from '@/lib/news'

// Simple in-memory cache
const newsCache = new Map<string, { data: NewsItem[]; timestamp: number }>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    if (!city || !state) {
        return NextResponse.json(
            { error: 'City and state parameters are required' },
            { status: 400 }
        )
    }

    const cacheKey = `${city.toLowerCase()}-${state.toLowerCase()}`

    // Check cache
    const cached = newsCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return NextResponse.json({
            news: cached.data,
            cached: true,
            city,
            state
        })
    }

    // Fetch fresh news
    let news = await fetchGoogleNewsRSS(city, state)

    // If no news found, use fallback for SEO purposes
    const useFallback = news.length === 0
    if (useFallback) {
        news = generateFallbackNews(city, state)
    }

    // Update cache
    newsCache.set(cacheKey, { data: news, timestamp: Date.now() })

    return NextResponse.json({
        news,
        cached: false,
        fallback: useFallback,
        city,
        state
    })
}
