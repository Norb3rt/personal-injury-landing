// Script para procesar California_Cities.csv y generar datos para SEO
const fs = require('fs');
const path = require('path');

// Función para convertir nombre de ciudad a slug
function cityToSlug(cityName) {
  return cityName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .trim();
}

// Función para generar keywords locales básicas
function generateLocalKeywords(cityName) {
  const baseKeywords = [
    `${cityName} personal injury attorney`,
    `${cityName} accident lawyer`,
    `${cityName} car crash attorney`,
    `${cityName} slip fall lawyer`,
    `${cityName} injury law firm`
  ];
  
  return baseKeywords;
}

// Coordenadas aproximadas para ciudades principales (las demás usarán coordenadas de California central)
const cityCoordinates = {
  'los-angeles': { lat: 34.0522, lng: -118.2437 },
  'san-diego': { lat: 32.7157, lng: -117.1611 },
  'san-francisco': { lat: 37.7749, lng: -122.4194 },
  'sacramento': { lat: 38.5816, lng: -121.4944 },
  'san-jose': { lat: 37.3382, lng: -121.8863 },
  'fresno': { lat: 36.7378, lng: -119.7871 },
  'long-beach': { lat: 34.0522, lng: -118.2437 },
  'oakland': { lat: 37.8044, lng: -122.2711 },
  'bakersfield': { lat: 35.3733, lng: -119.0187 },
  'anaheim': { lat: 33.8366, lng: -117.9143 },
  'santa-ana': { lat: 33.7455, lng: -117.8677 },
  'riverside': { lat: 33.9533, lng: -117.3962 },
  'stockton': { lat: 37.9577, lng: -121.2908 },
  'irvine': { lat: 33.6846, lng: -117.8265 },
  'chula-vista': { lat: 32.6401, lng: -117.0842 },
  'fremont': { lat: 37.5485, lng: -121.9886 },
  'san-bernardino': { lat: 34.1083, lng: -117.2898 },
  'modesto': { lat: 37.6391, lng: -120.9969 },
  'fontana': { lat: 34.0922, lng: -117.4350 },
  'oxnard': { lat: 34.1975, lng: -119.1771 }
};

// Función para obtener coordenadas (usar específicas o default de California)
function getCoordinates(citySlug) {
  return cityCoordinates[citySlug] || { lat: 36.7783, lng: -119.4179 }; // Centro de California
}

// Leer y procesar el CSV
function processCitiesCSV() {
  const csvPath = path.join(__dirname, '..', 'California_Cities.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Saltar header
  
  const cities = {};
  const cityList = [];
  
  lines.forEach((line, index) => {
    if (line.trim()) {
      const [state, cityName, objectId] = line.split(',');
      
      if (cityName && cityName.trim()) {
        const cleanCityName = cityName.trim();
        const citySlug = cityToSlug(cleanCityName);
        const fullSlug = `california-${citySlug}`;
        
        // Evitar duplicados
        if (!cities[fullSlug]) {
          const cityData = {
            name: cleanCityName,
            slug: fullSlug,
            originalSlug: citySlug, // Para backward compatibility
            state: 'CA',
            coordinates: getCoordinates(citySlug),
            keywords: [
              'personal injury lawyer',
              'car accident attorney', 
              'slip and fall lawyer',
              'medical malpractice attorney',
              'wrongful death lawyer'
            ],
            localKeywords: generateLocalKeywords(cleanCityName),
            objectId: parseInt(objectId) || index + 1
          };
          
          cities[fullSlug] = cityData;
          cityList.push(fullSlug);
        }
      }
    }
  });
  
  return { cities, cityList };
}

// Generar archivo de ciudades
function generateCitiesFile() {
  const { cities, cityList } = processCitiesCSV();
  
  console.log(`📊 Procesadas ${Object.keys(cities).length} ciudades de California`);
  console.log(`📋 Primeras 10 ciudades:`);
  cityList.slice(0, 10).forEach(slug => {
    console.log(`   - ${slug} (${cities[slug].name})`);
  });
  
  // Crear archivo TypeScript para las ciudades
  const tsContent = `// Auto-generado desde California_Cities.csv
// ${Object.keys(cities).length} ciudades de California para Programmatic SEO

export interface CityMetadata {
  name: string
  slug: string
  originalSlug: string
  state: string
  coordinates: { lat: number; lng: number }
  keywords: string[]
  localKeywords: string[]
  objectId: number
}

export const CALIFORNIA_CITIES_FULL: Record<string, CityMetadata> = ${JSON.stringify(cities, null, 2)};

export const CALIFORNIA_CITY_SLUGS = [
${cityList.map(slug => `  '${slug}'`).join(',\n')}
];

// Función para obtener datos de ciudad por slug
export function getCityData(slug: string): CityMetadata | null {
  return CALIFORNIA_CITIES_FULL[slug] || null;
}

// Función para obtener todas las ciudades
export function getAllCaliforniaCities(): CityMetadata[] {
  return Object.values(CALIFORNIA_CITIES_FULL);
}

// Función para buscar ciudad por nombre original
export function findCityByOriginalSlug(originalSlug: string): CityMetadata | null {
  return Object.values(CALIFORNIA_CITIES_FULL).find(city => city.originalSlug === originalSlug) || null;
}
`;

  // Escribir archivo
  const outputPath = path.join(__dirname, '..', 'lib', 'california-cities.ts');
  fs.writeFileSync(outputPath, tsContent);
  
  console.log(`✅ Archivo generado: lib/california-cities.ts`);
  console.log(`📈 Total de páginas SEO que se crearán: ${Object.keys(cities).length}`);
  
  return { cities, cityList };
}

// Ejecutar script
if (require.main === module) {
  try {
    generateCitiesFile();
    console.log('\n🎉 ¡Procesamiento completado exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Revisar el archivo generado: lib/california-cities.ts');
    console.log('2. Actualizar las rutas dinámicas para usar los nuevos datos');
    console.log('3. Implementar backward compatibility para URLs existentes');
  } catch (error) {
    console.error('❌ Error procesando ciudades:', error);
  }
}

module.exports = { processCitiesCSV, generateCitiesFile };
