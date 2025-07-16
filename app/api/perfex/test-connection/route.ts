/**
 * Perfex CRM Connection Test API Route
 * Test the connection to your Perfex CRM at https://olive-porcupine-600254.hostingersite.com/
 */

import { NextRequest, NextResponse } from 'next/server'
import { testPerfexConnection } from '@/lib/perfex/simple-leads'
import { validatePerfexConfig } from '@/lib/perfex/api'

export async function GET(request: NextRequest) {
  try {
    // First validate configuration
    const configValidation = validatePerfexConfig()

    if (!configValidation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Perfex configuration is invalid',
        details: configValidation.errors
      }, { status: 400 })
    }

    // Test the actual connection to your Perfex CRM
    const testResult = await testPerfexConnection()

    if (testResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to your Perfex CRM',
        data: {
          apiUrl: process.env.PERFEX_API_URL,
          timestamp: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to your Perfex CRM',
        details: testResult.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error testing Perfex connection:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
