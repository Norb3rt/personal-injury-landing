"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { PRACTICE_AREAS, PracticeArea } from "@/lib/data/practice-areas-config"
import { getHardcodedFallbackConfig } from "@/lib/page-content"

// Retrieves allowed admin emails from environment variables
const getAdminEmails = (): string[] => {
  const adminEmailsVar = process.env.ADMIN_EMAILS || "lawproactive@gmail.com"
  return adminEmailsVar.split(",").map(e => e.trim().toLowerCase())
}

// 1. Verify if the administrator session is valid
export async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) return null

    const supabase = createSupabaseServerClient()

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user || !user.email) return null

    if (!getAdminEmails().includes(user.email.toLowerCase())) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
    }
  } catch (err) {
    console.error("Error verifying admin auth:", err)
    return null
  }
}

// 2. Administrator Sign In
export async function loginAdmin(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { success: false, error: "Email and password are required." }
    }

    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session || !data.user) {
      return { success: false, error: error?.message || "Invalid credentials." }
    }

    if (!getAdminEmails().includes(data.user.email?.toLowerCase() || "")) {
      await supabase.auth.signOut()
      return { success: false, error: "Access denied. You are not authorized as an administrator." }
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.session.expires_in,
    })

    return { success: true }
  } catch (err: any) {
    console.error("Login error:", err)
    return { success: false, error: "An unexpected error occurred." }
  }
}

// 3. Administrator Sign Out
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_token")
  return { success: true }
}

