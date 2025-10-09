/**
 * Test Script: Verify Source Field is "Personal Injury"
 * 
 * This script tests that leads submitted from the landing page
 * have their source field set to "Personal Injury" instead of "Landing Page"
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const CRM_URL = process.env.NEXT_PUBLIC_CRM_API_URL || 'http://localhost:3000'

interface TestResult {
  testName: string
  passed: boolean
  expectedSource: string
  actualSource?: string
  leadId?: string
  error?: string
}

async function testSourceField(): Promise<TestResult> {
  try {
    console.log('🧪 Testing source field assignment...')
    
    const testData = {
      firstName: 'Source',
      lastName: 'Test',
      email: 'source.test@example.com',
      phone: '5551234567',
      caseType: 'car-accident',
      urgency: 'medium',
      description: 'This is a test to verify the source field is set to Personal Injury',
      city: 'Los Angeles',
      state: 'California',
      consent: true,
      timestamp: new Date().toISOString()
      // Note: NOT sending source field - should default to "Personal Injury"
    }

    console.log('📝 Submitting test lead without source field...')
    console.log('   Expected: source should default to "Personal Injury"')

    const response = await fetch(`${CRM_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit lead')
    }

    const result = await response.json()
    const leadId = result.data?.id
    const actualSource = result.data?.source

    console.log(`✅ Lead created with ID: ${leadId}`)
    console.log(`📊 Source field value: "${actualSource}"`)

    if (actualSource === 'Personal Injury') {
      console.log('✅ TEST PASSED: Source field is correctly set to "Personal Injury"')
      return {
        testName: 'Source Field Default Value',
        passed: true,
        expectedSource: 'Personal Injury',
        actualSource: actualSource,
        leadId: leadId
      }
    } else {
      console.log(`❌ TEST FAILED: Expected "Personal Injury" but got "${actualSource}"`)
      return {
        testName: 'Source Field Default Value',
        passed: false,
        expectedSource: 'Personal Injury',
        actualSource: actualSource,
        leadId: leadId,
        error: `Expected "Personal Injury" but got "${actualSource}"`
      }
    }
  } catch (error) {
    console.log('❌ TEST ERROR:', error)
    return {
      testName: 'Source Field Default Value',
      passed: false,
      expectedSource: 'Personal Injury',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function testExplicitSourceField(): Promise<TestResult> {
  try {
    console.log('\n🧪 Testing explicit source field assignment...')
    
    const testData = {
      firstName: 'Explicit',
      lastName: 'Test',
      email: 'explicit.test@example.com',
      phone: '5551234567',
      caseType: 'slip-fall',
      urgency: 'high',
      description: 'This is a test with explicit source field set to Personal Injury',
      city: 'San Francisco',
      state: 'California',
      source: 'Personal Injury', // Explicitly setting source
      consent: true,
      timestamp: new Date().toISOString()
    }

    console.log('📝 Submitting test lead with explicit source="Personal Injury"...')

    const response = await fetch(`${CRM_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit lead')
    }

    const result = await response.json()
    const leadId = result.data?.id
    const actualSource = result.data?.source

    console.log(`✅ Lead created with ID: ${leadId}`)
    console.log(`📊 Source field value: "${actualSource}"`)

    if (actualSource === 'Personal Injury') {
      console.log('✅ TEST PASSED: Source field is correctly set to "Personal Injury"')
      return {
        testName: 'Explicit Source Field Value',
        passed: true,
        expectedSource: 'Personal Injury',
        actualSource: actualSource,
        leadId: leadId
      }
    } else {
      console.log(`❌ TEST FAILED: Expected "Personal Injury" but got "${actualSource}"`)
      return {
        testName: 'Explicit Source Field Value',
        passed: false,
        expectedSource: 'Personal Injury',
        actualSource: actualSource,
        leadId: leadId,
        error: `Expected "Personal Injury" but got "${actualSource}"`
      }
    }
  } catch (error) {
    console.log('❌ TEST ERROR:', error)
    return {
      testName: 'Explicit Source Field Value',
      passed: false,
      expectedSource: 'Personal Injury',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Source Field Tests...\n')
  console.log(`Testing CRM API at: ${CRM_URL}\n`)
  console.log('='.repeat(60))

  const results: TestResult[] = []

  // Test 1: Default source field
  const test1 = await testSourceField()
  results.push(test1)

  // Test 2: Explicit source field
  const test2 = await testExplicitSourceField()
  results.push(test2)

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Summary')
  console.log('='.repeat(60))

  results.forEach(result => {
    const status = result.passed ? '✅' : '❌'
    console.log(`\n${status} ${result.testName}`)
    console.log(`   Expected: "${result.expectedSource}"`)
    console.log(`   Actual:   "${result.actualSource || 'N/A'}"`)
    if (result.leadId) {
      console.log(`   Lead ID:  ${result.leadId}`)
    }
    if (result.error) {
      console.log(`   Error:    ${result.error}`)
    }
  })

  const allPassed = results.every(r => r.passed)
  const passedCount = results.filter(r => r.passed).length
  const totalCount = results.length

  console.log('\n' + '='.repeat(60))
  if (allPassed) {
    console.log(`✅ ALL TESTS PASSED (${passedCount}/${totalCount})`)
  } else {
    console.log(`❌ SOME TESTS FAILED (${passedCount}/${totalCount} passed)`)
  }
  console.log('='.repeat(60))

  // Cleanup instructions
  console.log('\n' + '='.repeat(60))
  console.log('🧹 Cleanup')
  console.log('='.repeat(60))
  console.log('Test leads created:')
  results.forEach(result => {
    if (result.leadId) {
      console.log(`  - ${result.leadId}`)
    }
  })
  console.log('\nThese test leads will be deleted automatically.')

  return results
}

// Run tests and cleanup
runTests()
  .then(async (results) => {
    // Auto-cleanup: Delete test leads
    console.log('\n🧹 Cleaning up test data...')
    
    const leadIds = results
      .filter(r => r.leadId)
      .map(r => r.leadId)
    
    if (leadIds.length > 0) {
      try {
        // Import Supabase client
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { error } = await supabase
          .from('leads')
          .delete()
          .in('id', leadIds)

        if (error) {
          console.log('❌ Error deleting test leads:', error.message)
        } else {
          console.log(`✅ Deleted ${leadIds.length} test lead(s)`)
        }
      } catch (error) {
        console.log('❌ Error during cleanup:', error)
      }
    }

    console.log('\n✅ Tests complete!\n')
  })
  .catch(console.error)

