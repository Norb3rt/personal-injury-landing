/**
 * Perfex CRM Reports API Route
 * Generate analytics and reports for leads and lawyer performance
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPerfexClient } from '@/lib/perfex/api'
import { getLeadStatistics } from '@/lib/perfex/leads'
import { getLawyerStatistics } from '@/lib/perfex/staff'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const staffId = searchParams.get('staffId')
    const city = searchParams.get('city')

    switch (reportType) {
      case 'overview':
        return await generateOverviewReport()
      
      case 'conversion':
        return await generateConversionReport(startDate, endDate, staffId)
      
      case 'performance':
        return await generatePerformanceReport(startDate, endDate)
      
      case 'city-analysis':
        return await generateCityAnalysisReport(startDate, endDate)
      
      case 'lawyer-performance':
        return await generateLawyerPerformanceReport(staffId, startDate, endDate)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid report type' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateOverviewReport() {
  try {
    const leadStats = await getLeadStatistics()
    const lawyerStats = await getLawyerStatistics()
    
    const report = {
      summary: {
        totalLeads: leadStats.total,
        totalLawyers: lawyerStats.total,
        activeLawyers: lawyerStats.active,
        conversionRate: leadStats.total > 0 ? Math.round((leadStats.converted / leadStats.total) * 100) : 0,
        citiesCovered: lawyerStats.totalCitiesCovered
      },
      leadBreakdown: {
        new: leadStats.new,
        contacted: leadStats.contacted,
        qualified: leadStats.qualified,
        converted: leadStats.converted,
        lost: leadStats.lost
      },
      trends: {
        // Mock trend data - in production, calculate from historical data
        leadsThisMonth: leadStats.total,
        leadsLastMonth: Math.max(0, leadStats.total - 15),
        conversionTrend: '+12%',
        responseTrend: '+8%'
      }
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Error generating overview report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate overview report' },
      { status: 500 }
    )
  }
}

async function generateConversionReport(startDate?: string | null, endDate?: string | null, staffId?: string | null) {
  try {
    const client = getPerfexClient()
    
    // Build filters
    const filters: any = {}
    if (staffId) filters.assigned = parseInt(staffId)
    
    const result = await client.getLeads(filters)
    
    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: 'Failed to fetch leads data' })
    }

    const leads = result.data
    
    // Calculate conversion metrics
    const totalLeads = leads.length
    const convertedLeads = leads.filter(lead => lead.status === 4).length
    const qualifiedLeads = leads.filter(lead => lead.status === 3).length
    const contactedLeads = leads.filter(lead => lead.status === 2).length
    const lostLeads = leads.filter(lead => lead.status === 5).length

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
    const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
    const contactRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0
    const lossRate = totalLeads > 0 ? (lostLeads / totalLeads) * 100 : 0

    const report = {
      metrics: {
        totalLeads,
        convertedLeads,
        qualifiedLeads,
        contactedLeads,
        lostLeads,
        conversionRate: Math.round(conversionRate * 100) / 100,
        qualificationRate: Math.round(qualificationRate * 100) / 100,
        contactRate: Math.round(contactRate * 100) / 100,
        lossRate: Math.round(lossRate * 100) / 100
      },
      funnel: [
        { stage: 'New Leads', count: leads.filter(lead => lead.status === 1).length },
        { stage: 'Contacted', count: contactedLeads },
        { stage: 'Qualified', count: qualifiedLeads },
        { stage: 'Converted', count: convertedLeads }
      ]
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Error generating conversion report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate conversion report' },
      { status: 500 }
    )
  }
}

async function generatePerformanceReport(startDate?: string | null, endDate?: string | null) {
  try {
    const client = getPerfexClient()
    
    // Get all leads and staff
    const [leadsResult, staffResult] = await Promise.all([
      client.getLeads(),
      client.getStaff()
    ])

    if (!leadsResult.success || !staffResult.success) {
      return NextResponse.json({ success: false, error: 'Failed to fetch data' })
    }

    const leads = leadsResult.data || []
    const staff = staffResult.data || []

    // Calculate performance metrics per lawyer
    const lawyerPerformance = staff.map(lawyer => {
      const lawyerLeads = leads.filter(lead => lead.assigned === lawyer.staffid)
      const converted = lawyerLeads.filter(lead => lead.status === 4).length
      const total = lawyerLeads.length
      const conversionRate = total > 0 ? (converted / total) * 100 : 0

      return {
        lawyerId: lawyer.staffid,
        name: `${lawyer.firstname} ${lawyer.lastname}`,
        totalLeads: total,
        convertedLeads: converted,
        conversionRate: Math.round(conversionRate * 100) / 100,
        activeLeads: lawyerLeads.filter(lead => lead.status < 4 && lead.status !== 5).length
      }
    }).sort((a, b) => b.conversionRate - a.conversionRate)

    const report = {
      topPerformers: lawyerPerformance.slice(0, 5),
      averageConversionRate: lawyerPerformance.length > 0 
        ? Math.round((lawyerPerformance.reduce((sum, lawyer) => sum + lawyer.conversionRate, 0) / lawyerPerformance.length) * 100) / 100
        : 0,
      totalLeadsProcessed: leads.length,
      totalConversions: leads.filter(lead => lead.status === 4).length
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Error generating performance report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate performance report' },
      { status: 500 }
    )
  }
}

async function generateCityAnalysisReport(startDate?: string | null, endDate?: string | null) {
  try {
    const client = getPerfexClient()
    const result = await client.getLeads()

    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: 'Failed to fetch leads data' })
    }

    const leads = result.data
    
    // Group leads by city
    const cityStats: Record<string, any> = {}
    
    leads.forEach(lead => {
      const city = lead.city || 'Unknown'
      if (!cityStats[city]) {
        cityStats[city] = {
          city,
          totalLeads: 0,
          convertedLeads: 0,
          qualifiedLeads: 0,
          lostLeads: 0,
          conversionRate: 0
        }
      }
      
      cityStats[city].totalLeads++
      if (lead.status === 4) cityStats[city].convertedLeads++
      if (lead.status === 3) cityStats[city].qualifiedLeads++
      if (lead.status === 5) cityStats[city].lostLeads++
    })

    // Calculate conversion rates
    Object.values(cityStats).forEach((city: any) => {
      city.conversionRate = city.totalLeads > 0 
        ? Math.round((city.convertedLeads / city.totalLeads) * 100 * 100) / 100
        : 0
    })

    const sortedCities = Object.values(cityStats).sort((a: any, b: any) => b.totalLeads - a.totalLeads)

    const report = {
      topCities: sortedCities.slice(0, 10),
      totalCities: sortedCities.length,
      averageLeadsPerCity: sortedCities.length > 0 
        ? Math.round(leads.length / sortedCities.length)
        : 0
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Error generating city analysis report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate city analysis report' },
      { status: 500 }
    )
  }
}

async function generateLawyerPerformanceReport(staffId?: string | null, startDate?: string | null, endDate?: string | null) {
  try {
    if (!staffId) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' })
    }

    const client = getPerfexClient()
    const result = await client.getLeads({ assigned: parseInt(staffId) })

    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: 'Failed to fetch lawyer leads' })
    }

    const leads = result.data
    
    const report = {
      totalLeads: leads.length,
      newLeads: leads.filter(lead => lead.status === 1).length,
      contactedLeads: leads.filter(lead => lead.status === 2).length,
      qualifiedLeads: leads.filter(lead => lead.status === 3).length,
      convertedLeads: leads.filter(lead => lead.status === 4).length,
      lostLeads: leads.filter(lead => lead.status === 5).length,
      conversionRate: leads.length > 0 
        ? Math.round((leads.filter(lead => lead.status === 4).length / leads.length) * 100 * 100) / 100
        : 0,
      recentActivity: leads
        .sort((a, b) => new Date(b.dateadded).getTime() - new Date(a.dateadded).getTime())
        .slice(0, 10)
        .map(lead => ({
          id: lead.id,
          name: lead.name,
          status: lead.status,
          dateAdded: lead.dateadded
        }))
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Error generating lawyer performance report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate lawyer performance report' },
      { status: 500 }
    )
  }
}
