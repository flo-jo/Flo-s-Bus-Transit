import { Request, Response } from 'express';

const LTA_BUS_ARRIVAL_API = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

/**
 * Handles LTA DataMall v3 Bus Arrival requests.
 * 
 * GUARDRAILS ENFORCEMENT:
 * - Credentials are read ONLY inside repo-root api/ directory via process.env.
 * - Never create a VITE_ variable for secrets.
 * - If credential is missing at runtime, returns HTTP 500 with {"error":"credential not configured"}.
 */
export async function handleBusArrival(req: Request, res: Response) {
  // Read credential ONLY inside api/ directory
  const apiKey =
    process.env.LTA_DATAMALL_API_KEY ||
    process.env.DATAMALL_API_KEY ||
    process.env.LTA_API_KEY;

  // Strict Guardrail Check: return HTTP 500 if missing
  if (!apiKey || apiKey.trim() === '') {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const busStopCode = (req.query.BusStopCode as string) || (req.query.busStopCode as string);
  const serviceNo = (req.query.ServiceNo as string) || (req.query.serviceNo as string);

  if (!busStopCode) {
    return res.status(400).json({ error: 'BusStopCode query parameter is required' });
  }

  try {
    const url = new URL(LTA_BUS_ARRIVAL_API);
    url.searchParams.set('BusStopCode', busStopCode.trim());
    if (serviceNo && serviceNo.trim() !== '') {
      url.searchParams.set('ServiceNo', serviceNo.trim());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        AccountKey: apiKey.trim(),
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API responded with HTTP ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error fetching LTA Bus Arrival data:', error);
    return res.status(500).json({
      error: 'Failed to fetch bus arrival data from LTA DataMall',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
