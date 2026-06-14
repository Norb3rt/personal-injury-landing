import { StateDataLoader } from '../lib/data/state-loader';

async function verify() {
  console.log('Testing distance-based nearby cities logic...\n');

  const citiesToTest = ['los-angeles', 'adelanto'];

  for (const citySlug of citiesToTest) {
    console.log(`--- Nearby cities for: ${citySlug.toUpperCase()} ---`);
    const nearby = await StateDataLoader.getNearbyCities('california', citySlug, 8);
    
    if (nearby.length === 0) {
      console.log('No nearby cities found (check state configuration or logs).');
    } else {
      nearby.forEach((city, index) => {
        console.log(`${index + 1}. ${city.name} (${city.slug})`);
      });
    }
    console.log('\n');
  }
}

verify().catch(console.error);
