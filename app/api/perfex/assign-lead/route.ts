/**
 * Perfex CRM Lead Assignment API Route
 * Handle lead assignment and reassignment operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { assignLeadToLawyer, reassignLead, testAssignmentLogic } from '@/lib/perfex/assignment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, leadData, leadId, newLawyerStaffId, city } = body

    switch (action) {
      case 'assign':
        if (!leadData) {
          return NextResponse.json(
            { success: false, error: 'Lead data is required for assignment' },
            { status: 400 }
          )
        }

        const assignmentResult = await assignLeadToLawyer(leadData)
        return NextResponse.json(assignmentResult)

      case 'reassign':
        if (!leadId || !newLawyerStaffId) {
          return NextResponse.json(
            { success: false, error: 'Lead ID and new lawyer staff ID are required for reassignment' },
            { status: 400 }
          )
        }

        const reassignmentResult = await reassignLead(leadId, newLawyerStaffId)
        return NextResponse.json(reassignmentResult)

      case 'test':
        if (!city) {
          return NextResponse.json(
            { success: false, error: 'City is required for testing assignment logic' },
            { status: 400 }
          )
        }

        const testResult = await testAssignmentLogic(city)
        return NextResponse.json({ success: true, data: testResult })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use "assign", "reassign", or "test"' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in assign-lead route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
