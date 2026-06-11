export interface NewsItem {
    title: string
    source: string
    publishedAt: string
    link: string
    snippet?: string
}

/**
 * Extract content from XML tag
 */
function extractTag(xml: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
    const match = xml.match(regex)
    return match ? (match[1] || match[2] || '').trim() : null
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<[^>]*>/g, '') // Remove any HTML tags
}

/**
 * Format date as relative time
 */
function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Generate fallback news based on city/state for SEO purposes
 */
export function generateFallbackNews(city: string, state: string): NewsItem[] {
    const templates = [
        {
            title: `Traffic Safety Alert: ${city} Police Department Urges Caution`,
            source: `${city} PD`,
            type: 'safety'
        },
        {
            title: `${state} DOT Reports Increase in Highway Incidents`,
            source: `${state} DOT`,
            type: 'report'
        },
        {
            title: `Local Attorneys Discuss Rising Personal Injury Cases in ${city}`,
            source: 'Legal News',
            type: 'legal'
        },
        {
            title: `${city} Residents Advised to Drive Safely During Peak Hours`,
            source: 'Community Alert',
            type: 'advisory'
        }
    ]

    return templates.map((t, i) => ({
        title: t.title,
        source: t.source,
        publishedAt: `${i + 1} day${i > 0 ? 's' : ''} ago`,
        link: '#',
        snippet: undefined
    }))
}

/**
 * Parse Google News RSS feed
 */
export async function fetchGoogleNewsRSS(city: string, state: string): Promise<NewsItem[]> {
    const query = `car accident OR traffic crash OR vehicle collision "${city}" "${state}"`
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`

    try {
        const response = await fetch(rssUrl, {
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!response.ok) {
            console.error('Google News RSS fetch failed:', response.status)
            return []
        }

        const xmlText = await response.text()

        // Parse XML manually (lightweight, no external dependencies)
        const items: NewsItem[] = []
        const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || []

        for (const itemXml of itemMatches.slice(0, 6)) { // Limit to 6 items
            const title = extractTag(itemXml, 'title')
            const link = extractTag(itemXml, 'link')
            const pubDate = extractTag(itemXml, 'pubDate')
            const source = extractTag(itemXml, 'source')

            if (title && link) {
                items.push({
                    title: decodeHtmlEntities(title),
                    source: source || 'News',
                    publishedAt: pubDate ? formatRelativeTime(new Date(pubDate)) : 'Recently',
                    link,
                    snippet: undefined
                })
            }
        }

        return items
    } catch (error) {
        console.error('Error fetching Google News:', error)
        return []
    }
}
