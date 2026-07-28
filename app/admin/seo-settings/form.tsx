"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { loginAdmin, logoutAdmin, updatePageContentConfig, resetPageContentConfig } from "./actions"
import { Shield, LayoutDashboard, Globe, Briefcase, LogOut, Loader2, Save, FileText, CheckCircle2, AlertCircle } from "lucide-react"

// Types
interface LocationItem {
  stateSlug: string
  citySlug: string
  stateName: string
  cityName: string
}

interface FormProps {
  adminUser: { id: string; email: string } | null
  currentConfig: any
  allLocations: LocationItem[]
}

export default function AdminSeoForm({ adminUser, currentConfig, allLocations }: FormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Auth States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  // Active Tab
  const [activeTab, setActiveTab] = useState("hero")

  // Selected Location params from URL
  const currentState = searchParams.get("state") || ""
  const currentCity = searchParams.get("city") || ""
  const currentLevel = searchParams.get("level") || ""
  
  // Resolve edit mode level (homepage template vs global template vs state override vs city override)
  const initialLevel = currentLevel === "homepage" ? "homepage" : (currentCity ? "city" : (currentState ? "state" : "global"))
  const [editLevel, setEditLevel] = useState<"homepage" | "global" | "state" | "city">(initialLevel as any)
  const [selectedState, setSelectedState] = useState(currentState)
  const [selectedCity, setSelectedCity] = useState(currentCity)

  // Sync state with URL params changes
  useEffect(() => {
    const level = currentLevel === "homepage" ? "homepage" : (currentCity ? "city" : (currentState ? "state" : "global"))
    setEditLevel(level as any)
    setSelectedState(currentState)
    setSelectedCity(currentCity)
  }, [currentState, currentCity, currentLevel])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const res = await loginAdmin(formData)
    if (res.success) {
      router.refresh()
    } else {
      setAuthError(res.error || "Failed to log in.")
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    router.refresh()
  }

  // Filter unique states from the dynamic locations array
  const uniqueStates = Array.from(
    new Map<string, { slug: string; name: string }>(
      allLocations.map((loc) => [
        loc.stateSlug,
        { slug: loc.stateSlug, name: loc.stateName }
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name))

  // Filter cities belonging only to the currently selected state
  const filteredCities = allLocations
    .filter((loc) => loc.stateSlug === selectedState)
    .sort((a, b) => a.cityName.localeCompare(b.cityName))

  // Navigation update helper based on chosen selections
  const updateNavigation = (level: "homepage" | "global" | "state" | "city", stateVal: string, cityVal: string) => {
    if (level === "homepage") {
      router.push("/admin/seo-settings?level=homepage")
    } else if (level === "global") {
      router.push("/admin/seo-settings?level=global")
    } else if (level === "state") {
      const activeState = stateVal || (uniqueStates[0]?.slug || "")
      router.push(`/admin/seo-settings?state=${activeState}`)
    } else if (level === "city") {
      const activeState = stateVal || (uniqueStates[0]?.slug || "")
      // Find the first city slug for that state as default
      const defaultCityItem = allLocations.find(l => l.stateSlug === activeState)
      const activeCity = cityVal || (defaultCityItem?.citySlug || "")
      router.push(`/admin/seo-settings?state=${activeState}&city=${activeCity}`)
    }
  }

  const handleLevelChange = (newLevel: "homepage" | "global" | "state" | "city") => {
    setEditLevel(newLevel)
    updateNavigation(newLevel, selectedState, newLevel === "city" ? selectedCity : "")
  }

  const handleStateChange = (stateSlug: string) => {
    setSelectedState(stateSlug)
    // When state changes in city override mode, select the first city in that state
    const firstCityInState = allLocations.find(loc => loc.stateSlug === stateSlug)?.citySlug || ""
    setSelectedCity(firstCityInState)
    updateNavigation(editLevel, stateSlug, editLevel === "city" ? firstCityInState : "")
  }

  const handleCityChange = (citySlug: string) => {
    setSelectedCity(citySlug)
    updateNavigation(editLevel, selectedState, citySlug)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setToastMsg(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await updatePageContentConfig(
        editLevel === "global" || editLevel === "homepage",
        editLevel !== "global" && editLevel !== "homepage" ? selectedState : null,
        editLevel === "city" ? selectedCity : null,
        editLevel === "homepage" ? "homepage" : null,
        formData
      )

      if (res.success) {
        setToastMsg({ type: "success", text: "Configuration saved successfully!" })
        router.refresh()
        setTimeout(() => setToastMsg(null), 4000)
      } else {
        setToastMsg({ type: "error", text: res.error || "Failed to save configuration." })
      }
    })
  }

  // Auth Screen
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <Card className="w-full max-w-md border-teal-500/20 bg-slate-900/80 backdrop-blur-md shadow-2xl relative">
          <CardContent className="pt-8 px-6 pb-8">
            <div className="flex flex-col items-center mb-6">
              <div className="p-3 bg-teal-500/10 rounded-full border border-teal-500/20 mb-4">
                <Shield className="h-8 w-8 text-teal-400" />
              </div>
              <h1 className="text-2xl font-bold text-white text-center">LawProactive Admin</h1>
              <p className="text-slate-400 text-sm text-center mt-1">Sign in with your Supabase account to manage SEO configurations</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@lawproactive.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-teal-500"
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
              >
                Sign In to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Text title representation for selected target
  const activeLocationTitle = editLevel === "homepage"
    ? "Root Homepage (/)"
    : editLevel === "global"
      ? "Global Default City Template"
      : editLevel === "state"
        ? `State Override: ${uniqueStates.find(s => s.slug === selectedState)?.name || selectedState}`
        : `City Override: ${allLocations.find(l => l.stateSlug === selectedState && l.citySlug === selectedCity)?.cityName || selectedCity}, ${uniqueStates.find(s => s.slug === selectedState)?.name || selectedState}`

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-teal-400" />
            <span className="font-bold text-lg tracking-wider text-white">LAWPROACTIVE</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Navigation</p>
            <Link
              href="/admin/seo-settings"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-teal-500/10 text-teal-400 font-medium transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm">City Pages</span>
            </Link>
            <Link
              href="/admin/practice-areas"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-sm font-medium">Practice Areas</span>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30 text-teal-400 text-xs font-bold uppercase">
              {adminUser.email.substring(0, 2)}
            </div>
            <div className="truncate flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate">{adminUser.email}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white font-sans">City Pages CMS Editor</h2>
            <p className="text-slate-400 text-sm mt-1">Configure global default templates, state level overrides, or city-specific pages</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/practice-areas"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              <Briefcase className="h-4 w-4 text-teal-400" />
              <span>Practice Areas CMS</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors md:hidden text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Toast Alerts */}
        {toastMsg && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              toastMsg.type === "success"
                ? "bg-teal-950/80 border-teal-500/30 text-teal-300"
                : "bg-red-950/80 border-red-500/30 text-red-300"
            } shadow-lg backdrop-blur-sm`}
          >
            {toastMsg.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="font-medium text-sm">{toastMsg.text}</span>
          </div>
        )}

        {/* Configuration Target Selector (Optimized performance layout) */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Edit Target level Selector */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm font-semibold">1. Edit Target Type</Label>
              <select
                value={editLevel}
                onChange={(e) => handleLevelChange(e.target.value as any)}
                className="w-full block bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:border-teal-500 focus:outline-none"
              >
                <option value="homepage">🏠 Root Homepage (landing page /)</option>
                <option value="global">🏙️ Default City Template (All Cities Fallback)</option>
                <option value="state">🏢 State Override (All Cities in State)</option>
                <option value="city">📍 City Override (Specific City)</option>
              </select>
            </div>

            {/* 2. Select State Selector */}
            {editLevel !== "global" && editLevel !== "homepage" && (
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">2. Select State</Label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full block bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:border-teal-500 focus:outline-none"
                >
                  {uniqueStates.map((state) => (
                    <option key={state.slug} value={state.slug}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 3. Select City Selector (Only shown in city override mode, filters dynamically) */}
            {editLevel === "city" && (
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">3. Select City</Label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full block bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:border-teal-500 focus:outline-none"
                >
                  {filteredCities.map((city) => (
                    <option key={city.citySlug} value={city.citySlug}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800/60">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Target Scope</span>
            <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-400 px-3 py-1.5 text-sm font-medium">
              {activeLocationTitle}
            </Badge>
          </div>
        </div>

        {/* Dynamic Landing Page Form */}
        <form key={JSON.stringify(currentConfig)} onSubmit={handleSave} className="space-y-8">
          {/* Tab buttons */}
          <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
            {[
              { id: "hero", label: "SEO & Hero" },
              { id: "services", label: "Services" },
              { id: "painPoints", label: "Pain Points" },
              { id: "valueProp", label: "Value Prop" },
              { id: "howItWorks", label: "Process Steps" },
              { id: "testimonials", label: "Reviews" },
              { id: "faq", label: "FAQs" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-all duration-200 border-t border-x whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-slate-900 border-slate-800 text-teal-400 border-b-2 border-b-teal-500"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* TAB: SEO & HERO */}
              <div className={activeTab === "hero" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span>SEO Metadata Settings</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      You can write custom static text or insert <code className="text-teal-400 font-mono">{"{city}"}</code> and <code className="text-teal-400 font-mono">{"{state}"}</code> placeholders to keep it dynamically localized.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Meta Title Tag</Label>
                      <Input
                        name="seo.metaTitle"
                        defaultValue={currentConfig.seo?.metaTitle || ""}
                        placeholder="{city} Personal Injury Lawyer | {state} | Free Case Review"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Meta Description Tag</Label>
                      <Textarea
                        name="seo.metaDescription"
                        defaultValue={currentConfig.seo?.metaDescription || ""}
                        placeholder="Injured in {city}? Contact our experienced personal injury attorneys today..."
                        className="bg-slate-950 border-slate-800 text-white min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="border-b border-slate-800 pb-4 mb-4 pt-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>Hero Section Configuration</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">H1 Principal Heading</Label>
                      <Input
                        name="hero.h1"
                        defaultValue={currentConfig.hero?.h1 || ""}
                        placeholder="Injured in {city}?"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Hero Subtitle Paragraph</Label>
                      <Textarea
                        name="hero.subtitle"
                        defaultValue={currentConfig.hero?.subtitle || ""}
                        placeholder="Your search for a personal injury attorney in {city} ends here..."
                        className="bg-slate-950 border-slate-800 text-white min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Primary Call to Action (CTA) Button Text</Label>
                      <Input
                        name="hero.ctaText"
                        defaultValue={currentConfig.hero?.ctaText || ""}
                        placeholder="Get a Free Case Review"
                        className="bg-slate-950 border-slate-800 text-white max-w-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB: SERVICES */}
              <div className={activeTab === "services" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400">Services Layout</h3>
                    <p className="text-xs text-slate-400 mt-1">Configure the main header and the 6 key practice areas displayed on the landing page.</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <Label className="text-slate-300">Services Section Title</Label>
                    <Input
                      name="services.title"
                      defaultValue={currentConfig.services?.title || ""}
                      placeholder="Personal Injury Services in {city}"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => {
                      const item = currentConfig.services?.items?.[i] || {}
                      return (
                        <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                          <span className="text-xs font-semibold text-slate-500">Service Item #{i + 1}</span>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <Label className="text-slate-400 text-xs">Name</Label>
                              <Input
                                name={`services.item.${i}.name`}
                                defaultValue={item.name || ""}
                                placeholder="Car Accidents"
                                className="bg-slate-950 border-slate-800 text-white py-1 text-sm h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-400 text-xs">Emoji Icon</Label>
                              <Input
                                name={`services.item.${i}.icon`}
                                defaultValue={item.icon || ""}
                                placeholder="🚗"
                                className="bg-slate-950 border-slate-800 text-white py-1 text-sm h-8 text-center"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                              <Label className="text-slate-400 text-xs">URL Slug</Label>
                              <Input
                                value={item.slug || ""}
                                disabled
                                className="bg-slate-950/60 border-slate-800 text-slate-500 py-1 text-sm h-8 cursor-not-allowed"
                              />
                              <input type="hidden" name={`services.item.${i}.slug`} value={item.slug || ""} />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-slate-400 text-xs">Brief Description</Label>
                              <Input
                                name={`services.item.${i}.description`}
                                defaultValue={item.description || ""}
                                placeholder="Get compensation for vehicle injuries"
                                className="bg-slate-950 border-slate-800 text-white py-1 text-sm h-8"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* TAB: PAIN POINTS */}
              <div className={activeTab === "painPoints" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400">Pain Points Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Highlighted queries triggering conversion in the red card blocks.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Section Title</Label>
                      <Input
                        name="painPoints.title"
                        defaultValue={currentConfig.painPoints?.title || ""}
                        placeholder="Insurance Companies Hope You'll Settle for Less."
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">CTA Button Text</Label>
                      <Input
                        name="painPoints.ctaText"
                        defaultValue={currentConfig.painPoints?.ctaText || ""}
                        placeholder="Don't Let Them Win - Get Help Now"
                        className="bg-slate-950 border-slate-800 text-white max-w-xs"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <Label className="text-slate-300 font-bold block">Checklist Questions (4 Items)</Label>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <span className="text-xs font-semibold text-slate-500 w-6">#{i+1}</span>
                          <Input
                            name={`painPoints.item.${i}`}
                            defaultValue={currentConfig.painPoints?.items?.[i] || ""}
                            placeholder={`Medical bills stacking up?`}
                            className="bg-slate-950 border-slate-800 text-white flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB: VALUE PROP */}
              <div className={activeTab === "valueProp" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400">Value Proposition & Metrics</h3>
                    <p className="text-xs text-slate-400 mt-1">Green stats block showcasing credentials and assurances.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Section Header</Label>
                        <Input
                          name="valueProp.title"
                          defaultValue={currentConfig.valueProp?.title || ""}
                          placeholder="We Make It Simple to Find the Right Personal Injury Lawyer."
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">CTA Button Text</Label>
                        <Input
                          name="valueProp.ctaText"
                          defaultValue={currentConfig.valueProp?.ctaText || ""}
                          placeholder="Find Out What Your Case is Worth"
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Introduction Paragraph</Label>
                      <Textarea
                        name="valueProp.subtitle"
                        defaultValue={currentConfig.valueProp?.subtitle || ""}
                        placeholder="Connect with personal injury lawyers serving {city}..."
                        className="bg-slate-950 border-slate-800 text-white min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-4 pt-4">
                      <Label className="text-slate-300 font-bold block">Statistics Cards (3 Items)</Label>
                      <div className="grid md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => {
                          const stat = currentConfig.valueProp?.stats?.[i] || {}
                          return (
                            <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                              <span className="text-xs font-semibold text-slate-500">Metric Card #{i + 1}</span>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                  <Label className="text-slate-400 text-xs">Number Value</Label>
                                  <Input
                                    name={`valueProp.stat.${i}.value`}
                                    defaultValue={stat.value !== undefined ? stat.value : ""}
                                    type="number"
                                    placeholder="95"
                                    className="bg-slate-950 border-slate-800 text-white py-1 h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-400 text-xs">Suffix</Label>
                                  <Input
                                    name={`valueProp.stat.${i}.suffix`}
                                    defaultValue={stat.suffix || ""}
                                    placeholder="%"
                                    className="bg-slate-950 border-slate-800 text-white py-1 h-8 text-center"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-slate-400 text-xs">Bold Header text</Label>
                                <Input
                                  name={`valueProp.stat.${i}.label`}
                                  defaultValue={stat.label || ""}
                                  placeholder="Of Injury Cases Settle Out of Court"
                                  className="bg-slate-950 border-slate-800 text-white py-1 h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-slate-400 text-xs">Detailed description</Label>
                                <Textarea
                                  name={`valueProp.stat.${i}.desc`}
                                  defaultValue={stat.desc || ""}
                                  placeholder="Most injury claims are resolved through negotiation."
                                  className="bg-slate-950 border-slate-800 text-white min-h-[60px] text-xs py-1"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB: HOW IT WORKS */}
              <div className={activeTab === "howItWorks" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400">Process Steps</h3>
                    <p className="text-xs text-slate-400 mt-1">Configure step descriptions on how the law matching service works.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Section Title</Label>
                        <Input
                          name="howItWorks.title"
                          defaultValue={currentConfig.howItWorks?.title || ""}
                          placeholder="Only Three Steps to Your Peace of Mind."
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">CTA Button Text</Label>
                        <Input
                          name="howItWorks.ctaText"
                          defaultValue={currentConfig.howItWorks?.ctaText || ""}
                          placeholder="Start Step 1 Now"
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {[...Array(3)].map((_, i) => {
                        const step = currentConfig.howItWorks?.steps?.[i] || {}
                        return (
                          <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                            <span className="text-xs font-semibold text-slate-500">Step #{i + 1}</span>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="col-span-1">
                                <Label className="text-slate-400 text-xs">Step Title</Label>
                                <Input
                                  name={`howItWorks.step.${i}.title`}
                                  defaultValue={step.title || ""}
                                  placeholder="Tell Us About Your Accident"
                                  className="bg-slate-950 border-slate-800 text-white"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-slate-400 text-xs">Step Description</Label>
                                <Input
                                  name={`howItWorks.step.${i}.desc`}
                                  defaultValue={step.desc || ""}
                                  placeholder="Free, no-obligation case evaluation."
                                  className="bg-slate-950 border-slate-800 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB: TESTIMONIALS */}
              <div className={activeTab === "testimonials" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400">Customer Reviews</h3>
                    <p className="text-xs text-slate-400 mt-1">Configure client success stories for social proof.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Section Header</Label>
                        <Input
                          name="testimonials.title"
                          defaultValue={currentConfig.testimonials?.title || ""}
                          placeholder="What People Are Saying"
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">CTA Button Text</Label>
                        <Input
                          name="testimonials.ctaText"
                          defaultValue={currentConfig.testimonials?.ctaText || ""}
                          placeholder="Get Your Success Story Started"
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {[...Array(3)].map((_, i) => {
                        const test = currentConfig.testimonials?.items?.[i] || {}
                        return (
                          <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                            <span className="text-xs font-semibold text-slate-500">Testimonial #{i + 1}</span>
                            <div className="grid md:grid-cols-4 gap-3">
                              <div>
                                <Label className="text-slate-400 text-xs">Author Name</Label>
                                <Input
                                  name={`testimonials.item.${i}.name`}
                                  defaultValue={test.name || ""}
                                  placeholder="Jane D."
                                  className="bg-slate-950 border-slate-800 text-white py-1 h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-slate-400 text-xs">Location</Label>
                                <Input
                                  name={`testimonials.item.${i}.location`}
                                  defaultValue={test.location || ""}
                                  placeholder="{city}, {state}"
                                  className="bg-slate-950 border-slate-800 text-white py-1 h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-slate-400 text-xs">Case Type</Label>
                                <Input
                                  name={`testimonials.item.${i}.case`}
                                  defaultValue={test.case || ""}
                                  placeholder="Car Accident"
                                  className="bg-slate-950 border-slate-800 text-white py-1 h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-slate-400 text-xs">Outcome / Recovery</Label>
                                <Input
                                  name={`testimonials.item.${i}.settlement`}
                                  defaultValue={test.settlement || ""}
                                  placeholder="$120k Recovered"
                                  className="bg-slate-950 border-slate-800 text-white py-1 h-8"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                              <div className="col-span-4">
                                <Label className="text-slate-400 text-xs">Review text / Quote</Label>
                                <Input
                                  name={`testimonials.item.${i}.quote`}
                                  defaultValue={test.quote || ""}
                                  placeholder="This platform made it easy to find a personal injury lawyer..."
                                  className="bg-slate-950 border-slate-800 text-white py-1 h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-slate-400 text-xs">Rating Stars (1-5)</Label>
                                <Input
                                  name={`testimonials.item.${i}.rating`}
                                  defaultValue={test.rating !== undefined ? test.rating : 5}
                                  type="number"
                                  min="1"
                                  max="5"
                                  placeholder="5"
                                  className="bg-slate-950 border-slate-800 text-white py-1 h-8 text-center"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB: FAQs */}
              <div className={activeTab === "faq" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400">Frequently Asked Questions (FAQ)</h3>
                    <p className="text-xs text-slate-400 mt-1">Configure questions and answers showing up at the bottom of the page.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">FAQ Section Title</Label>
                        <Input
                          name="faq.title"
                          defaultValue={currentConfig.faq?.title || ""}
                          placeholder="Frequently Asked Questions"
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">CTA Button Text</Label>
                        <Input
                          name="faq.ctaText"
                          defaultValue={currentConfig.faq?.ctaText || ""}
                          placeholder="Still Have Questions? Get Answers Now"
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {[...Array(5)].map((_, i) => {
                        const f = currentConfig.faq?.items?.[i] || {}
                        return (
                          <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                            <span className="text-xs font-semibold text-slate-500">FAQ Item #{i + 1}</span>
                            <div className="space-y-2">
                              <Label className="text-slate-400 text-xs">Question</Label>
                              <Input
                                name={`faq.item.${i}.question`}
                                defaultValue={f.question || ""}
                                placeholder={`How much does it cost to hire a lawyer in {city}?`}
                                className="bg-slate-950 border-slate-800 text-white py-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-400 text-xs">Answer</Label>
                              <Textarea
                                name={`faq.item.${i}.answer`}
                                defaultValue={f.answer || ""}
                                placeholder="Nothing upfront. Our partner attorneys work on a contingency fee basis..."
                                className="bg-slate-950 border-slate-800 text-white min-h-[60px]"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Submit & Reset Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={async () => {
                const isTemplateMode = editLevel === "homepage" || editLevel === "global";
                const message = isTemplateMode
                  ? "Are you sure you want to reset this template configuration and restore the original default copywriting?"
                  : "Are you sure you want to delete this customization override and return to the default template?";
                
                if (confirm(message)) {
                  setToastMsg(null)
                  startTransition(async () => {
                    const res = await resetPageContentConfig(
                      isTemplateMode,
                      !isTemplateMode ? selectedState : null,
                      editLevel === "city" ? selectedCity : null,
                      editLevel === "homepage" ? "homepage" : null
                    )
                    if (res.success) {
                      setToastMsg({ type: "success", text: isTemplateMode ? "Template configuration reset to default successfully!" : "Customization reset to default template successfully!" })
                      router.refresh()
                      setTimeout(() => setToastMsg(null), 4000)
                    } else {
                      setToastMsg({ type: "error", text: res.error || "Failed to reset configuration." })
                    }
                  })
                }
              }}
              className="border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              Reset to Default Template
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Configuration</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