// 4. Save Practice Area Page Configurations (Hero, SEO, FAQs)
export async function updatePracticePageConfig(
  isTemplate: boolean,
  stateSlug: string | null,
  citySlug: string | null,
  practiceSlug: string,
  formData: FormData
) {
  const admin = await verifyAdminAuth()
  if (!admin) {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    // Extract all injuries from formData
    const injuries: string[] = []
    let i = 0
    while (formData.has(`about.commonInjuries.${i}`)) {
      const val = formData.get(`about.commonInjuries.${i}`) as string
      if (val && val.trim().length > 0) {
        injuries.push(val.trim())
      }
      i++
    }

    // Extract keywords from formData
    const rawKeywords = (formData.get("meta.keywords") as string) || ""
    const keywords = rawKeywords.split(",").map(k => k.trim()).filter(Boolean)

    const fallback = getHardcodedFallbackConfig()
    const sections = {
      ...fallback,
      seo: {
        metaTitle: (formData.get("seo.metaTitle") as string) || fallback.seo.metaTitle,
        metaDescription: (formData.get("seo.metaDescription") as string) || fallback.seo.metaDescription,
      },
      hero: {
        h1: (formData.get("hero.h1") as string) || fallback.hero.h1,
        subtitle: (formData.get("hero.subtitle") as string) || fallback.hero.subtitle,
        ctaText: (formData.get("hero.ctaText") as string) || fallback.hero.ctaText,
        icon: (formData.get("hero.icon") as string) || fallback.hero.icon || "⚖️",
      },
      about: {
        title: (formData.get("about.title") as string) || fallback.about?.title || "",
        longDescription: (formData.get("about.longDescription") as string) || "",
        commonInjuriesTitle: (formData.get("about.commonInjuriesTitle") as string) || fallback.about?.commonInjuriesTitle || "",
        commonInjuries: injuries,
        ctaText: (formData.get("about.ctaText") as string) || fallback.about?.ctaText || "Discuss Your Case",
      },
      meta: {
        name: (formData.get("meta.name") as string) || practiceSlug,
        description: (formData.get("meta.description") as string) || "",
        keywords: keywords,
      },
      whyChoose: {
        title: (formData.get("whyChoose.title") as string) || fallback.whyChoose?.title || "",
        items: [
          {
            title: (formData.get("whyChoose.item.0.title") as string) || fallback.whyChoose?.items?.[0]?.title || "",
            desc: (formData.get("whyChoose.item.0.desc") as string) || fallback.whyChoose?.items?.[0]?.desc || "",
          },
          {
            title: (formData.get("whyChoose.item.1.title") as string) || fallback.whyChoose?.items?.[1]?.title || "",
            desc: (formData.get("whyChoose.item.1.desc") as string) || fallback.whyChoose?.items?.[1]?.desc || "",
          },
          {
            title: (formData.get("whyChoose.item.2.title") as string) || fallback.whyChoose?.items?.[2]?.title || "",
            desc: (formData.get("whyChoose.item.2.desc") as string) || fallback.whyChoose?.items?.[2]?.desc || "",
          },
        ].filter(item => item.title && item.desc),
      },
      faq: {
        title: (formData.get("faq.title") as string) || fallback.faq.title,
        ctaText: (formData.get("faq.ctaText") as string) || fallback.faq.ctaText,
        items: [
          { question: formData.get("faq.item.0.question") as string, answer: formData.get("faq.item.0.answer") as string },
          { question: formData.get("faq.item.1.question") as string, answer: formData.get("faq.item.1.answer") as string },
          { question: formData.get("faq.item.2.question") as string, answer: formData.get("faq.item.2.answer") as string },
          { question: formData.get("faq.item.3.question") as string, answer: formData.get("faq.item.3.answer") as string },
          { question: formData.get("faq.item.4.question") as string, answer: formData.get("faq.item.4.answer") as string },
        ].filter(f => f.question && f.answer),
      }
    }

    const supabase = createSupabaseServerClient()

    if (isTemplate) {
      const { error } = await supabase
        .from("page_config_templates")
        .upsert({ page_key: practiceSlug, sections }, { onConflict: "page_key" })

      if (error) throw error
    } else {
      if (!stateSlug) {
        return { success: false, error: "State slug is required for location overrides." }
      }

      let checkQuery = supabase
        .from("location_page_configs")
        .select("id")
        .eq("state_slug", stateSlug)
        .eq("practice_slug", practiceSlug)

      if (citySlug) {
        checkQuery = checkQuery.eq("city_slug", citySlug)
      } else {
        checkQuery = checkQuery.is("city_slug", null)
      }

      const { data: existingRow } = await checkQuery.maybeSingle()

      if (existingRow) {
        const { error } = await supabase
          .from("location_page_configs")
          .update({
            sections,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingRow.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("location_page_configs")
          .insert({
            state_slug: stateSlug,
            city_slug: citySlug || null,
            practice_slug: practiceSlug,
            sections
          })

        if (error) throw error
      }
    }

    // Revalidate paths
    if (stateSlug) {
      if (citySlug) {
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/${citySlug}/${practiceSlug}`)
      } else {
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/[city]/${practiceSlug}`, "page")
      }
    } else {
      revalidatePath("/personal-injury-lawyer/[state]/[city]/[practice]", "page")
    }

    return { success: true }
  } catch (err: any) {
    console.error("Save practice page content error:", err)
    return { success: false, error: err.message || "Failed to save practice page configuration." }
  }
}

// 5. Reset/Delete Practice Area Page Configuration
export async function resetPracticePageConfig(
  isTemplate: boolean,
  stateSlug: string | null,
  citySlug: string | null,
  practiceSlug: string
) {
  const admin = await verifyAdminAuth()
  if (!admin) {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    const supabase = createSupabaseServerClient()

    if (isTemplate) {
      const { error } = await supabase
        .from("page_config_templates")
        .delete()
        .eq("page_key", practiceSlug)

      if (error) throw error
      revalidatePath("/personal-injury-lawyer/[state]/[city]/[practice]", "page")
    } else {
      if (!stateSlug) {
        return { success: false, error: "State slug is required to reset overrides." }
      }

      let query = supabase
        .from("location_page_configs")
        .delete()
        .eq("state_slug", stateSlug)
        .eq("practice_slug", practiceSlug)

      if (citySlug) {
        query = query.eq("city_slug", citySlug)
      } else {
        query = query.is("city_slug", null)
      }

      const { error } = await query
      if (error) throw error

      if (citySlug) {
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/${citySlug}/${practiceSlug}`)
      } else {
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/[city]/${practiceSlug}`, "page")
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Reset practice page content error:", err)
    return { success: false, error: err.message || "Failed to reset practice page configuration." }
  }
}

// 6. Save/Update Practice Area Meta Definitions (Icon, Name, Description, Long Description, Common Injuries, Keywords)
export async function updatePracticeAreaMeta(
  practiceSlug: string,
  updatedMeta: Partial<PracticeArea>
) {
  const admin = await verifyAdminAuth()
  if (!admin) {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    const supabase = createSupabaseServerClient()

    const { data: currentRecord } = await supabase
      .from("page_config_templates")
      .select("sections")
      .eq("page_key", "practice_areas_meta")
      .maybeSingle()

    let items: PracticeArea[] = currentRecord?.sections?.items || PRACTICE_AREAS

    const index = items.findIndex(pa => pa.slug === practiceSlug)
    const cleanedMeta = {
      ...updatedMeta,
      icon: await cleanEmoji(updatedMeta.icon || ""),
      commonInjuries: (updatedMeta.commonInjuries || []).filter(item => item && item.trim().length > 0)
    }

    if (index !== -1) {
      items[index] = { ...items[index], ...cleanedMeta }
    } else {
      items.push({
        name: cleanedMeta.name || practiceSlug,
        slug: practiceSlug,
        icon: cleanedMeta.icon || "⚖️",
        description: cleanedMeta.description || "",
        longDescription: cleanedMeta.longDescription || "",
        keywords: cleanedMeta.keywords || [],
        commonInjuries: cleanedMeta.commonInjuries || [],
        faqItems: cleanedMeta.faqItems || []
      })
    }

    const { error } = await supabase
      .from("page_config_templates")
      .upsert({
        page_key: "practice_areas_meta",
        sections: { items }
      }, { onConflict: "page_key" })

    if (error) throw error

    revalidatePath("/personal-injury-lawyer/[state]/[city]/[practice]", "page")
    return { success: true }
  } catch (err: any) {
    console.error("Save practice area meta error:", err)
    return { success: false, error: err.message || "Failed to save practice area metadata." }
  }
}

// 7. Reset Practice Area Meta Definitions back to original factory defaults
export async function resetPracticeAreaMeta(practiceSlug: string) {
  const admin = await verifyAdminAuth()
  if (!admin) {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    const supabase = createSupabaseServerClient()

    const { data: currentRecord } = await supabase
      .from("page_config_templates")
      .select("sections")
      .eq("page_key", "practice_areas_meta")
      .maybeSingle()

    let items: PracticeArea[] = currentRecord?.sections?.items || PRACTICE_AREAS

    // Find factory default in PRACTICE_AREAS
    const factoryDefault = PRACTICE_AREAS.find(p => p.slug === practiceSlug)
    if (!factoryDefault) {
      return { success: false, error: "Factory default for practice area not found." }
    }

    const index = items.findIndex(pa => pa.slug === practiceSlug)
    if (index !== -1) {
      items[index] = { ...factoryDefault }
    } else {
      items.push({ ...factoryDefault })
    }

    const { error } = await supabase
      .from("page_config_templates")
      .upsert({
        page_key: "practice_areas_meta",
        sections: { items }
      }, { onConflict: "page_key" })

    if (error) throw error

    revalidatePath("/personal-injury-lawyer/[state]/[city]/[practice]", "page")
    return { success: true }
  } catch (err: any) {
    console.error("Reset practice area meta error:", err)
    return { success: false, error: err.message || "Failed to reset practice area metadata." }
  }
}

// Helper function to sanitize emoji strings to a single primary emoji using Intl.Segmenter
export async function cleanEmoji(icon: string): Promise<string> {
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

// 7. Get dynamic practice area metadata list from DB or static fallbacks
export async function getPracticeAreasDynamicList(): Promise<PracticeArea[]> {
  try {
    const supabase = createSupabaseServerClient()
    const { data: currentRecord } = await supabase
      .from("page_config_templates")
      .select("sections")
      .eq("page_key", "practice_areas_meta")
      .maybeSingle()

    if (currentRecord?.sections?.items && Array.isArray(currentRecord.sections.items)) {
      return await Promise.all(
        currentRecord.sections.items.map(async (item: PracticeArea) => ({
          ...item,
          icon: await cleanEmoji(item.icon)
        }))
      )
    }
  } catch (err) {
    console.error("Error loading dynamic practice areas meta:", err)
  }
  return await Promise.all(
    PRACTICE_AREAS.map(async (item: PracticeArea) => ({
      ...item,
      icon: await cleanEmoji(item.icon)
    }))
  )
}
