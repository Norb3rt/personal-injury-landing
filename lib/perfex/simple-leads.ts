/**
 * Perfex CRM Lead Capture - Simplified
 * Sends leads directly to your Perfex CRM at https://olive-porcupine-600254.hostingersite.com/
 */

import { getPerfexClient, type ApiResponse } from './api'

export interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  caseType: string
  accidentDate?: string
  urgency: string
  description: string
  city: string
  source: string
  timestamp: string
}

/**
 * Case type mapping for Perfex CRM
 */
export const CASE_TYPE_MAPPING = {
  'car-accident': 'Car Accident',
  'slip-fall': 'Slip & Fall',
  'medical-malpractice': 'Medical Malpractice',
  'workplace-injury': 'Workplace Injury',
  'product-liability': 'Product Liability',
  'wrongful-death': 'Wrongful Death',
  'other': 'Other'
} as const

/**
 * Urgency level mapping
 */
export const URGENCY_MAPPING = {
  'immediate': 'High',
  'urgent': 'High',
  'normal': 'Medium',
  'planning': 'Low'
} as const

/**
 * Convert form data to Perfex lead format
 */
export function convertFormDataToPerfexLead(formData: LeadFormData): any {
  // Crear descripción enriquecida con todos los datos
  const caseTypeText = CASE_TYPE_MAPPING[formData.caseType as keyof typeof CASE_TYPE_MAPPING] || formData.caseType
  const urgencyText = URGENCY_MAPPING[formData.urgency as keyof typeof URGENCY_MAPPING] || formData.urgency

  const enrichedDescription = `
📋 CASE DETAILS:
• Type of Case: ${caseTypeText}
• When did it occur: ${formData.accidentDate || 'Not specified'}
• Urgency: ${urgencyText}

📝 DESCRIPTION:
${formData.description}
`.trim()

  const leadData = {
    name: `${formData.firstName} ${formData.lastName}`,
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phonenumber: formData.phone,
    city: formData.city,
    state: 'California', // Since this is for California cities
    country: 'United States',
    description: enrichedDescription,
    status: 1, // New lead
    source: 4, // Personal Injury source
    assigned: 1, // Assign to admin user (ID 1) by default
    // Intentar enviar campos personalizados también
    case_type: caseTypeText,
    accident_date: formData.accidentDate,
    urgency: urgencyText,
    landing_page_source: formData.source
  }

  // Log para debugging
  console.log('📋 Datos que se envían a Perfex CRM:', {
    caseType: leadData.case_type,
    accidentDate: leadData.accident_date,
    urgency: leadData.urgency,
    description: leadData.description
  })

  return leadData
}

/**
 * Create a new lead in your Perfex CRM
 */
export async function createPerfexLead(formData: LeadFormData): Promise<ApiResponse<any>> {
  try {
    const client = getPerfexClient()
    const leadData = convertFormDataToPerfexLead(formData)
    
    console.log('Creating lead in Perfex CRM:', {
      name: leadData.name,
      email: leadData.email,
      city: leadData.city,
      caseType: leadData.custom_fields?.case_type
    })

    const result = await client.createLead(leadData)
    
    if (result.success) {
      console.log('✅ Lead created successfully in Perfex CRM')
    } else {
      console.error('❌ Failed to create lead in Perfex CRM:', result.error)
    }

    return result
  } catch (error) {
    console.error('Error creating Perfex lead:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Test the connection to your Perfex CRM
 */
export async function testPerfexConnection(): Promise<ApiResponse<any>> {
  try {
    const client = getPerfexClient()
    const result = await client.testConnection()
    
    if (result.success) {
      console.log('✅ Successfully connected to Perfex CRM')
    } else {
      console.error('❌ Failed to connect to Perfex CRM:', result.error)
    }
    
    return result
  } catch (error) {
    console.error('Error testing Perfex connection:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
