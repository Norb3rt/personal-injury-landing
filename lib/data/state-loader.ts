import { promises as fs } from 'fs';
import path from 'path';
import {
  BaseLocation,
  StateConfig,
  ProcessedLocation,
  StateDataResult,
  DataAdapter,
  Coordinates
} from '../types/location.types';

/**
 * Adaptador para archivos JSON
 */
export class JSONAdapter implements DataAdapter {
  private readonly dataPath = path.join(process.cwd(), 'data', 'states');

  async loadLocations(state: string): Promise<BaseLocation[]> {
    try {
      const jsonPath = path.join(this.dataPath, `${state.toLowerCase()}-cities.json`);

      if (await this.fileExists(jsonPath)) {
        return await this.parseJSON(jsonPath);
      }

      return [];
    } catch (error) {
      console.error(`Error loading JSON for ${state}:`, error);
      return [];
    }
  }

  async getAllStates(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.dataPath);
      const jsonFiles = files.filter(file => file.endsWith('-cities.json'));
      return jsonFiles.map(file => file.replace('-cities.json', ''));
    } catch (error) {
      console.error('Error reading states directory:', error);
      return ['california'];
    }
  }

  async getStateConfig(state: string): Promise<StateConfig> {
    const configPath = path.join(process.cwd(), 'data', 'metadata', 'states-config.json');

    try {
      if (await this.fileExists(configPath)) {
        const configData = await fs.readFile(configPath, 'utf-8');
        const configs = JSON.parse(configData);
        return configs[state.toLowerCase()];
      }
    } catch (error) {
      console.warn(`No config found for ${state}`);
    }

    throw new Error(`Config not found for state: ${state}`);
  }

  validateData(data: BaseLocation[]): boolean {
    return data.every(location =>
      location.state &&
      location.city &&
      typeof location.state === 'string' &&
      typeof location.city === 'string'
    );
  }

  private async parseJSON(filePath: string): Promise<BaseLocation[]> {
    const contentRaw = await fs.readFile(filePath, 'utf-8');
    // Strip BOM if present to avoid JSON.parse errors (e.g., when files are written with UTF-8 BOM)
    const content = contentRaw.replace(/^\uFEFF/, '');
    const jsonData = JSON.parse(content);

    // Extract state name from file path (e.g., "california-cities.json" -> "california")
    const fileName = path.basename(filePath, '.json');
    const stateName = fileName.replace('-cities', '');

    // Get proper state name from config
    let properStateName = stateName;
    try {
      const configPath = path.join(process.cwd(), 'data', 'metadata', 'states-config.json');
      if (await this.fileExists(configPath)) {
        const configData = await fs.readFile(configPath, 'utf-8');
        const configs = JSON.parse(configData);
        const stateConfig = configs[stateName.toLowerCase()];
        if (stateConfig && stateConfig.name) {
          properStateName = stateConfig.name;
        }
      }
    } catch (error) {
      console.warn(`Could not load state config for ${stateName}, using filename`);
      // Fallback: capitalize first letter
      properStateName = stateName.charAt(0).toUpperCase() + stateName.slice(1);
    }

    const locations: BaseLocation[] = [];

    for (const item of jsonData) {
      if (item.city && item.landmark && item.population && item.slug) {
        const lat = item.latitude !== undefined ? parseFloat(item.latitude) : undefined;
        const lng = item.longitude !== undefined ? parseFloat(item.longitude) : undefined;
        locations.push({
          state: properStateName, // Dynamic state name based on file
          city: item.city,
          landmark: item.landmark,
          population: item.population,
          slug: item.slug,
          latitude: lat,
          longitude: lng,
          coordinates: lat !== undefined && lng !== undefined ? { lat, lng } : { lat: 0, lng: 0 }
        });
      }
    }

    return locations;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
/**
 * Clase principal para cargar datos de estados desde múltiples fuentes
 * Versión simplificada sin PerformanceOptimizer para evitar bucles infinitos
 */
export class StateDataLoader {
  private static cache = new Map<string, StateDataResult>();
  private static adapter: DataAdapter;

  /**
   * Inicializa el adaptador si no está inicializado
   */
  private static ensureAdapter(): void {
    if (!this.adapter) {
      // Use JSON adapter by default, fallback to CSV if needed
      this.adapter = new JSONAdapter();
    }
  }

  /**
   * Carga datos de un estado específico con cache simple
   */
  static async loadStateData(stateName: string): Promise<BaseLocation[]> {
    this.ensureAdapter();

    // Cache simple
    const cacheKey = `state-${stateName.toLowerCase()}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      // Cache válido por 1 hora
      if (Date.now() - cached.lastUpdated.getTime() < 3600000) {
        return cached.cities;
      }
    }

    try {
      const cities = await this.adapter.loadLocations(stateName);
      const config = await this.getStateConfig(stateName);

      const result: StateDataResult = {
        state: stateName,
        cities,
        config,
        totalCities: cities.length,
        lastUpdated: new Date()
      };

      this.cache.set(cacheKey, result);
      return cities;
    } catch (error) {
      console.error(`Error loading data for state ${stateName}:`, error);
      return [];
    }
  }

  /**
   * Obtiene todos los estados disponibles
   */
  static async getAllStates(): Promise<string[]> {
    this.ensureAdapter();
    try {
      return await this.adapter.getAllStates();
    } catch (error) {
      console.error('Error getting all states:', error);
      return ['california']; // Fallback al estado actual
    }
  }

  /**
   * Obtiene configuración de un estado específico
   */
  static async getStateConfig(stateName: string): Promise<StateConfig> {
    this.ensureAdapter();

    // Cache simple para configuración
    const cacheKey = `config-${stateName.toLowerCase()}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      // Cache válido por 24 horas
      if (Date.now() - cached.lastUpdated.getTime() < 86400000) {
        return cached.config;
      }
    }

    try {
      const config = await this.adapter.getStateConfig(stateName);

      const result: StateDataResult = {
        state: stateName,
        cities: [],
        config,
        totalCities: 0,
        lastUpdated: new Date()
      };

      this.cache.set(cacheKey, result);
      return config;
    } catch (error) {
      console.warn(`Config not found for ${stateName}, using default`);
      return this.getDefaultStateConfig(stateName);
    }
  }

  /**
   * Enriquece ubicaciones con coordenadas y datos adicionales
   */
  static async enrichWithCoordinates(locations: BaseLocation[]): Promise<ProcessedLocation[]> {
    return Promise.all(
      locations.map(async (location) => {
        const coordinates = await this.getCoordinates(location);
        const slug = this.generateSlug(location.state, location.city);

        return {
          ...location,
          slug,
          stateSlug: this.slugify(location.state),
          citySlug: this.slugify(location.city),
          originalSlug: this.slugify(location.city),
          coordinates,
          seoData: {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            localKeywords: [],
            h1Title: '',
            canonicalUrl: ''
          }
        } as ProcessedLocation;
      })
    );
  }

  /**
   * Obtiene todas las ubicaciones procesadas de todos los estados usando estrategia híbrida
   */
  static async getAllProcessedLocations(): Promise<ProcessedLocation[]> {
    const states = await this.getAllStates();
    const allLocations: ProcessedLocation[] = [];

    for (const state of states) {
      const config = await this.getStateConfig(state);

      // Solo procesar estados habilitados
      if (!config.enabled) {
        continue;
      }

      let cities: BaseLocation[] = [];

      if (config.strategy === 'full') {
        // Estrategia completa: cargar todas las ciudades (California)
        cities = await this.loadStateData(state);
      } else if (config.strategy === 'major') {
        // Estrategia mayor: solo ciudades principales
        cities = await this.loadMajorCitiesOnly(state, config);
      } else {
        // Estrategia mínima o fallback: solo las primeras 5 ciudades principales
        cities = await this.loadMinimalCities(state, config);
      }

      const processed = await this.enrichWithCoordinates(cities);
      allLocations.push(...processed);
    }

    console.log(`🏗️ Generated ${allLocations.length} locations using hybrid strategy`);
    return allLocations;
  }

  /**
   * Carga solo las ciudades principales de un estado
   */
  static async loadMajorCitiesOnly(stateName: string, config: StateConfig): Promise<BaseLocation[]> {
    try {
      // Intentar cargar desde archivo JSON específico del estado
      const cities = await this.loadStateData(stateName);

      if (cities.length > 0) {
        return cities; // El archivo JSON ya contiene solo las ciudades principales
      }

      // Fallback: crear ciudades desde la configuración
      return config.majorCities.map(cityName => ({
        state: config.name,
        city: cityName,
        landmark: `${cityName} Landmark`,
        population: 100000, // Población estimada
        slug: this.slugify(cityName),
        coordinates: config.defaultCoordinates
      }));
    } catch (error) {
      console.warn(`Could not load major cities for ${stateName}:`, error);
      return [];
    }
  }

  /**
   * Carga un número mínimo de ciudades (para estados de baja prioridad)
   */
  static async loadMinimalCities(stateName: string, config: StateConfig): Promise<BaseLocation[]> {
    const majorCities = await this.loadMajorCitiesOnly(stateName, config);
    return majorCities.slice(0, 5); // Solo las primeras 5 ciudades
  }

  /**
   * Busca una ubicación específica por estado y ciudad
   */
  static async findLocation(stateSlug: string, citySlug: string): Promise<ProcessedLocation | null> {
    const states = await this.getAllStates();

    for (const state of states) {
      if (this.slugify(state) === stateSlug) {
        const cities = await this.loadStateData(state);
        const city = cities.find(c => this.slugify(c.city) === citySlug);

        if (city) {
          const processed = await this.enrichWithCoordinates([city]);
          return processed[0];
        }
      }
    }

    return null;
  }

  /**
   * Gets nearby cities in the same state for internal linking.
   * Uses real geographic coordinates to sort by distance (using Haversine distance).
   * Falls back to deterministic selection if coordinates are not available.
   */
  static async getNearbyCities(
    stateSlug: string,
    currentCitySlug: string,
    limit: number = 8
  ): Promise<Array<{ name: string; slug: string }>> {
    const states = await this.getAllStates();

    for (const state of states) {
      if (this.slugify(state) === stateSlug) {
        const cities = await this.loadStateData(state);

        // Filter out current city
        const otherCities = cities.filter(c => this.slugify(c.city) !== currentCitySlug);

        if (otherCities.length === 0) return [];

        const currentCity = cities.find(c => this.slugify(c.city) === currentCitySlug);
        
        const hasCoordinates = currentCity && 
          currentCity.latitude !== undefined && 
          currentCity.longitude !== undefined &&
          currentCity.latitude !== 0 &&
          currentCity.longitude !== 0;

        if (hasCoordinates) {
          const lat1 = currentCity.latitude!;
          const lon1 = currentCity.longitude!;

          const getDistance = (lat2: number, lon2: number) => {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          const sorted = otherCities
            .map(c => {
              const distance = c.latitude !== undefined && c.longitude !== undefined && c.latitude !== 0 && c.longitude !== 0
                ? getDistance(c.latitude, c.longitude)
                : Infinity;
              return { city: c, distance };
            })
            .sort((a, b) => {
              if (a.distance !== b.distance) {
                return a.distance - b.distance;
              }
              // Tie-breaker
              return a.city.city.localeCompare(b.city.city);
            });

          return sorted.slice(0, limit).map(item => ({
            name: item.city.city,
            slug: this.slugify(item.city.city)
          }));
        }

        // Fallback to deterministic hash if no coordinates are found
        const hash = currentCitySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // Shuffle based on hash (deterministic)
        const shuffled = [...otherCities].sort((a, b) => {
          const hashA = (this.slugify(a.city).charCodeAt(0) + hash) % 100;
          const hashB = (this.slugify(b.city).charCodeAt(0) + hash) % 100;
          return hashA - hashB;
        });

        return shuffled.slice(0, limit).map(c => ({
          name: c.city,
          slug: this.slugify(c.city)
        }));
      }
    }

    return [];
  }

  // Métodos privados de utilidad
  private static async getCoordinates(location: BaseLocation): Promise<Coordinates> {
    if (location.latitude && location.longitude) {
      return { lat: location.latitude, lng: location.longitude };
    }

    // Coordenadas por defecto para California (mantener compatibilidad)
    if (location.state.toLowerCase() === 'california') {
      return { lat: 36.7783, lng: -119.4179 };
    }

    // Coordenadas genéricas por estado
    const stateDefaults: Record<string, Coordinates> = {
      texas: { lat: 31.9686, lng: -99.9018 },
      florida: { lat: 27.7663, lng: -81.6868 },
      'new york': { lat: 42.1657, lng: -74.9481 }
    };

    return stateDefaults[location.state.toLowerCase()] || { lat: 39.8283, lng: -98.5795 };
  }

  private static generateSlug(state: string, city: string): string {
    return `${this.slugify(state)}-${this.slugify(city)}`;
  }

  static slugify(text: string): string {
    // Normalize and strip diacritics before slugging (e.g., ñ -> n)
    const normalized = text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '');

    return normalized
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private static getDefaultStateConfig(stateName: string): StateConfig {
    return {
      name: stateName,
      abbreviation: this.getStateAbbreviation(stateName),
      slug: this.slugify(stateName),
      timezone: 'America/New_York',
      strategy: 'minimal', // Estrategia por defecto para estados no configurados
      priority: 'low',
      majorCities: [],
      seoModifiers: [],
      defaultCoordinates: { lat: 39.8283, lng: -98.5795 },
      enabled: false // Por defecto deshabilitado hasta configurar
    };
  }

  private static getStateAbbreviation(stateName: string): string {
    const abbreviations: Record<string, string> = {
      'california': 'CA',
      'texas': 'TX',
      'florida': 'FL',
      'new york': 'NY',
      'illinois': 'IL',
      'pennsylvania': 'PA'
    };

    return abbreviations[stateName.toLowerCase()] || stateName.substring(0, 2).toUpperCase();
  }

  /**
   * Cambia el adaptador de datos (para migración futura)
   */
  static setAdapter(adapter: DataAdapter): void {
    this.adapter = adapter;
    this.cache.clear(); // Limpiar cache al cambiar adaptador
  }
}
