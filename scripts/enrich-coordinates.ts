import { promises as fs } from 'fs';
import path from 'path';

function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  console.log('Fetching US Cities Database from GitHub...');
  const csvUrl = 'https://raw.githubusercontent.com/kelvins/US-Cities-Database/main/csv/us_cities.csv';
  
  let csvText = '';
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    csvText = await res.text();
    console.log('Successfully fetched cities database.');
  } catch (error) {
    console.error('Failed to fetch from GitHub. Please make sure you are connected to the internet.', error);
    process.exit(1);
  }

  console.log('Parsing CSV database...');
  const lines = csvText.split('\n');
  
  const db = new Map<string, { lat: number; lng: number }>();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = parseCSVLine(line);
    if (parts.length < 7) continue;
    
    const stateCode = parts[1].toUpperCase();
    const city = parts[3];
    const lat = parseFloat(parts[5]);
    const lng = parseFloat(parts[6]);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      const key = `${stateCode}:${slugify(city)}`;
      db.set(key, { lat, lng });
    }
  }
  console.log(`Parsed ${db.size} valid city coordinates.`);

  const configPath = path.join(process.cwd(), 'data', 'metadata', 'states-config.json');
  const configRaw = await fs.readFile(configPath, 'utf-8');
  const statesConfig = JSON.parse(configRaw);
  
  const activeStates = Object.keys(statesConfig).filter(key => statesConfig[key].enabled);
  console.log('Active states to process:', activeStates);

  for (const stateKey of activeStates) {
    const stateConfig = statesConfig[stateKey];
    const stateCode = stateConfig.abbreviation.toUpperCase();
    const stateName = stateConfig.name;
    const jsonPath = path.join(process.cwd(), 'data', 'states', `${stateKey}-cities.json`);
    
    console.log(`Processing ${stateName} (${stateCode}) in file ${jsonPath}...`);
    
    let cities: any[] = [];
    try {
      const citiesRaw = await fs.readFile(jsonPath, 'utf-8');
      cities = JSON.parse(citiesRaw.replace(/^\uFEFF/, ''));
    } catch (err) {
      console.error(`Error reading ${jsonPath}, skipping.`, err);
      continue;
    }
    
    let matchedCount = 0;
    let fallbackCount = 0;
    let missingCount = 0;
    
    for (const cityObj of cities) {
      const citySlug = slugify(cityObj.city);
      const key = `${stateCode}:${citySlug}`;
      
      let lat = 0;
      let lng = 0;
      
      if (db.has(key)) {
        const coords = db.get(key)!;
        lat = coords.lat;
        lng = coords.lng;
        matchedCount++;
      } else {
        console.log(`City not found in CSV database: ${cityObj.city}, ${stateName}. Querying Nominatim...`);
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityObj.city + ', ' + stateName)}&format=json&limit=1`;
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'LawProactive-Programmatic-SEO-Agent/1.0 (contact@lawproactive.com)'
            }
          });
          
          if (response.ok) {
            const results = await response.json() as any[];
            if (results && results.length > 0) {
              lat = parseFloat(results[0].lat);
              lng = parseFloat(results[0].lon);
              fallbackCount++;
              console.log(`  -> Found coordinates: ${lat}, ${lng}`);
            } else {
              console.warn(`  -> No results found on Nominatim for ${cityObj.city}`);
              missingCount++;
            }
          } else {
            console.warn(`  -> Nominatim query failed with status: ${response.status}`);
            missingCount++;
          }
        } catch (osmErr) {
          console.error(`  -> Error querying Nominatim for ${cityObj.city}:`, osmErr);
          missingCount++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (lat !== 0 && lng !== 0) {
        cityObj.latitude = lat;
        cityObj.longitude = lng;
      }
    }
    
    await fs.writeFile(jsonPath, JSON.stringify(cities, null, 4), 'utf-8');
    console.log(`Saved ${stateName} cities data.`);
    console.log(`  Summary: Matched: ${matchedCount}, Nominatim Fallback: ${fallbackCount}, Missing: ${missingCount}\n`);
  }
  
  console.log('All state cities enriched successfully!');
}

main().catch(err => {
  console.error('Unexpected error in script:', err);
  process.exit(1);
});
