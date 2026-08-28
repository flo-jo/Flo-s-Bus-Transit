export type LoadLevel = 'SEA' | 'SDA' | 'LSD'; // Seats Available (Green), Standing Available (Orange), Limited Standing (Red)
export type BusType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy
export type FeatureType = 'WAB' | 'NONE'; // Wheelchair Accessible Bus

export interface BusArrivalTiming {
  estimatedMin: number; // 0 for 'Arr'
  load: LoadLevel;
  type: BusType;
  feature: FeatureType;
  isLive?: boolean;
  monitored?: boolean;
}

export interface BusArrivalInfo {
  serviceNo: string;
  destination: string;
  nextBus: BusArrivalTiming;
  nextBus2?: BusArrivalTiming;
  nextBus3?: BusArrivalTiming;
  isOperating?: boolean;
  statusText?: string;
  isFavorite?: boolean;
}

export interface BusStop {
  id: string;
  code: string; // e.g. "84039", "09038", "84009", "17009", "01113", "84031"
  name: string;
  road: string;
  distance?: string;
  direction?: string;
  services: string[];
  lat: number;
  lng: number;
}

export interface RouteStop {
  sequence: number;
  code: string;
  name: string;
  road: string;
  estMin?: string;
  isLiveHere?: boolean;
  lat: number;
  lng: number;
}

export interface BusServiceRoute {
  serviceNo: string;
  origin: string;
  destination: string;
  direction: 1 | 2;
  currentLiveStopCode: string;
  frequency: string;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  firstBus: string;
  lastBus: string;
  stops: RouteStop[];
}

export interface FavoriteStopGroup {
  stopCode: string;
  stopName: string;
  road: string;
  direction?: string;
  services: {
    serviceNo: string;
    estMin: string | number;
    isLive?: boolean;
    isDelay?: boolean;
    noService?: boolean;
  }[];
}

export interface FavoriteItem {
  id: string;
  type: 'stop' | 'service';
  code: string;
  title: string;
  subtitle: string;
  timestamp: number;
}

export interface RecentItem {
  id: string;
  type: 'stop' | 'service';
  code: string;
  title: string;
  subtitle: string;
  timestamp: number;
}

export type TabType = 'home' | 'favorites' | 'route' | 'settings';

export interface AppSettings {
  autoRefresh: boolean;
  refreshInterval: number; // in seconds, e.g. 15, 30, 60
  wheelchairOnly: boolean;
  showCapacityIndicators: boolean;
  hapticFeedback: boolean;
  highContrast: boolean;
  compactView: boolean;
}
