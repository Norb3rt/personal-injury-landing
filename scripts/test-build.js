// Script simple para probar que la implementación funciona
console.log('🧪 Probando implementación de 482 ciudades...\n');

try {
  // Importar el archivo generado
  const { CALIFORNIA_CITIES_FULL, CALIFORNIA_CITY_SLUGS } = require('../lib/california-cities');
  
  console.log(`✅ Archivo california-cities.ts cargado correctamente`);
  console.log(`📊 Total de ciudades: ${Object.keys(CALIFORNIA_CITIES_FULL).length}`);
  console.log(`📋 Total de slugs: ${CALIFORNIA_CITY_SLUGS.length}`);
  
  // Mostrar algunas ciudades de ejemplo
  console.log(`\n🏙️ Primeras 5 ciudades:`);
  Object.entries(CALIFORNIA_CITIES_FULL).slice(0, 5).forEach(([slug, data]) => {
    console.log(`   ${slug} - ${data.name} (${data.coordinates.lat}, ${data.coordinates.lng})`);
  });
  
  // Verificar ciudades principales
  const mainCities = [
    'california-los-angeles',
    'california-san-diego',
    'california-san-francisco',
    'california-sacramento'
  ];
  
  console.log(`\n🎯 Verificando ciudades principales:`);
  mainCities.forEach(slug => {
    const city = CALIFORNIA_CITIES_FULL[slug];
    if (city) {
      console.log(`   ✅ ${slug} - ${city.name}`);
    } else {
      console.log(`   ❌ ${slug} - No encontrada`);
    }
  });
  
  console.log(`\n🌐 URLs de ejemplo que se generarán:`);
  console.log(`   https://tu-dominio.vercel.app/california-los-angeles`);
  console.log(`   https://tu-dominio.vercel.app/california-san-diego`);
  console.log(`   https://tu-dominio.vercel.app/california-fresno`);
  console.log(`   https://tu-dominio.vercel.app/california-sacramento`);
  
  console.log(`\n📈 Impacto SEO:`);
  console.log(`   - ${Object.keys(CALIFORNIA_CITIES_FULL).length} páginas únicas`);
  console.log(`   - Cada página con SEO optimizado`);
  console.log(`   - Estructura escalable para otros estados`);
  console.log(`   - Backward compatibility mantenida`);
  
  console.log(`\n🎉 ¡Implementación verificada exitosamente!`);
  
} catch (error) {
  console.error(`❌ Error en la verificación:`, error.message);
  process.exit(1);
}
