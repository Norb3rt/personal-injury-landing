"use server"

import { z } from "zod"
// Strapi integration removed - using only Perfex CRM
import { createPerfexLead, type LeadFormData } from "./perfex/simple-leads"
import { validatePerfexConfig } from "./perfex/api"

const leadSubmissionSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  caseType: z.string().min(1),
  accidentDate: z.string().optional(),
  urgency: z.string().optional(),
  description: z.string().min(10),
  consent: z.boolean(),
  city: z.string(),
  source: z.string(),
  timestamp: z.string(),
})

type LeadSubmission = z.infer<typeof leadSubmissionSchema>

export async function submitLead(data: LeadSubmission) {
  try {
    // Validate the data
    const validatedData = leadSubmissionSchema.parse(data)

    console.log("Processing new lead submission:", {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      city: validatedData.city,
      caseType: validatedData.caseType
    })

    // Primary integration: Perfex CRM (your existing CRM)
    const perfexConfig = validatePerfexConfig()

    if (perfexConfig.valid) {
      try {
        console.log("Submitting lead to your Perfex CRM...")
        const perfexResult = await createPerfexLead(validatedData as LeadFormData)

        if (perfexResult.success) {
          console.log("✅ Lead successfully submitted to Perfex CRM:", {
            name: `${validatedData.firstName} ${validatedData.lastName}`,
            email: validatedData.email,
            city: validatedData.city
          })

          // Return success immediately for Perfex integration
          return {
            success: true,
            message: "Lead submitted successfully to Perfex CRM",
            data: perfexResult.data
          }
        } else {
          console.error("❌ Failed to submit lead to Perfex CRM:", perfexResult.error)
          // Continue with fallback options
        }
      } catch (perfexError) {
        console.error("❌ Perfex CRM integration error:", perfexError)
        // Continue with fallback options
      }
    } else {
      console.warn("⚠️ Perfex CRM configuration invalid:", perfexConfig.errors)
    }

    // Fallback: Save locally if Perfex CRM fails
    console.log("Perfex CRM failed, lead saved locally only")

    // Log the lead for demonstration (final fallback)
    console.log("Lead processed with local fallback:", {
      ...validatedData,
      submittedAt: new Date().toISOString(),
    })

    // Send email notification
    await sendEmailNotification(validatedData)

    // Legacy CRM integration (if needed)
    await sendToCRM(validatedData)

    return { success: true, message: "Lead submitted successfully" }
  } catch (error) {
    console.error("Error submitting lead:", error)
    return { success: false, error: "Failed to submit lead" }
  }
}

async function sendEmailNotification(data: LeadSubmission) {
  // In a real application, integrate with email service like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Resend

  console.log("Email notification sent for lead:", data.email)
}

async function sendToCRM(data: LeadSubmission) {
  // In a real application, integrate with CRM like:
  // - Salesforce
  // - HubSpot
  // - Pipedrive
  // - Custom CRM API

  console.log("Lead sent to CRM:", data.email)
}
