import type { Metadata } from "next"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    state: string
    city: string
  }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { state, city } = await params
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'
  const canonicalUrl = `${baseUrl}/personal-injury-lawyer/${state}/${city}`

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default function Layout({ children }: LayoutProps) {
  return children
}
