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
import {
  loginAdmin,
  logoutAdmin,
  updatePracticePageConfig,
  resetPracticePageConfig,
  updatePracticeAreaMeta,
  resetPracticeAreaMeta
} from "./actions"

function cleanSingleEmoji(icon: string): string {
  if (!icon) return "🚗"
  const trimmed = icon.trim()
  try {
    if (typeof Intl !== "undefined" && (Intl as any).Segmenter) {
      const segmenter = new (Intl as any).Segmenter(undefined, { granularity: "grapheme" })
      const segments = Array.from(segmenter.segment(trimmed)) as any[]
      if (segments.length > 0 && segments[0].segment) {
        return segments[0].segment
      }
    }
  } catch (e) {
    // Fallback if Segmenter is unavailable
  }
  const tokens = trimmed.split(/\s+/)
  return tokens[0] || trimmed
}
import { PracticeArea, PRACTICE_AREAS } from "@/lib/data/practice-areas-config"
import {
  Shield,
  LayoutDashboard,
  Globe,
  Briefcase,
  LogOut,
  Loader2,
  Save,
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Search,
  Sparkles,
  ShieldCheck
} from "lucide-react"

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
  practiceAreas: PracticeArea[]
}

export default function AdminPracticeAreasForm({
  adminUser,
  currentConfig,
  allLocations,
  practiceAreas
}: FormProps) {
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

  // URL Query Parameters
  const currentPractice = searchParams.get("practice") || (practiceAreas[0]?.slug || "car-accident")
  const currentState = searchParams.get("state") || ""
  const currentCity = searchParams.get("city") || ""
  const currentLevel = searchParams.get("level") || "template" // "template" | "state" | "city"

  const [selectedPractice, setSelectedPractice] = useState(currentPractice)
  const [editLevel, setEditLevel] = useState<"template" | "state" | "city">(currentLevel as any)
  const [selectedState, setSelectedState] = useState(currentState)
  const [selectedCity, setSelectedCity] = useState(currentCity)

  // Practice Area Metadata State
  const activePracticeMeta = practiceAreas.find(p => p.slug === selectedPractice) || {
    name: selectedPractice,
    slug: selectedPractice,
    icon: "⚖️",
    description: "",
    longDescription: "",
    keywords: [],
    commonInjuries: [],
    faqItems: []
  }

  const [metaForm, setMetaForm] = useState<PracticeArea>(activePracticeMeta)

  // Sync states with URL changes & load currentConfig overrides cleanly
  useEffect(() => {
    setSelectedPractice(searchParams.get("practice") || (practiceAreas[0]?.slug || "car-accident"))
    setEditLevel((searchParams.get("level") as any) || "template")
    setSelectedState(searchParams.get("state") || "")
    setSelectedCity(searchParams.get("city") || "")
  }, [searchParams, practiceAreas])

  useEffect(() => {
    const meta = practiceAreas.find(p => p.slug === selectedPractice) || {
      name: selectedPractice,
      slug: selectedPractice,
      icon: "⚖️",
      description: "",
      longDescription: "",
      keywords: [],
      commonInjuries: [],
      faqItems: []
    }
    const factoryMeta = PRACTICE_AREAS.find(p => p.slug === selectedPractice)

    const resolvedLongDesc = (currentConfig?.about?.longDescription && currentConfig.about.longDescription.trim() !== "")
      ? currentConfig.about.longDescription
      : (meta.longDescription && meta.longDescription.trim() !== "")
        ? meta.longDescription
        : (factoryMeta?.longDescription || "")

    const resolvedInjuries = (currentConfig?.about?.commonInjuries && currentConfig.about.commonInjuries.length > 0)
      ? currentConfig.about.commonInjuries
      : (meta.commonInjuries && meta.commonInjuries.length > 0)
        ? meta.commonInjuries
        : (factoryMeta?.commonInjuries || [])

    setMetaForm({
      ...meta,
      name: currentConfig?.meta?.name || meta.name,
      icon: cleanSingleEmoji(currentConfig?.hero?.icon || meta.icon),
      description: currentConfig?.meta?.description || meta.description,
      longDescription: resolvedLongDesc,
      commonInjuries: resolvedInjuries,
      keywords: (currentConfig?.meta?.keywords && currentConfig.meta.keywords.length > 0) ? currentConfig.meta.keywords : meta.keywords,
    })
  }, [selectedPractice, practiceAreas, currentConfig])

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

  // Filter unique states
  const uniqueStates = Array.from(
    new Map<string, { slug: string; name: string }>(
      allLocations.map((loc) => [
        loc.stateSlug,
        { slug: loc.stateSlug, name: loc.stateName }
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name))

  // Filter cities in selected state
  const filteredCities = allLocations
    .filter((loc) => loc.stateSlug === selectedState)
    .sort((a, b) => a.cityName.localeCompare(b.cityName))

  // Push URL navigation updates
  const updateNavigation = (
    practiceVal: string,
    levelVal: "template" | "state" | "city",
    stateVal: string,
    cityVal: string
  ) => {
    const params = new URLSearchParams()
    params.set("practice", practiceVal)
    params.set("level", levelVal)

    if (levelVal !== "template") {
      const activeState = stateVal || (uniqueStates[0]?.slug || "")
      params.set("state", activeState)
      if (levelVal === "city") {
        const defaultCityItem = allLocations.find(l => l.stateSlug === activeState)
        const activeCity = cityVal || (defaultCityItem?.citySlug || "")
        params.set("city", activeCity)
      }
    }
    router.push(`/admin/practice-areas?${params.toString()}`)
  }

  const handlePracticeChange = (newPractice: string) => {
    setSelectedPractice(newPractice)
    updateNavigation(newPractice, editLevel, selectedState, selectedCity)
  }

  const handleLevelChange = (newLevel: "template" | "state" | "city") => {
    setEditLevel(newLevel)
    updateNavigation(selectedPractice, newLevel, selectedState, newLevel === "city" ? selectedCity : "")
  }

  const handleStateChange = (stateSlug: string) => {
    setSelectedState(stateSlug)
    const firstCity = allLocations.find(loc => loc.stateSlug === stateSlug)?.citySlug || ""
    setSelectedCity(firstCity)
    updateNavigation(selectedPractice, editLevel, stateSlug, editLevel === "city" ? firstCity : "")
  }

  const handleCityChange = (citySlug: string) => {
    setSelectedCity(citySlug)
    updateNavigation(selectedPractice, editLevel, selectedState, citySlug)
  }

  // Handle Save (Saves page content config for target scope: template, state, or city)
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setToastMsg(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      // 1. Save page content & SEO for target scope (template, state, or city)
      const resPage = await updatePracticePageConfig(
        editLevel === "template",
        editLevel !== "template" ? selectedState : null,
        editLevel === "city" ? selectedCity : null,
        selectedPractice,
        formData
      )

      // 2. Save global practice area metadata ONLY if editing global template level
      let resMeta: { success: boolean; error?: string } = { success: true }
      if (editLevel === "template") {
        resMeta = await updatePracticeAreaMeta(selectedPractice, metaForm)
      }

      if (resPage.success && resMeta.success) {
        setToastMsg({ type: "success", text: `Configuration for "${metaForm.name}" saved successfully!` })
        router.refresh()
        setTimeout(() => setToastMsg(null), 4000)
      } else {
        setToastMsg({ type: "error", text: resPage.error || resMeta.error || "Failed to save configuration." })
      }
    })
  }

  // Handle Reset Content Override/Template
  const handleResetContent = async () => {
    const isTemplateMode = editLevel === "template"
    const message = isTemplateMode
      ? `Are you sure you want to reset the global template for "${activePracticeMeta.name}"?`
      : `Are you sure you want to delete this customization override for "${activePracticeMeta.name}"?`

    if (!confirm(message)) return
    setToastMsg(null)

    startTransition(async () => {
      const res = await resetPracticePageConfig(
        isTemplateMode,
        !isTemplateMode ? selectedState : null,
        editLevel === "city" ? selectedCity : null,
        selectedPractice
      )

      let resMeta: { success: boolean; error?: string } = { success: true }
      if (isTemplateMode) {
        resMeta = await resetPracticeAreaMeta(selectedPractice)
      }

      if (res.success && resMeta.success) {
        setToastMsg({
          type: "success",
          text: isTemplateMode
            ? `Global template and factory defaults for "${activePracticeMeta.name}" restored successfully!`
            : `Customization override reset successfully!`
        })
        router.refresh()
        setTimeout(() => setToastMsg(null), 4000)
      } else {
        setToastMsg({ type: "error", text: res.error || resMeta.error || "Failed to reset configuration." })
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
              <p className="text-slate-400 text-sm text-center mt-1">Practice Areas CMS Editor</p>
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

  // Title Text
  const practiceName = metaForm.name || selectedPractice

  const activeTargetScopeTitle = editLevel === "template"
    ? `Global Practice Template: ${practiceName}`
    : editLevel === "state"
      ? `State Override: ${uniqueStates.find(s => s.slug === selectedState)?.name || selectedState} (${practiceName})`
      : `City Override: ${allLocations.find(l => l.stateSlug === selectedState && l.citySlug === selectedCity)?.cityName || selectedCity}, ${uniqueStates.find(s => s.slug === selectedState)?.name || selectedState} (${practiceName})`

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar Navigation */}
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
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span className="font-medium text-sm">City Pages</span>
            </Link>
            <Link
              href="/admin/practice-areas"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-teal-500/10 text-teal-400 font-medium transition-colors"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-sm">Practice Areas</span>
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

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white font-sans flex items-center gap-3">
              <Briefcase className="h-7 w-7 text-teal-400" />
              <span>Practice Areas CMS Editor</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Configure Hero, About, Common Injuries, and FAQs for Practice Area landing pages</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/seo-settings"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              <Globe className="h-4 w-4 text-teal-400" />
              <span>City Pages CMS</span>
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

        {/* Toast Alert */}
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

        {/* Target Scope Selection Controls */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Select Practice Area */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm font-semibold">1. Select Practice Area</Label>
              <select
                value={selectedPractice}
                onChange={(e) => handlePracticeChange(e.target.value)}
                className="w-full block bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:border-teal-500 focus:outline-none"
              >
                {practiceAreas.map((pa) => (
                  <option key={pa.slug} value={pa.slug}>
                    {cleanSingleEmoji(pa.icon)} {pa.name} ({pa.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Target Scope */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm font-semibold">2. Edit Target Scope</Label>
              <select
                value={editLevel}
                onChange={(e) => handleLevelChange(e.target.value as any)}
                className="w-full block bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:border-teal-500 focus:outline-none"
              >
                <option value="template">🎯 Global Practice Area Template (All Cities Fallback)</option>
                <option value="state">🏢 State Override (All Cities in State)</option>
                <option value="city">📍 City Override (Specific City)</option>
              </select>
            </div>

            {/* 3. State Selector (if state or city override level) */}
            {editLevel !== "template" && (
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">3. Select State</Label>
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

            {/* 4. City Selector (if city override level) */}
            {editLevel === "city" && (
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">4. Select City</Label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full block bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:border-teal-500 focus:outline-none"
                >
                  {filteredCities.map((c) => (
                    <option key={c.citySlug} value={c.citySlug}>
                      {c.cityName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800/60">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Target Scope</span>
            <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-400 px-3 py-1.5 text-sm font-medium">
              {activeTargetScopeTitle}
            </Badge>
          </div>
        </div>

        {/* Streamlined Practice Area Editor Form */}
        <form key={JSON.stringify(currentConfig) + editLevel + selectedState + selectedCity} onSubmit={handleSave} className="space-y-8">
          {/* Practice Area Page Specific Tabs */}
          <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
            {[
              { id: "hero", label: "Hero & SEO" },
              { id: "about", label: "About & Common Injuries" },
              { id: "whyChoose", label: "Why Choose Network" },
              { id: "faq", label: "Frequently Asked Questions" },
              // { id: "keywords", label: "Schema & SEO Keywords" }
            ].map((tab) => (
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
              {/* TAB 1: HERO & SEO */}
              <div className={activeTab === "hero" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span>SEO Metadata Tags</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure search engine tags for this practice page. Use <code className="text-teal-400 font-mono">{"{city}"}</code> and <code className="text-teal-400 font-mono">{"{state}"}</code> placeholders for dynamic localization.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Meta Title Tag</Label>
                      <Input
                        name="seo.metaTitle"
                        defaultValue={currentConfig.seo?.metaTitle || ""}
                        placeholder={`{city} ${practiceName} Lawyer | {state} | Free Case Review`}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Meta Description Tag</Label>
                      <Textarea
                        name="seo.metaDescription"
                        defaultValue={currentConfig.seo?.metaDescription || ""}
                        placeholder={`Injured in a ${practiceName.toLowerCase()} accident in {city}? Contact our experienced attorneys...`}
                        className="bg-slate-950 border-slate-800 text-white min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="border-b border-slate-800 pb-4 mb-4 pt-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Hero Section Configuration</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure the top hero banner elements (Emoji icon, practice title, H1 heading, subtitle, and CTA button text).
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-slate-300">Practice Emoji Icon</Label>
                      <Input
                        name="hero.icon"
                        value={metaForm.icon}
                        onChange={(e) => setMetaForm({ ...metaForm, icon: e.target.value })}
                        placeholder="🚗"
                        className="bg-slate-950 border-slate-800 text-white mt-1.5 text-center text-xl"
                      />
                      <p className="text-xs text-slate-500 mt-1">Rendered above the H1 in Hero</p>
                    </div>
                    <div>
                      <Label className="text-slate-300">Practice Area Name</Label>
                      <Input
                        name="meta.name"
                        value={metaForm.name}
                        onChange={(e) => setMetaForm({ ...metaForm, name: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-800 text-white mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">URL Slug (Identifier)</Label>
                      <Input
                        value={metaForm.slug}
                        disabled
                        className="bg-slate-950/60 border-slate-800 text-slate-400 mt-1.5 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-300">H1 Principal Heading</Label>
                      <Input
                        name="hero.h1"
                        defaultValue={currentConfig.hero?.h1 || ""}
                        placeholder={`{city} ${practiceName} Attorney`}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Hero Subtitle Paragraph</Label>
                      <Textarea
                        name="hero.subtitle"
                        defaultValue={currentConfig.hero?.subtitle || ""}
                        placeholder={`Dedicated legal representation for ${practiceName.toLowerCase()} victims in {city}. No win, no fee.`}
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

              {/* TAB 2: ABOUT & COMMON INJURIES */}
              <div className={activeTab === "about" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      <span>About {practiceName} Cases & Common Injuries</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure the explanation paragraph and injuries checklist displayed under the section <strong className="text-white">&quot;About {practiceName} Cases in {"{city}"}&quot;</strong> on the live practice page.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">About Section Main Title</Label>
                    <Input
                      name="about.title"
                      defaultValue={currentConfig.about?.title || `About ${practiceName} Cases in {city}`}
                      placeholder={`About ${practiceName} Cases in {city}`}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                    <p className="text-xs text-slate-500">Main section header (e.g. &quot;About Car &amp; Truck Accident Cases in {"{city}"}&quot;).</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">About Section Long Description Paragraph</Label>
                    <Textarea
                      name="about.longDescription"
                      value={metaForm.longDescription}
                      onChange={(e) => setMetaForm({ ...metaForm, longDescription: e.target.value })}
                      placeholder="Car accidents can result in serious injuries, property damage, and financial hardship..."
                      className="bg-slate-950 border-slate-800 text-white min-h-[160px]"
                    />
                    <p className="text-xs text-slate-500">This text appears directly on the live page under the About title.</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="text-slate-300">About Section Call to Action (CTA) Button Text</Label>
                    <Input
                      name="about.ctaText"
                      defaultValue={currentConfig.about?.ctaText || `Discuss Your ${practiceName} Case`}
                      placeholder={`Discuss Your ${practiceName} Case`}
                      className="bg-slate-950 border-slate-800 text-white max-w-md"
                    />
                    <p className="text-xs text-slate-500">The CTA button text rendered at the bottom of the About section.</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="text-slate-300">Common Injuries Box Title</Label>
                    <Input
                      name="about.commonInjuriesTitle"
                      defaultValue={currentConfig.about?.commonInjuriesTitle || `Common Injuries in ${practiceName} Cases`}
                      placeholder={`Common Injuries in ${practiceName} Cases`}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>

                  {/* Common Injuries List */}
                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <div>
                      <Label className="text-slate-300 font-bold block">Common Injuries Checklist</Label>
                      <p className="text-xs text-slate-400">Edit the text for each injury item rendered in the two-column checklist box under &quot;Common Injuries in {practiceName} Cases&quot;.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 pt-1">
                      {(metaForm.commonInjuries || []).map((injury, idx) => (
                        <div key={idx} className="space-y-1">
                          <Label className="text-slate-400 text-xs font-mono">Injury #{idx + 1}</Label>
                          <Input
                            name={`about.commonInjuries.${idx}`}
                            value={injury}
                            onChange={(e) => {
                              const newInjuries = [...metaForm.commonInjuries]
                              newInjuries[idx] = e.target.value
                              setMetaForm({ ...metaForm, commonInjuries: newInjuries })
                            }}
                            placeholder="Whiplash and neck injuries"
                            className="bg-slate-950 border-slate-800 text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB 3: WHY CHOOSE NETWORK */}
              <div className={activeTab === "whyChoose" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      <span>Why Choose Our Network Section</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure the main section title and the 3 feature cards displayed in the <strong className="text-white">&quot;Why Choose Our {practiceName} Attorneys in {"{city}"}&quot;</strong> section.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Section Title</Label>
                    <Input
                      name="whyChoose.title"
                      defaultValue={currentConfig.whyChoose?.title || `Why Choose Our ${practiceName} Attorneys in {city}`}
                      placeholder={`Why Choose Our ${practiceName} Attorneys in {city}`}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    {[
                      { defaultTitle: "Proven Track Record", defaultDesc: `We bring experience and dedication to every ${practiceName.toLowerCase()} case we handle, fighting to pursue the compensation our clients deserve.` },
                      { defaultTitle: "Personalized Attention", defaultDesc: `Every case is unique. Our attorneys provide personalized strategies tailored to your specific ${practiceName.toLowerCase()} situation.` },
                      { defaultTitle: "No Upfront Costs", defaultDesc: "We work on a contingency fee basis — no attorney's fees unless we recover compensation for your case." }
                    ].map((defaultCard, i) => {
                      const item = currentConfig.whyChoose?.items?.[i] || {}
                      return (
                        <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                          <span className="text-xs font-semibold text-slate-500">Feature Card #{i + 1}</span>
                          <div className="space-y-2">
                            <Label className="text-slate-400 text-xs">Card Title</Label>
                            <Input
                              name={`whyChoose.item.${i}.title`}
                              defaultValue={item.title || defaultCard.defaultTitle}
                              placeholder={defaultCard.defaultTitle}
                              className="bg-slate-950 border-slate-800 text-white font-semibold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-400 text-xs">Card Description Paragraph</Label>
                            <Textarea
                              name={`whyChoose.item.${i}.desc`}
                              defaultValue={item.desc || defaultCard.defaultDesc}
                              placeholder={defaultCard.defaultDesc}
                              className="bg-slate-950 border-slate-800 text-white min-h-[60px]"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* TAB 4: FAQs */}
              <div className={activeTab === "faq" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Frequently Asked Questions (FAQs)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Configure questions and answers for the accordion FAQ component on the practice page.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Section Title</Label>
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
                        const faq = currentConfig.faq?.items?.[i] || {}
                        return (
                          <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                            <span className="text-xs font-semibold text-slate-500">FAQ Item #{i + 1}</span>
                            <div className="space-y-2">
                              <Label className="text-slate-400 text-xs">Question</Label>
                              <Input
                                name={`faq.item.${i}.question`}
                                defaultValue={faq.question || ""}
                                placeholder={`How much does a ${practiceName.toLowerCase()} lawyer cost in {city}?`}
                                className="bg-slate-950 border-slate-800 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-400 text-xs">Answer</Label>
                              <Textarea
                                name={`faq.item.${i}.answer`}
                                defaultValue={faq.answer || ""}
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

              {/* TAB 4: SCHEMA & KEYWORDS */}
              <div className={activeTab === "keywords" ? "" : "hidden"}>
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      <span>Schema & SEO Keywords</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Configure Google Schema.org structured data category and search engine targeting keywords.</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Schema Legal Service Category (Google JSON-LD Target)</Label>
                    <Input
                      name="meta.serviceType"
                      defaultValue={currentConfig.meta?.serviceType || "LegalService"}
                      placeholder="LegalService / AutomobileAccidentClaim"
                      className="bg-slate-950 border-slate-800 text-white max-w-md"
                    />
                    <p className="text-xs text-slate-500">Specifies the structured data LegalService type category injected for Google Search Console rich results.</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="text-slate-300">Comma-Separated SEO Keywords List</Label>
                    <Textarea
                      name="meta.keywords"
                      value={(metaForm.keywords || []).join(", ")}
                      onChange={(e) => {
                        const list = e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                        setMetaForm({ ...metaForm, keywords: list })
                      }}
                      placeholder="car accident lawyer, auto accident attorney, vehicle collision claim, rear-end accident"
                      className="bg-slate-950 border-slate-800 text-white min-h-[120px]"
                    />
                    <p className="text-xs text-slate-500">Separate keywords with commas. These are injected into meta tags and structured data for search engine optimization.</p>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={handleResetContent}
                  className="border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset to Default Template</span>
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-2.5 rounded-xl shadow-lg transition-colors flex items-center gap-2"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span>Save Configuration</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}
