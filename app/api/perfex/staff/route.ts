/**
 * Perfex CRM Staff API Route
 * CRUD operations for staff/lawyers in Perfex CRM
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllLawyers, 
  getLawyersByCity, 
  createLawyer, 
  updateLawyer, 
  getLawyerById,
  getLawyerStatistics 
} from '@/lib/perfex/staff'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const staffId = searchParams.get('id')
    const stats = searchParams.get('stats')

    // Return lawyer statistics
    if (stats === 'true') {
      const statistics = await getLawyerStatistics()
      return NextResponse.json({ success: true, data: statistics })
    }

    // Get specific lawyer by ID
    if (staffId) {
      const result = await getLawyerById(parseInt(staffId))
      return NextResponse.json(result)
    }

    // Get lawyers by city
    if (city) {
      const result = await getLawyersByCity(city)
      return NextResponse.json(result)
    }

    // Get all lawyers
    const result = await getAllLawyers()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in staff GET route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'assignedCities', 'specialization']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const result = await createLawyer(body)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in staff POST route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('id')
    
    if (!staffId) {
      return NextResponse.json(
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const result = await updateLawyer(parseInt(staffId), body)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in staff PUT route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
