import { verifyAdminAuth } from "./actions"
import { getRawPageConfig } from "@/lib/page-content"
import { StateDataLoader } from "@/lib/data/state-loader"
import AdminSeoForm from "./form"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    state?: string
    city?: string
    level?: string
  }>
}

export default async function AdminSeoPage({ searchParams }: PageProps) {
  // 1. Verify admin session
  const adminUser = await verifyAdminAuth()

  // 2. Resolve selected scope params from search query
  const params = await searchParams
  const state = params.state || null
  const city = params.city || null
  const level = params.level || null

  // 3. Load raw configuration document (Homepage, Template default, State override, or City override)
  let currentConfig = {}
  if (adminUser) {
    if (level === "homepage") {
      currentConfig = await getRawPageConfig(null, null, "homepage")
    } else if (state) {
      currentConfig = await getRawPageConfig(state, city)
    } else {
      currentConfig = await getRawPageConfig(null, null, "default")
    }
  }

  // 4. Gather all processed locations for the admin selectors
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
    console.error("Failed to load locations for admin selector:", err)
  }

  return (
    <AdminSeoForm
      adminUser={adminUser}
      currentConfig={currentConfig}
      allLocations={allLocations}
    />
  )
}
