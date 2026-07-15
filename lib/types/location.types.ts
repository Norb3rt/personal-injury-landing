// Tipos centralizados para el sistema de programmatic SEO
// Soporta múltiples estados y fuentes de datos

export interface BaseLocation {
  state: string;
  city: string;
  latitude?: number;
  longitude?: number;
  population?: number;
  county?: string;
  objectId?: number;
  landmark?: string;
  slug?: string;
  coordinates?: Coordinates;
}

export interface ProcessedLocation extends BaseLocation {
  slug: string;
  stateSlug: string;
  citySlug: string;
  originalSlug: string;
  seoData: SEOMetadata;
  coordinates: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  localKeywords: string[];
  h1Title: string;
  canonicalUrl: string;
  schemaMarkup?: object;
}

export interface StateConfig {
  name: string;
  abbreviation: string;
  slug: string;
  timezone: string;
  strategy?: 'full' | 'major' | 'minimal'; // Hybrid strategy
  priority?: 'high' | 'medium' | 'low';    // Generation priority
  majorCities: string[];
  seoModifiers: string[];
  defaultCoordinates: Coordinates;
  enabled: boolean;
}

// Tipos para el sistema de carga de datos
export interface StateDataResult {
  state: string;
  cities: BaseLocation[];
  config: StateConfig;
  totalCities: number;
  lastUpdated: Date;
}

// Priorities for sitemap generation
export enum SEOPriority {
  HIGH = 1.0,
  MEDIUM = 0.8,
  LOW = 0.6,
  MINIMAL = 0.4
}

// Interfaces para adaptadores de datos
export interface DataAdapter {
  loadLocations(state: string): Promise<BaseLocation[]>;
  getAllStates(): Promise<string[]>;
  getStateConfig(state: string): Promise<StateConfig>;
  validateData(data: BaseLocation[]): boolean;
}
