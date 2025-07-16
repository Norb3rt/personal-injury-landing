/**
 * Lead Submission API Route
 * Test endpoint for submitting leads directly to Perfex CRM
 */

import { NextRequest, NextResponse } from 'next/server'
import { submitLead } from '@/lib/actions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Call the submitLead action
    const result = await submitLead(body)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in submit-lead route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
