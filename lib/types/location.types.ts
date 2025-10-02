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

export interface SEOTemplate {
  metaTitle: string;
  metaDescription: string;
  h1Template: string;
  contentSections: string[];
  keywordTemplates: {
    primary: string[];
    local: string[];
    longTail: string[];
  };
}

export interface DataSourceConfig {
  type: 'csv' | 'api' | 'cms';
  source: string;
  format: 'simple' | 'extended';
  headers: string[];
}

// Compatibilidad con el sistema actual
export interface CityMetadata extends ProcessedLocation {
  name: string;
  // Mantener compatibilidad con la estructura actual
}

// Tipos para el sistema de carga de datos
export interface StateDataResult {
  state: string;
  cities: BaseLocation[];
  config: StateConfig;
  totalCities: number;
  lastUpdated: Date;
}

export interface SEOGenerationOptions {
  includeSchema: boolean;
  includeLocalKeywords: boolean;
  keywordDensity: 'low' | 'medium' | 'high';
  customModifiers?: string[];
}

// Tipos para el sistema de sitemap
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  state: string;
  city: string;
  practice?: string; // Optional practice area for subniche pages
}

// Tipos para analytics y tracking
export interface LocationAnalytics {
  slug: string;
  pageViews: number;
  conversions: number;
  bounceRate: number;
  avgTimeOnPage: number;
  topKeywords: string[];
  lastTracked: Date;
}

export interface SEOReport {
  totalPages: number;
  stateBreakdown: Record<string, number>;
  topPerformingCities: LocationAnalytics[];
  seoIssues: string[];
  recommendations: string[];
  generatedAt: Date;
}

// Enums para mejor type safety
export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  DRAFT = 'draft'
}

export enum SEOPriority {
  HIGH = 1.0,
  MEDIUM = 0.8,
  LOW = 0.6,
  MINIMAL = 0.4
}

// Tipos de utilidad
export type StateSlug = string;
export type CitySlug = string;
export type LocationSlug = `${StateSlug}-${CitySlug}`;

// Interfaces para adaptadores de datos
export interface DataAdapter {
  loadLocations(state: string): Promise<BaseLocation[]>;
  getAllStates(): Promise<string[]>;
  getStateConfig(state: string): Promise<StateConfig>;
  validateData(data: BaseLocation[]): boolean;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  strategy: 'memory' | 'redis' | 'file';
}

// Tipos para configuración del sistema
export interface ProgrammaticSEOConfig {
  dataSource: DataSourceConfig;
  seoTemplates: SEOTemplate;
  statesConfig: Record<string, StateConfig>;
  cache: CacheConfig;
  analytics: {
    enabled: boolean;
    provider: 'google' | 'custom';
  };
  sitemap: {
    maxUrls: number;
    splitByState: boolean;
    includeImages: boolean;
  };
}
