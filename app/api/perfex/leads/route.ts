/**
 * Perfex CRM Leads API Route
 * CRUD operations for leads in Perfex CRM
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPerfexClient } from '@/lib/perfex/api'
import { getLeadsByCity, getLeadsByStaff, updateLeadStatus, getLeadStatistics } from '@/lib/perfex/leads'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const staffId = searchParams.get('staffId')
    const stats = searchParams.get('stats')

    // Return lead statistics
    if (stats === 'true') {
      const statistics = await getLeadStatistics()
      return NextResponse.json({ success: true, data: statistics })
    }

    // Get leads by city
    if (city) {
      const result = await getLeadsByCity(city)
      return NextResponse.json(result)
    }

    // Get leads by staff member
    if (staffId) {
      const result = await getLeadsByStaff(parseInt(staffId))
      return NextResponse.json(result)
    }

    // Get all leads
    const client = getPerfexClient()
    const result = await client.getLeads()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in leads GET route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('id')
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const client = getPerfexClient()

    // Update lead status specifically
    if (body.status !== undefined) {
      const result = await updateLeadStatus(parseInt(leadId), body.status)
      return NextResponse.json(result)
    }

    // General lead update
    const result = await client.updateLead(parseInt(leadId), body)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in leads PUT route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = getPerfexClient()

    const result = await client.createLead(body)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in leads POST route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('id')
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const client = getPerfexClient()
    const result = await client.deleteLead(parseInt(leadId))
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in leads DELETE route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
