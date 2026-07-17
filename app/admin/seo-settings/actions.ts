"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

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

    // Instantiate a fresh request client
    const supabase = createSupabaseServerClient()

    // Validate the JWT token server-side with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user || !user.email) return null

    // Check if the user is authorized in the ADMIN_EMAILS list
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

    // Instantiate a fresh request client
    const supabase = createSupabaseServerClient()

    // Authenticate user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session || !data.user) {
      return { success: false, error: error?.message || "Invalid credentials." }
    }

    // Check admin authorization
    if (!getAdminEmails().includes(data.user.email?.toLowerCase() || "")) {
      // Sign out immediately if not authorized (on a fresh client context)
      await supabase.auth.signOut()
      return { success: false, error: "Access denied. You are not authorized as an administrator." }
    }

    // Store access token in a secure HTTP-only cookie
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

// 4. Save Page Content Templates or Custom Overrides (City/State level)
export async function updatePageContentConfig(
  isTemplate: boolean, // true if editing global default template, false if editing location override
  stateSlug: string | null,
  citySlug: string | null, // null indicates a state-level override
  practiceSlug: string | null,
  formData: FormData
) {
  // A. Verify admin authentication
  const admin = await verifyAdminAuth()
  if (!admin) {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    // B. Build the unified JSONB document from form entries
    const sections = {
      seo: {
        metaTitle: formData.get("seo.metaTitle") as string,
        metaDescription: formData.get("seo.metaDescription") as string,
      },
      hero: {
        h1: formData.get("hero.h1") as string,
        subtitle: formData.get("hero.subtitle") as string,
        ctaText: formData.get("hero.ctaText") as string,
      },
      services: {
        title: formData.get("services.title") as string,
        items: [
          { name: formData.get("services.item.0.name") as string, slug: formData.get("services.item.0.slug") as string, icon: formData.get("services.item.0.icon") as string, description: formData.get("services.item.0.description") as string },
          { name: formData.get("services.item.1.name") as string, slug: formData.get("services.item.1.slug") as string, icon: formData.get("services.item.1.icon") as string, description: formData.get("services.item.1.description") as string },
          { name: formData.get("services.item.2.name") as string, slug: formData.get("services.item.2.slug") as string, icon: formData.get("services.item.2.icon") as string, description: formData.get("services.item.2.description") as string },
          { name: formData.get("services.item.3.name") as string, slug: formData.get("services.item.3.slug") as string, icon: formData.get("services.item.3.icon") as string, description: formData.get("services.item.3.description") as string },
          { name: formData.get("services.item.4.name") as string, slug: formData.get("services.item.4.slug") as string, icon: formData.get("services.item.4.icon") as string, description: formData.get("services.item.4.description") as string },
          { name: formData.get("services.item.5.name") as string, slug: formData.get("services.item.5.slug") as string, icon: formData.get("services.item.5.icon") as string, description: formData.get("services.item.5.description") as string },
        ].filter(item => item.name && item.slug)
      },
      painPoints: {
        title: formData.get("painPoints.title") as string,
        ctaText: formData.get("painPoints.ctaText") as string,
        items: [
          formData.get("painPoints.item.0") as string,
          formData.get("painPoints.item.1") as string,
          formData.get("painPoints.item.2") as string,
          formData.get("painPoints.item.3") as string,
        ].filter(Boolean),
      },
      valueProp: {
        title: formData.get("valueProp.title") as string,
        subtitle: formData.get("valueProp.subtitle") as string,
        ctaText: formData.get("valueProp.ctaText") as string,
        stats: [
          { 
            value: formData.get("valueProp.stat.0.value") ? parseInt(formData.get("valueProp.stat.0.value") as string) : null, 
            suffix: formData.get("valueProp.stat.0.suffix") as string, 
            label: formData.get("valueProp.stat.0.label") as string, 
            desc: formData.get("valueProp.stat.0.desc") as string 
          },
          { 
            value: formData.get("valueProp.stat.1.value") ? parseInt(formData.get("valueProp.stat.1.value") as string) : null, 
            suffix: formData.get("valueProp.stat.1.suffix") as string, 
            label: formData.get("valueProp.stat.1.label") as string, 
            desc: formData.get("valueProp.stat.1.desc") as string 
          },
          { 
            value: formData.get("valueProp.stat.2.value") ? parseInt(formData.get("valueProp.stat.2.value") as string) : null, 
            suffix: formData.get("valueProp.stat.2.suffix") as string, 
            label: formData.get("valueProp.stat.2.label") as string, 
            desc: formData.get("valueProp.stat.2.desc") as string 
          },
        ],
      },
      howItWorks: {
        title: formData.get("howItWorks.title") as string,
        ctaText: formData.get("howItWorks.ctaText") as string,
        steps: [
          { title: formData.get("howItWorks.step.0.title") as string, desc: formData.get("howItWorks.step.0.desc") as string },
          { title: formData.get("howItWorks.step.1.title") as string, desc: formData.get("howItWorks.step.1.desc") as string },
          { title: formData.get("howItWorks.step.2.title") as string, desc: formData.get("howItWorks.step.2.desc") as string },
        ],
      },
      riskReversal: {
        title: formData.get("riskReversal.title") as string,
        desc: formData.get("riskReversal.desc") as string,
        disclaimer: formData.get("riskReversal.disclaimer") as string,
        ctaText: formData.get("riskReversal.ctaText") as string,
      },
      testimonials: {
        title: formData.get("testimonials.title") as string,
        ctaText: formData.get("testimonials.ctaText") as string,
        items: [
          { name: formData.get("testimonials.item.0.name") as string, location: formData.get("testimonials.item.0.location") as string, case: formData.get("testimonials.item.0.case") as string, settlement: formData.get("testimonials.item.0.settlement") as string, quote: formData.get("testimonials.item.0.quote") as string, rating: formData.get("testimonials.item.0.rating") ? parseInt(formData.get("testimonials.item.0.rating") as string) : null },
          { name: formData.get("testimonials.item.1.name") as string, location: formData.get("testimonials.item.1.location") as string, case: formData.get("testimonials.item.1.case") as string, settlement: formData.get("testimonials.item.1.settlement") as string, quote: formData.get("testimonials.item.1.quote") as string, rating: formData.get("testimonials.item.1.rating") ? parseInt(formData.get("testimonials.item.1.rating") as string) : null },
          { name: formData.get("testimonials.item.2.name") as string, location: formData.get("testimonials.item.2.location") as string, case: formData.get("testimonials.item.2.case") as string, settlement: formData.get("testimonials.item.2.settlement") as string, quote: formData.get("testimonials.item.2.quote") as string, rating: formData.get("testimonials.item.2.rating") ? parseInt(formData.get("testimonials.item.2.rating") as string) : null },
        ].filter(t => t.quote),
      },
      reassurance: {
        title: formData.get("reassurance.title") as string,
        desc: formData.get("reassurance.desc") as string,
        ctaText: formData.get("reassurance.ctaText") as string,
      },
      faq: {
        title: formData.get("faq.title") as string,
        ctaText: formData.get("faq.ctaText") as string,
        items: [
          { question: formData.get("faq.item.0.question") as string, answer: formData.get("faq.item.0.answer") as string },
          { question: formData.get("faq.item.1.question") as string, answer: formData.get("faq.item.1.answer") as string },
          { question: formData.get("faq.item.2.question") as string, answer: formData.get("faq.item.2.answer") as string },
          { question: formData.get("faq.item.3.question") as string, answer: formData.get("faq.item.3.answer") as string },
          { question: formData.get("faq.item.4.question") as string, answer: formData.get("faq.item.4.answer") as string },
        ].filter(f => f.question && f.answer),
      }
    }

    // Instantiate a fresh request client
    const supabase = createSupabaseServerClient()

    if (isTemplate) {
      // C.1. Save into page_config_templates (Global Default template)
      const pageKey = practiceSlug || "default"
      const { error } = await supabase
        .from("page_config_templates")
        .upsert({ page_key: pageKey, sections }, { onConflict: "page_key" })

      if (error) throw error
    } else {
      // C.2. Save into location_page_configs (City or State level overrides)
      if (!stateSlug) {
        return { success: false, error: "State slug is required." }
      }

      // Check if a row already exists
      let checkQuery = supabase
        .from("location_page_configs")
        .select("id")
        .eq("state_slug", stateSlug)

      if (citySlug) {
        checkQuery = checkQuery.eq("city_slug", citySlug)
      } else {
        checkQuery = checkQuery.is("city_slug", null)
      }

      if (practiceSlug) {
        checkQuery = checkQuery.eq("practice_slug", practiceSlug)
      } else {
        checkQuery = checkQuery.is("practice_slug", null)
      }

      const { data: existingRow } = await checkQuery.maybeSingle()

      if (existingRow) {
        // Update it
        const { error } = await supabase
          .from("location_page_configs")
          .update({
            sections,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingRow.id)

        if (error) throw error
      } else {
        // Insert it
        const { error } = await supabase
          .from("location_page_configs")
          .insert({
            state_slug: stateSlug,
            city_slug: citySlug || null,
            practice_slug: practiceSlug || null,
            sections
          })

        if (error) throw error
      }
    }

    // D. Revalidate paths in Next.js Cache
    if (stateSlug) {
      if (citySlug) {
        if (practiceSlug) {
          revalidatePath(`/personal-injury-lawyer/${stateSlug}/${citySlug}/${practiceSlug}`)
        } else {
          revalidatePath(`/personal-injury-lawyer/${stateSlug}/${citySlug}`)
        }
      } else {
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/[city]`, "page")
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/[city]/[practice]`, "page")
      }
    } else {
      revalidatePath("/personal-injury-lawyer/[state]/[city]", "page")
      revalidatePath("/personal-injury-lawyer/[state]/[city]/[practice]", "page")
    }

    return { success: true }
  } catch (err: any) {
    console.error("Save content template error:", err)
    return { success: false, error: err.message || "Failed to save configuration." }
  }
}

