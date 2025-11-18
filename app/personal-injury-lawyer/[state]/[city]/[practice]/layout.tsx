import type { Metadata } from "next"

interface LayoutProps {
  children: React.ReactNode
  params: {
    state: string
    city: string
    practice: string
  }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'
  const canonicalUrl = `${baseUrl}/personal-injury-lawyer/${params.state}/${params.city}/${params.practice}`

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default function Layout({ children }: LayoutProps) {
  return children
}
