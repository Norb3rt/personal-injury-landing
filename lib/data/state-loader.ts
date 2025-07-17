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
 * Adaptador para archivos CSV
 */
export class CSVAdapter implements DataAdapter {
  private readonly dataPath = path.join(process.cwd(), 'data', 'states');

  async loadLocations(state: string): Promise<BaseLocation[]> {
    try {
      // Intentar cargar desde la nueva estructura
      const csvPath = path.join(this.dataPath, `${state.toLowerCase()}.csv`);
      
      if (await this.fileExists(csvPath)) {
        return await this.parseCSV(csvPath);
      }

      // Fallback al archivo actual de California
      if (state.toLowerCase() === 'california') {
        const fallbackPath = path.join(process.cwd(), 'California_Cities.csv');
        if (await this.fileExists(fallbackPath)) {
          return await this.parseCSV(fallbackPath);
        }
      }

      return [];
    } catch (error) {
      console.error(`Error loading CSV for ${state}:`, error);
      return [];
    }
  }

  async getAllStates(): Promise<string[]> {
    try {
      if (await this.fileExists(this.dataPath)) {
        const files = await fs.readdir(this.dataPath);
        const csvFiles = files.filter(f => f.endsWith('.csv'));
        return csvFiles.map(f => f.replace('.csv', ''));
      }

      // Fallback: solo California por ahora
      return ['california'];
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

  private async parseCSV(filePath: string): Promise<BaseLocation[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].toLowerCase().split(',');
    
    const locations: BaseLocation[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const location: BaseLocation = {
        state: '',
        city: ''
      };

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        switch (header.trim()) {
          case 'state':
            location.state = value;
            break;
          case 'city':
            location.city = value;
            break;
          case 'latitude':
          case 'lat':
            location.latitude = parseFloat(value);
            break;
          case 'longitude':
          case 'lng':
          case 'lon':
            location.longitude = parseFloat(value);
            break;
          case 'population':
            location.population = parseInt(value);
            break;
          case 'county':
            location.county = value;
            break;
          case 'objectid':
            location.objectId = parseInt(value);
            break;
        }
      });

      if (location.state && location.city) {
        locations.push(location);
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
      this.adapter = new CSVAdapter();
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
   * Obtiene todas las ubicaciones procesadas de todos los estados
   */
  static async getAllProcessedLocations(): Promise<ProcessedLocation[]> {
    const states = await this.getAllStates();
    const allLocations: ProcessedLocation[] = [];

    for (const state of states) {
      const cities = await this.loadStateData(state);
      const processed = await this.enrichWithCoordinates(cities);
      allLocations.push(...processed);
    }

    return allLocations;
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
    return text
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
      majorCities: [],
      seoModifiers: [],
      defaultCoordinates: { lat: 39.8283, lng: -98.5795 },
      enabled: true
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
