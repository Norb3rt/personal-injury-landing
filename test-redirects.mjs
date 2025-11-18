// Test script to validate 301 redirects
// Run this after starting the server with: npm run start

const testUrls = [
  // City pages
  { old: '/california/los-angeles', new: '/personal-injury-lawyer/california/los-angeles' },
  { old: '/california/san-francisco', new: '/personal-injury-lawyer/california/san-francisco' },
  { old: '/california/san-diego', new: '/personal-injury-lawyer/california/san-diego' },
  { old: '/texas/houston', new: '/personal-injury-lawyer/texas/houston' },
  { old: '/florida/miami', new: '/personal-injury-lawyer/florida/miami' },
  
  // Practice area pages
  { old: '/california/los-angeles/car-accident', new: '/personal-injury-lawyer/california/los-angeles/car-accident' },
  { old: '/california/san-francisco/slip-and-fall', new: '/personal-injury-lawyer/california/san-francisco/slip-and-fall' },
  { old: '/texas/houston/medical-malpractice', new: '/personal-injury-lawyer/texas/houston/medical-malpractice' },
]

const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'

async function testRedirect(oldPath, expectedNewPath) {
  const url = `${baseUrl}${oldPath}`
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual'
    })

    const status = response.status
    const location = response.headers.get('location')

    if (status === 301) {
      const expectedLocation = expectedNewPath.startsWith('http') 
        ? expectedNewPath 
        : `${baseUrl}${expectedNewPath}`
      
      if (location === expectedNewPath || location === expectedLocation) {
        console.log(`✅ PASS: ${oldPath} → ${location} (301)`)
        return true
      } else {
        console.log(`❌ FAIL: ${oldPath} redirects to ${location} (expected ${expectedNewPath})`)
        return false
      }
    } else if (status === 308) {
      console.log(`⚠️  WARN: ${oldPath} → ${location} (308 instead of 301)`)
      return true
    } else {
      console.log(`❌ FAIL: ${oldPath} returned status ${status} (expected 301)`)
      return false
    }
  } catch (error) {
    console.log(`❌ ERROR: ${oldPath} - ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log(`\n🧪 Testing redirects on ${baseUrl}\n`)
  console.log('Make sure the server is running: npm run start\n')

  let passed = 0
  let failed = 0

  for (const { old, new: newPath } of testUrls) {
    const result = await testRedirect(old, newPath)
    if (result) {
      passed++
    } else {
      failed++
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testUrls.length} tests\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
