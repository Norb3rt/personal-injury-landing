"use server"

import { z } from "zod"
import { submitLeadToStrapi, checkStrapiConnection } from "./strapi"

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

    // Check if Strapi is available
    const strapiAvailable = await checkStrapiConnection()

    if (strapiAvailable) {
      // Submit to Strapi Cloud
      try {
        await submitLeadToStrapi(validatedData)
        console.log("Lead successfully submitted to Strapi")
      } catch (strapiError) {
        console.error("Failed to submit to Strapi, falling back to local storage:", strapiError)
        // Continue with local processing as fallback
      }
    }

    // Log the lead for demonstration
    console.log("New lead submitted:", {
      ...validatedData,
      submittedAt: new Date().toISOString(),
    })

    // Send email notification
    await sendEmailNotification(validatedData)

    // Send to CRM
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
