import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { FlosTransitLogo } from './FlosTransitLogo';
import { checkBackendHealth, fetchLiveBusArrivals } from '../services/ltaApi';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetAllData: () => void;
  onRefreshNow: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onRefreshNow,
}) => {
  const [apiStatus, setApiStatus] = useState<{
    loading: boolean;
    connected: boolean;
    credentialsConfigured: boolean;
    testResult?: string;
  }>({
    loading: true,
    connected: false,
    credentialsConfigured: false,
  });

  const checkStatus = async () => {
    setApiStatus((prev) => ({ ...prev, loading: true }));
    const health = await checkBackendHealth();
    setApiStatus({
      loading: false,
      connected: health.connected,
      credentialsConfigured: health.credentialsConfigured,
      testResult: undefined,
    });
  };

  const handleTestApi = async () => {
    setApiStatus((prev) => ({ ...prev, loading: true, testResult: 'Testing LTA DataMall v3 (Stop 83139, Service 15)...' }));
    const res = await fetchLiveBusArrivals('83139', '15');
    if (res.source === 'lta_live') {
      setApiStatus((prev) => ({
        ...prev,
        loading: false,
        testResult: `Success! Received ${res.arrivals.length} live arrival records directly from LTA DataMall v3.`,
      }));
    } else {
      setApiStatus((prev) => ({
        ...prev,
        loading: false,
        testResult: res.errorMessage || 'Using local simulation fallback (backend returned HTTP 500 credential not configured as expected).',
      }));
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-4 w-full flex flex-col gap-5">
      {/* Brand Card */}
      <div className="bg-white border border-[#d4c1ce] rounded-xl p-5 shadow-xs flex items-center gap-4">
        <FlosTransitLogo size="lg" />
        <div>
          <h2 className="text-lg font-bold text-[#5f0b62] font-heading">Flo's Transit Services</h2>
          <p className="text-xs text-[#50434d]">
            Singapore Bus Arrival & Real-Time Fleet Tracking System
          </p>
        </div>
      </div>

      {/* LTA DataMall v3 API Service Connection Card */}
      <div className="bg-white border border-[#d4c1ce] rounded-xl p-4 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5f0b62] text-xl">hub</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#50434d]">
              LTA DataMall v3 API Service
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              apiStatus.credentialsConfigured
                ? 'bg-[#00875A]/10 text-[#00875A]'
                : 'bg-[#FF8B00]/10 text-[#FF8B00]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus.credentialsConfigured ? 'bg-[#00875A]' : 'bg-[#FF8B00]'
              }`}
            />
            {apiStatus.credentialsConfigured ? 'Live API Connected' : 'Simulated / Key Missing'}
          </span>
        </div>

        <p className="text-xs text-[#50434d] leading-relaxed">
          Integrated backend proxy querying the official Land Transport Authority (LTA) DataMall API (v3 Next Bus Arrival endpoint with 20s refresh):
          <br />
          <code className="text-[11px] bg-[#F2F2F2] px-1.5 py-0.5 rounded text-[#5f0b62] font-mono mt-1 block truncate">
            https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139&ServiceNo=15
          </code>
        </p>

        <div className="bg-[#faf8f9] rounded-lg p-3 border border-[#d4c1ce]/60 text-xs flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-[#50434d]">Backend Proxy:</span>
            <span className="font-mono text-[#1b1c1c]">/api/bus-arrival</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#50434d]">Credential Guardrail:</span>
            <span className="text-[#00875A] font-semibold">Active (api/ isolated)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#50434d]">Environment Key:</span>
            <span className="font-mono text-[#1b1c1c]">LTA_DATAMALL_API_KEY</span>
          </div>
        </div>

        {apiStatus.testResult && (
          <div className="bg-[#f0eded] p-2.5 rounded-lg text-xs font-mono text-[#1b1c1c] border border-[#d4c1ce]/70">
            {apiStatus.testResult}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleTestApi}
            disabled={apiStatus.loading}
            className="px-3 py-1.5 bg-[#5f0b62] hover:bg-[#7a297b] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">wifi_tethering</span>
            <span>Test API Request (83139)</span>
          </button>
          <button
            onClick={checkStatus}
            disabled={apiStatus.loading}
            className="px-3 py-1.5 bg-[#F2F2F2] hover:bg-[#eae7e7] text-[#50434d] text-xs font-semibold rounded-lg active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Check Health</span>
          </button>
        </div>
      </div>

      {/* Real-time & Refresh Section */}
      <div className="bg-white border border-[#d4c1ce] rounded-xl p-4 shadow-xs flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#50434d]">
          Live Data & Auto Refresh
        </h3>

        <div className="flex justify-between items-center py-1">
          <div>
            <div className="text-[15px] font-semibold text-[#1b1c1c]">Live Auto-Refresh</div>
            <div className="text-xs text-[#50434d]">Automatically update bus timings</div>
          </div>
          <button
            onClick={() => onUpdateSettings({ autoRefresh: !settings.autoRefresh })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.autoRefresh ? 'bg-[#5f0b62]' : 'bg-[#d4c1ce]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                settings.autoRefresh ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {settings.autoRefresh && (
          <div className="flex justify-between items-center pt-2 border-t border-[#f0eded]">
            <span className="text-sm text-[#1b1c1c]">Refresh Interval</span>
            <div className="flex gap-2">
              {[15, 30, 60].map((interval) => (
                <button
                  key={interval}
                  onClick={() => onUpdateSettings({ refreshInterval: interval })}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    settings.refreshInterval === interval
                      ? 'bg-[#5f0b62] text-white'
                      : 'bg-[#F2F2F2] text-[#50434d] hover:bg-[#eae7e7]'
                  }`}
                >
                  {interval}s
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[#f0eded] flex justify-end">
          <button
            onClick={onRefreshNow}
            className="px-4 py-2 bg-[#F2F2F2] hover:bg-[#eae7e7] text-[#5f0b62] rounded-lg text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Refresh Now</span>
          </button>
        </div>
      </div>

      {/* Commuter Accessibility & Display */}
      <div className="bg-white border border-[#d4c1ce] rounded-xl p-4 shadow-xs flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#50434d]">
          Accessibility & Display
        </h3>

        <div className="flex justify-between items-center py-1">
          <div>
            <div className="text-[15px] font-semibold text-[#1b1c1c]">
              Passenger Capacity Indicators
            </div>
            <div className="text-xs text-[#50434d]">
              Show Seats Available / Standing / Crowded icons
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateSettings({ showCapacityIndicators: !settings.showCapacityIndicators })
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.showCapacityIndicators ? 'bg-[#5f0b62]' : 'bg-[#d4c1ce]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                settings.showCapacityIndicators ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#f0eded]">
          <div>
            <div className="text-[15px] font-semibold text-[#1b1c1c]">
              Wheelchair Accessible (WAB) Filter
            </div>
            <div className="text-xs text-[#50434d]">Highlight barrier-free accessible buses</div>
          </div>
          <button
            onClick={() => onUpdateSettings({ wheelchairOnly: !settings.wheelchairOnly })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.wheelchairOnly ? 'bg-[#5f0b62]' : 'bg-[#d4c1ce]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                settings.wheelchairOnly ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#f0eded]">
          <div>
            <div className="text-[15px] font-semibold text-[#1b1c1c]">High Contrast Theme</div>
            <div className="text-xs text-[#50434d]">
              Enhanced readability under bright sunlight
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.highContrast ? 'bg-[#5f0b62]' : 'bg-[#d4c1ce]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                settings.highContrast ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management & System */}
      <div className="bg-white border border-[#d4c1ce] rounded-xl p-4 shadow-xs flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#50434d]">
          App Info & Storage
        </h3>
        <div className="text-xs text-[#50434d] flex justify-between py-1">
          <span>Design Standard</span>
          <span className="font-semibold text-[#1b1c1c]">SBS Transit Brand Guide v2.4</span>
        </div>
        <div className="text-xs text-[#50434d] flex justify-between py-1">
          <span>Transit Operator</span>
          <span className="font-semibold text-[#1b1c1c]">SBS Transit Ltd (Singapore)</span>
        </div>
        <div className="text-xs text-[#50434d] flex justify-between py-1">
          <span>Data Authority</span>
          <span className="font-semibold text-[#1b1c1c]">LTA DataMall Compliant</span>
        </div>

        <button
          onClick={onResetAllData}
          className="mt-2 text-xs text-[#DE350B] hover:underline font-semibold text-left py-1 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">delete_sweep</span>
          Reset Demo Data & Clear Cached Favorites
        </button>
      </div>
    </main>
  );
};
