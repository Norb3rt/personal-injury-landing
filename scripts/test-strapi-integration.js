// Test script for Strapi Cloud integration
// Run with: node scripts/test-strapi-integration.js

require('dotenv').config({ path: '.env.local' });

const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_URL || !STRAPI_API_TOKEN) {
  console.error('❌ Missing Strapi configuration in .env.local');
  console.log('Required variables:');
  console.log('- STRAPI_API_URL=https://your-project.strapiapp.com/api');
  console.log('- STRAPI_API_TOKEN=your-api-token');
  process.exit(1);
}

console.log('🧪 Testing Strapi Cloud Integration\n');
console.log(`📡 API URL: ${STRAPI_API_URL}`);
console.log(`🔑 Token: ${STRAPI_API_TOKEN.substring(0, 10)}...\n`);

// Test functions
async function testConnection() {
  console.log('1️⃣ Testing API Connection...');
  try {
    const response = await fetch(`${STRAPI_API_URL}/cities?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('✅ Connection successful');
      return true;
    } else {
      console.log(`❌ Connection failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
    return false;
  }
}

async function testCitiesEndpoint() {
  console.log('\n2️⃣ Testing Cities Endpoint...');
  try {
    const response = await fetch(`${STRAPI_API_URL}/cities`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.data.length} cities`);
      
      if (data.data.length > 0) {
        const firstCity = data.data[0];
        console.log(`   📍 Sample city: ${firstCity.attributes.name} (${firstCity.attributes.slug})`);
        return data.data;
      } else {
        console.log('⚠️  No cities found - you need to add city data');
        return [];
      }
    } else {
      console.log(`❌ Cities endpoint failed: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.log(`❌ Cities endpoint error: ${error.message}`);
    return [];
  }
}

async function testSpecificCity(citySlug = 'los-angeles') {
  console.log(`\n3️⃣ Testing Specific City (${citySlug})...`);
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/cities?filters[slug][$eq]=${citySlug}&populate=*`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.data.length > 0) {
        const city = data.data[0];
        console.log('✅ City data retrieved successfully');
        console.log(`   📍 Name: ${city.attributes.name}`);
        console.log(`   📝 SEO Title: ${city.attributes.seoTitle || 'Not set'}`);
        console.log(`   🗺️  Coordinates: ${JSON.stringify(city.attributes.coordinates || 'Not set')}`);
        console.log(`   🏷️  Keywords: ${city.attributes.seoKeywords?.length || 0} keywords`);
        return city;
      } else {
        console.log(`❌ City '${citySlug}' not found`);
        return null;
      }
    } else {
      console.log(`❌ City query failed: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ City query error: ${error.message}`);
    return null;
  }
}

async function testLeadSubmission() {
  console.log('\n4️⃣ Testing Lead Submission...');
  
  const testLead = {
    data: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-123-4567',
      caseType: 'Car Accident',
      description: 'Test lead submission from integration script',
      city: 'Los Angeles',
      source: 'integration-test',
      status: 'new',
      consent: true,
      submittedAt: new Date().toISOString(),
    }
  };

  try {
    const response = await fetch(`${STRAPI_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testLead),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Lead submission successful');
      console.log(`   🆔 Lead ID: ${data.data.id}`);
      console.log(`   📧 Email: ${data.data.attributes.email}`);
      return data.data;
    } else {
      const errorData = await response.text();
      console.log(`❌ Lead submission failed: ${response.status}`);
      console.log(`   Error: ${errorData}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Lead submission error: ${error.message}`);
    return null;
  }
}

async function testPracticeAreas() {
  console.log('\n5️⃣ Testing Practice Areas...');
  try {
    const response = await fetch(`${STRAPI_API_URL}/practice-areas`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.data.length} practice areas`);
      
      if (data.data.length > 0) {
        data.data.forEach(area => {
          console.log(`   ⚖️  ${area.attributes.name} (${area.attributes.slug})`);
        });
      }
      return data.data;
    } else {
      console.log(`❌ Practice areas failed: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.log(`❌ Practice areas error: ${error.message}`);
    return [];
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Strapi Integration Tests\n');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Connection failed - check your Strapi configuration');
    return;
  }

  const cities = await testCitiesEndpoint();
  
  if (cities.length > 0) {
    await testSpecificCity(cities[0].attributes.slug);
  } else {
    await testSpecificCity(); // Test with default
  }

  await testLeadSubmission();
  await testPracticeAreas();

  console.log('\n🎉 Integration tests complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. If any tests failed, check your Strapi configuration');
  console.log('2. Ensure content types are created correctly');
  console.log('3. Verify API permissions are set properly');
  console.log('4. Add sample city data if none exists');
  console.log('5. Test your Next.js app: npm run dev');
}

// Run the tests
runAllTests().catch(console.error);
