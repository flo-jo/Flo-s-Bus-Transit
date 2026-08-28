import { BusArrivalInfo, BusArrivalTiming, LoadLevel, BusType, FeatureType } from '../types';
import { getBusArrivalsForStop, BUS_STOPS_DATABASE } from '../data/transitData';

export interface LtaNextBusRaw {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
  Monitored?: number;
}

export interface LtaServiceRaw {
  ServiceNo: string;
  Operator?: string;
  NextBus?: LtaNextBusRaw;
  NextBus2?: LtaNextBusRaw;
  NextBus3?: LtaNextBusRaw;
}

export interface LtaBusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services?: LtaServiceRaw[];
}

export interface FetchArrivalResult {
  busStopCode: string;
  arrivals: BusArrivalInfo[];
  source: 'lta_live' | 'simulated';
  credentialStatus: 'configured' | 'missing' | 'error';
  errorMessage?: string;
  lastUpdated: number;
}

function parseBusTiming(raw?: LtaNextBusRaw): BusArrivalTiming | undefined {
  if (!raw || !raw.EstimatedArrival || raw.EstimatedArrival.trim() === '') {
    return undefined;
  }

  const arrivalTime = new Date(raw.EstimatedArrival).getTime();
  if (isNaN(arrivalTime)) {
    return undefined;
  }

  const now = Date.now();
  const diffMinutes = Math.round((arrivalTime - now) / 60000);
  const estimatedMin = diffMinutes <= 0 ? 0 : diffMinutes;

  const load: LoadLevel =
    raw.Load === 'LSD' ? 'LSD' : raw.Load === 'SDA' ? 'SDA' : 'SEA';

  const type: BusType =
    raw.Type === 'DD' ? 'DD' : raw.Type === 'BD' ? 'BD' : 'SD';

  const feature: FeatureType = raw.Feature === 'WAB' ? 'WAB' : 'NONE';

  return {
    estimatedMin,
    load,
    type,
    feature,
    isLive: raw.Monitored === 1 || raw.Monitored === undefined,
    monitored: raw.Monitored === 1,
  };
}

function resolveDestination(destCode?: string, serviceNo?: string): string {
  if (destCode) {
    const matchingStop = BUS_STOPS_DATABASE.find((s) => s.code === destCode);
    if (matchingStop) return matchingStop.name;
  }

  // Fallback defaults for common services
  const fallbackMap: Record<string, string> = {
    '15': 'Marine Parade / Pasir Ris',
    '175': 'Lor 1 Geylang Ter',
    '7': 'Clementi Int',
    '14': 'Clementi Int',
    '65': 'HarbourFront Int',
    '2': 'Kampong Bahru Ter',
    '24': 'Changi Airport PTB2',
    '31': 'Toa Payoh Int',
    '196': 'Clementi Int',
  };

  return (serviceNo && fallbackMap[serviceNo]) || 'Loop / Terminal';
}

/**
 * Fetches real-time bus arrivals for a bus stop from the backend LTA DataMall proxy.
 * If credentials are not yet configured on the server, falls back cleanly to the built-in database.
 */
export async function fetchLiveBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<FetchArrivalResult> {
  const cleanCode = busStopCode.trim();
  const cleanService = serviceNo?.trim();

  try {
    const queryParams = new URLSearchParams({
      BusStopCode: cleanCode,
    });
    if (cleanService) {
      queryParams.set('ServiceNo', cleanService);
    }

    const response = await fetch(`/api/bus-arrival?${queryParams.toString()}`);

    if (response.ok) {
      const data: LtaBusArrivalResponse = await response.json();
      const services = data.Services || [];

      if (services.length > 0) {
        const parsedArrivals: BusArrivalInfo[] = services.map((svc) => {
          const next1 = parseBusTiming(svc.NextBus);
          const next2 = parseBusTiming(svc.NextBus2);
          const next3 = parseBusTiming(svc.NextBus3);

          const isOperating = Boolean(next1);
          const statusText = next1
            ? next1.estimatedMin === 0
              ? 'Arr'
              : `${next1.estimatedMin} min`
            : 'No service';

          return {
            serviceNo: svc.ServiceNo,
            destination: resolveDestination(svc.NextBus?.DestinationCode, svc.ServiceNo),
            nextBus: next1 || {
              estimatedMin: 99,
              load: 'SEA',
              type: 'SD',
              feature: 'WAB',
              isLive: false,
            },
            nextBus2: next2,
            nextBus3: next3,
            isOperating,
            statusText,
          };
        });

        return {
          busStopCode: cleanCode,
          arrivals: parsedArrivals,
          source: 'lta_live',
          credentialStatus: 'configured',
          lastUpdated: Date.now(),
        };
      }
    }

    if (response.status === 500) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error === 'credential not configured') {
        // Fallback to local simulated data with clear status
        return {
          busStopCode: cleanCode,
          arrivals: getBusArrivalsForStop(cleanCode),
          source: 'simulated',
          credentialStatus: 'missing',
          errorMessage: 'LTA_DATAMALL_API_KEY credential not configured on backend',
          lastUpdated: Date.now(),
        };
      }
    }

    // Other API response
    return {
      busStopCode: cleanCode,
      arrivals: getBusArrivalsForStop(cleanCode),
      source: 'simulated',
      credentialStatus: 'error',
      errorMessage: `LTA server returned ${response.status}`,
      lastUpdated: Date.now(),
    };
  } catch (err) {
    // Network or server error -> graceful simulated fallback
    return {
      busStopCode: cleanCode,
      arrivals: getBusArrivalsForStop(cleanCode),
      source: 'simulated',
      credentialStatus: 'missing',
      errorMessage: err instanceof Error ? err.message : 'Network error connecting to /api/bus-arrival',
      lastUpdated: Date.now(),
    };
  }
}

/**
 * Checks backend API health and credential status
 */
export async function checkBackendHealth(): Promise<{
  connected: boolean;
  credentialsConfigured: boolean;
  service?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      connected: true,
      credentialsConfigured: Boolean(data.credentialsConfigured),
      service: data.service,
    };
  } catch (err) {
    return {
      connected: false,
      credentialsConfigured: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
