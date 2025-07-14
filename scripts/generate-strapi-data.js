// Script to generate sample city data for Strapi Cloud
// Run with: node scripts/generate-strapi-data.js

const fs = require('fs');
const path = require('path');

// California cities with comprehensive data for programmatic SEO
const californiaCities = [
  {
    name: "Los Angeles",
    slug: "los-angeles",
    state: "CA",
    population: 3898747,
    coordinates: { lat: 34.0522, lng: -118.2437 },
    localKeywords: [
      "Hollywood accident lawyer",
      "Beverly Hills injury attorney", 
      "Santa Monica personal injury",
      "Downtown LA accident lawyer",
      "West Hollywood injury lawyer"
    ]
  },
  {
    name: "Orange County",
    slug: "orange-county", 
    state: "CA",
    population: 3175692,
    coordinates: { lat: 33.7175, lng: -117.8311 },
    localKeywords: [
      "Anaheim injury lawyer",
      "Irvine accident attorney",
      "Newport Beach personal injury",
      "Huntington Beach injury lawyer",
      "Costa Mesa accident attorney"
    ]
  },
  {
    name: "San Diego",
    slug: "san-diego",
    state: "CA", 
    population: 1386932,
    coordinates: { lat: 32.7157, lng: -117.1611 },
    localKeywords: [
      "La Jolla injury lawyer",
      "Coronado accident attorney",
      "Chula Vista personal injury",
      "Mission Valley injury lawyer",
      "Pacific Beach accident attorney"
    ]
  },
  {
    name: "San Francisco",
    slug: "san-francisco",
    state: "CA",
    population: 873965,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    localKeywords: [
      "SOMA injury lawyer",
      "Mission District accident attorney",
      "Financial District personal injury",
      "Castro injury lawyer",
      "Nob Hill accident attorney"
    ]
  },
  {
    name: "Sacramento",
    slug: "sacramento",
    state: "CA",
    population: 524943,
    coordinates: { lat: 38.5816, lng: -121.4944 },
    localKeywords: [
      "Midtown Sacramento injury lawyer",
      "East Sacramento accident attorney",
      "Land Park personal injury",
      "Natomas injury lawyer",
      "Elk Grove accident attorney"
    ]
  }
];

// Practice areas data
const practiceAreas = [
  "Car Accidents",
  "Slip & Fall", 
  "Medical Malpractice",
  "Workplace Injuries",
  "Product Liability",
  "Wrongful Death",
  "Motorcycle Accidents",
  "Truck Accidents",
  "Pedestrian Accidents",
  "Bicycle Accidents"
];

// Sample testimonials pool
const testimonialPool = [
  {
    name: "Maria Rodriguez",
    rating: 5,
    review: "Excellent service, got me the settlement I deserved after my car accident.",
    caseType: "Car Accident"
  },
  {
    name: "John Smith", 
    rating: 5,
    review: "Professional and caring attorneys who fought for my rights.",
    caseType: "Slip & Fall"
  },
  {
    name: "Sarah Johnson",
    rating: 5,
    review: "They handled my medical malpractice case with expertise and compassion.",
    caseType: "Medical Malpractice"
  },
  {
    name: "David Chen",
    rating: 5,
    review: "Outstanding results for my workplace injury claim.",
    caseType: "Workplace Injury"
  },
  {
    name: "Lisa Williams",
    rating: 5,
    review: "Highly recommend for anyone needing a personal injury lawyer.",
    caseType: "Product Liability"
  }
];

