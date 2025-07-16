/**
 * Perfex CRM API Client - Simplified for Lead Capture
 * Connects to your existing Perfex CRM at https://olive-porcupine-600254.hostingersite.com/
 */

export interface PerfexConfig {
  apiUrl: string
  apiToken: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PerfexLead {
  name?: string
  first_name?: string
  last_name?: string
  email: string
  phonenumber: string
  city?: string
  state?: string
  country?: string
  description?: string
  status: number
  source: number
  assigned: number
  // Custom fields for personal injury leads
  custom_fields?: {
    case_type?: string
    accident_date?: string
    urgency?: string
    landing_page_source?: string
  }
}

class PerfexApiClient {
  private config: PerfexConfig
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config: PerfexConfig) {
    this.config = config
    this.baseUrl = config.apiUrl.replace(/\/$/, '') // Remove trailing slash
    this.headers = {
      'Content-Type': 'application/json',
      'authtoken': config.apiToken,
      'Accept': 'application/json'
    }
  }

  /**
   * Make a request to the Perfex API
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`

      let headers = { ...this.headers }

      const requestOptions: RequestInit = {
        method,
        headers,
      }

      if (data && (method === 'POST' || method === 'PUT')) {
        // Perfex CRM expects form-data format, not JSON
        const formData = new URLSearchParams()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value))
          }
        })
        requestOptions.body = formData
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        requestOptions.headers = headers
      }

      console.log(`Making ${method} request to: ${url}`)

      const response = await fetch(url, requestOptions)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error (${response.status}):`, errorText)
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`
        }
      }

      const responseData = await response.json()
      
      return {
        success: true,
        data: responseData
      }
    } catch (error) {
      console.error('API Request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Test the API connection to your Perfex CRM
   */
  async testConnection(): Promise<ApiResponse<any>> {
    return this.makeRequest('/leads')
  }

  /**
   * Create a new lead in your Perfex CRM
   */
  async createLead(leadData: PerfexLead): Promise<ApiResponse<any>> {
    console.log('Sending lead to Perfex CRM:', leadData)
    return this.makeRequest('/leads', 'POST', leadData)
  }
}

// Singleton instance
let perfexClient: PerfexApiClient | null = null

/**
 * Get the Perfex API client instance for your Perfex CRM
 */
export function getPerfexClient(): PerfexApiClient {
  if (!perfexClient) {
    const config: PerfexConfig = {
      apiUrl: process.env.PERFEX_API_URL || '',
      apiToken: process.env.PERFEX_API_TOKEN || ''
    }

    if (!config.apiUrl || !config.apiToken) {
      throw new Error('Perfex API configuration is missing. Please check your environment variables.')
    }

    perfexClient = new PerfexApiClient(config)
  }

  return perfexClient
}

/**
 * Validate Perfex configuration
 */
export function validatePerfexConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!process.env.PERFEX_API_URL) {
    errors.push('PERFEX_API_URL is required')
  }

  if (!process.env.PERFEX_API_TOKEN) {
    errors.push('PERFEX_API_TOKEN is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export default PerfexApiClient
