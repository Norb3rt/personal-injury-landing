import { verifyAdminAuth, getPracticeAreasDynamicList } from "./actions"
import { getRawPageConfig } from "@/lib/page-content"
import { StateDataLoader } from "@/lib/data/state-loader"
import AdminPracticeAreasForm from "./form"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    practice?: string
    state?: string
    city?: string
    level?: string
    mode?: string
  }>
}

export default async function AdminPracticeAreasPage({ searchParams }: PageProps) {
  // 1. Verify admin session
  const adminUser = await verifyAdminAuth()

  // 2. Resolve selected params from query
  const params = await searchParams
  const practiceAreas = await getPracticeAreasDynamicList()
  const defaultPractice = practiceAreas[0]?.slug || "car-accident"

  const practice = params.practice || defaultPractice
  const state = params.state || null
  const city = params.city || null
  const level = params.level || "template" // "template" | "state" | "city"
  const mode = params.mode || "content" // "content" | "meta"

  // 3. Load raw configuration document for chosen practice / location
  let currentConfig = {}
  if (adminUser) {
    if (level === "template") {
      currentConfig = await getRawPageConfig(null, null, practice)
    } else if (state) {
      currentConfig = await getRawPageConfig(state, city, practice)
    } else {
      currentConfig = await getRawPageConfig(null, null, practice)
    }
  }

  // 4. Gather all processed locations for dynamic state & city selectors
  let allLocations: any[] = []
  try {
    const locations = await StateDataLoader.getAllProcessedLocations()
    allLocations = locations.map((loc) => ({
      stateSlug: loc.stateSlug,
      citySlug: loc.citySlug,
      stateName: loc.state,
      cityName: loc.city,
    }))
  } catch (err) {
    console.error("Failed to load locations for practice admin selector:", err)
  }

  return (
    <AdminPracticeAreasForm
      adminUser={adminUser}
      currentConfig={currentConfig}
      allLocations={allLocations}
      practiceAreas={practiceAreas}
    />
  )
}