// Generate city data with SEO optimization
function generateCityData(city) {
  const baseKeywords = [
    `personal injury lawyer ${city.name}`,
    `accident attorney ${city.name}`,
    `car accident lawyer ${city.name}`,
    `slip and fall attorney ${city.name}`,
    `medical malpractice lawyer ${city.name}`,
    `wrongful death attorney ${city.name}`
  ];

  // Random testimonials (2-3 per city)
  const shuffledTestimonials = [...testimonialPool].sort(() => 0.5 - Math.random());
  const cityTestimonials = shuffledTestimonials.slice(0, Math.floor(Math.random() * 2) + 2);

  return {
    name: city.name,
    slug: city.slug,
    state: city.state,
    population: city.population,
    seoTitle: `Personal Injury Lawyer in ${city.name}, CA | Free Consultation | No Win No Fee`,
    seoDescription: `Injured in ${city.name}? Get the settlement you deserve. Connect with top-rated personal injury attorneys in ${city.name}, California. Free case evaluation. No win, no fee guarantee.`,
    seoKeywords: baseKeywords,
    localKeywords: city.localKeywords,
    coordinates: city.coordinates,
    practiceAreas: practiceAreas,
    testimonials: cityTestimonials,
    localStats: {
      averageSettlement: `$${Math.floor(Math.random() * 200000 + 75000).toLocaleString()}`,
      casesWon: Math.floor(Math.random() * 50 + 85),
      yearsExperience: Math.floor(Math.random() * 10 + 10)
    }
  };
}

// Generate all city data
const generatedCities = californiaCities.map(generateCityData);

// Create output directory
const outputDir = path.join(__dirname, '..', 'strapi-data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write individual city files
generatedCities.forEach(city => {
  const filename = `${city.slug}.json`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(city, null, 2));
  console.log(`✅ Generated: ${filename}`);
});

// Write bulk import file
const bulkData = {
  cities: generatedCities,
  practiceAreas: [
    {
      name: "Car Accidents",
      slug: "car-accidents",
      description: "Expert legal representation for vehicle collision victims",
      icon: "🚗",
      seoTitle: "Car Accident Lawyer | Auto Collision Attorney",
      seoDescription: "Injured in a car accident? Get expert legal help. Free consultation, no win no fee.",
      keywords: ["car accident lawyer", "auto collision attorney", "vehicle accident"],
      averageSettlement: "$85,000"
    },
    {
      name: "Slip & Fall",
      slug: "slip-and-fall",
      description: "Premises liability and slip and fall injury claims",
      icon: "⚠️", 
      seoTitle: "Slip and Fall Lawyer | Premises Liability Attorney",
      seoDescription: "Injured in a slip and fall? Property owners may be liable. Free case evaluation.",
      keywords: ["slip and fall lawyer", "premises liability", "property accident"],
      averageSettlement: "$65,000"
    },
    {
      name: "Medical Malpractice",
      slug: "medical-malpractice",
      description: "Healthcare provider negligence and malpractice cases",
      icon: "🏥",
      seoTitle: "Medical Malpractice Lawyer | Healthcare Negligence Attorney", 
      seoDescription: "Victim of medical malpractice? Get justice for healthcare negligence. Expert legal help.",
      keywords: ["medical malpractice lawyer", "healthcare negligence", "doctor error"],
      averageSettlement: "$250,000"
    }
  ]
};

fs.writeFileSync(
  path.join(outputDir, 'bulk-import.json'), 
  JSON.stringify(bulkData, null, 2)
);

console.log('\n🎉 Strapi data generation complete!');
console.log('\nFiles created:');
console.log('📁 strapi-data/');
console.log('  ├── bulk-import.json (Complete dataset)');
generatedCities.forEach(city => {
  console.log(`  ├── ${city.slug}.json`);
});

console.log('\n📋 Next steps:');
console.log('1. Copy the JSON data from bulk-import.json');
console.log('2. Import into your Strapi Cloud instance');
console.log('3. Or manually create entries using individual city files');
console.log('4. Ensure all entries are published in Strapi');

console.log('\n🔗 API Test URLs:');
console.log('Replace YOUR_STRAPI_URL with your actual Strapi Cloud URL:');
console.log('• All cities: YOUR_STRAPI_URL/api/cities');
console.log('• Los Angeles: YOUR_STRAPI_URL/api/cities?filters[slug][$eq]=los-angeles');
console.log('• Practice areas: YOUR_STRAPI_URL/api/practice-areas');