// 5. Reset/Delete Page Content Override or Template
export async function resetPageContentConfig(
  isTemplate: boolean,
  stateSlug: string | null,
  citySlug: string | null,
  practiceSlug: string | null = null
) {
  // A. Verify admin authentication
  const admin = await verifyAdminAuth()
  if (!admin) {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    // Instantiate a fresh request client
    const supabase = createSupabaseServerClient()

    if (isTemplate) {
      // Delete global template or homepage template
      const pageKey = practiceSlug || "default"
      const { error } = await supabase
        .from("page_config_templates")
        .delete()
        .eq("page_key", pageKey)

      if (error) throw error

      // Revalidate all pages depending on what template was reset
      if (pageKey === "homepage") {
        revalidatePath("/")
      } else {
        revalidatePath("/personal-injury-lawyer/[state]/[city]", "page")
        revalidatePath("/personal-injury-lawyer/[state]/[city]/[practice]", "page")
      }
    } else {
      if (!stateSlug) {
        return { success: false, error: "State slug is required to reset overrides." }
      }

      // B. Build the deletion query for overrides
      let query = supabase
        .from("location_page_configs")
        .delete()
        .eq("state_slug", stateSlug)

      if (citySlug) {
        query = query.eq("city_slug", citySlug)
      } else {
        query = query.is("city_slug", null)
      }

      if (practiceSlug) {
        query = query.eq("practice_slug", practiceSlug)
      } else {
        query = query.is("practice_slug", null)
      }

      const { error } = await query

      if (error) throw error

      // C. Revalidate cache
      if (citySlug) {
        if (practiceSlug) {
          revalidatePath(`/personal-injury-lawyer/${stateSlug}/${citySlug}/${practiceSlug}`)
        } else {
          revalidatePath(`/personal-injury-lawyer/${stateSlug}/${citySlug}`)
        }
      } else {
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/[city]`, "page")
        revalidatePath(`/personal-injury-lawyer/${stateSlug}/[city]/[practice]`, "page")
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Reset content template error:", err)
    return { success: false, error: err.message || "Failed to reset configuration." }
  }
}
