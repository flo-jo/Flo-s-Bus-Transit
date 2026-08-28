import React, { useState } from 'react';
import { BusServiceRoute } from '../types';
import { MAP_PREVIEW_URL, BUS_ROUTES_DATABASE } from '../data/transitData';

interface RouteScreenProps {
  selectedServiceNo: string;
  onSelectService: (serviceNo: string) => void;
  onSelectStopCode: (stopCode: string) => void;
  isFavoriteService: (serviceNo: string) => boolean;
  onToggleFavoriteService: (serviceNo: string) => void;
}

export const RouteScreen: React.FC<RouteScreenProps> = ({
  selectedServiceNo,
  onSelectService,
  onSelectStopCode,
  isFavoriteService,
  onToggleFavoriteService,
}) => {
  const [directionReversed, setDirectionReversed] = useState(false);
  const [showFullMapModal, setShowFullMapModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Fetch route data for current service or fallback to 175
  const currentRoute: BusServiceRoute =
    BUS_ROUTES_DATABASE[selectedServiceNo] || BUS_ROUTES_DATABASE['175'];

  const availableServices = Object.keys(BUS_ROUTES_DATABASE);
  const isFav = isFavoriteService(currentRoute.serviceNo);

  const stops = directionReversed ? [...currentRoute.stops].reverse() : currentRoute.stops;

  const filteredStops = filterQuery
    ? stops.filter(
        (s) =>
          s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          s.code.includes(filterQuery) ||
          s.road.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : stops;

  return (
    <main className="max-w-4xl mx-auto px-4 py-4 w-full flex flex-col gap-4">
      {/* Service Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-semibold text-[#50434d] shrink-0 uppercase tracking-wider">
          Services:
        </span>
        {availableServices.map((svc) => (
          <button
            key={svc}
            onClick={() => onSelectService(svc)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedServiceNo === svc
                ? 'bg-[#5f0b62] text-white shadow-xs'
                : 'bg-white text-[#50434d] border border-[#d4c1ce] hover:bg-[#faf8f9]'
            }`}
          >
            {svc}
          </button>
        ))}
      </div>

      {/* Service Header Card matching Image 3 */}
      <div className="bg-white rounded-xl shadow-xs border border-[#d4c1ce] p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Big Purple Box */}
          <div className="w-16 h-16 bg-[#5f0b62] text-white flex items-center justify-center rounded-xl shadow-xs shrink-0">
            <span className="text-[32px] font-bold font-heading">{currentRoute.serviceNo}</span>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-[#1b1c1c] leading-snug font-heading">
              {directionReversed ? currentRoute.destination : currentRoute.origin}
            </h2>
            <button
              onClick={() => setDirectionReversed(!directionReversed)}
              className="text-[14px] text-[#50434d] flex items-center gap-1 hover:text-[#5f0b62] transition-colors mt-0.5"
              title="Switch Direction"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>To {directionReversed ? currentRoute.origin : currentRoute.destination}</span>
            </button>
          </div>
        </div>

        {/* Favorite Star */}
        <button
          id="btn-route-favorite"
          onClick={() => onToggleFavoriteService(currentRoute.serviceNo)}
          aria-label="Toggle favorite service"
          className="p-2 text-[#5f0b62] rounded-full hover:bg-[#f0eded] transition-colors active:scale-90"
        >
          <span
            className="material-symbols-outlined text-[26px]"
            style={{
              fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0",
              color: isFav ? '#5f0b62' : '#82737e',
            }}
          >
            star
          </span>
        </button>
      </div>

      {/* Route Timeline Card matching Image 3 */}
      <div className="bg-white rounded-xl shadow-xs border border-[#d4c1ce] p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#50434d] uppercase tracking-wider font-heading">
            Route Details
          </h3>
          <span className="text-xs text-[#50434d] bg-[#eae7e7] px-2.5 py-0.5 rounded-full font-medium">
            Freq: {currentRoute.frequency}
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-1 before:bg-[#d4c1ce] before:rounded-full">
          {filteredStops.map((stop, idx) => {
            const isLive = stop.isLiveHere || (idx === 2 && !directionReversed);

            if (isLive) {
              return (
                /* Stop with Live Bus Badge matching Image 3 */
                <div
                  key={stop.code}
                  id={`timeline-live-stop-${stop.code}`}
                  onClick={() => onSelectStopCode(stop.code)}
                  className="relative flex gap-4 mb-5 items-start bg-[#5f0b62]/5 -mx-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#5f0b62]/10 transition-colors"
                >
                  {/* Bus Icon overlay on line with pulse */}
                  <div className="absolute -left-[27px] top-2 z-20 flex flex-col items-center">
                    <div className="bg-[#5f0b62] text-white rounded-full p-1 shadow-md animate-pulse flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[15px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        directions_bus
                      </span>
                    </div>
                    <div className="bg-[#00875A] text-white text-[9px] font-bold px-1 py-0.2 rounded-sm mt-0.5 shadow-xs">
                      LIVE
                    </div>
                  </div>

                  <div className="flex-1 pl-4">
                    <h4 className="text-[18px] font-semibold text-[#5f0b62] leading-tight font-heading">
                      {stop.name}
                    </h4>
                    <p className="text-[12px] text-[#5f0b62]/80 mt-0.5 font-medium">
                      {stop.code} • {stop.road}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[18px] font-bold text-[#00875A] font-heading">
                      {stop.estMin || 'Arr'}
                    </span>
                  </div>
                </div>
              );
            }

            const isFirst = idx === 0;

            return (
              <div
                key={stop.code}
                id={`timeline-stop-${stop.code}`}
                onClick={() => onSelectStopCode(stop.code)}
                className="relative flex gap-4 mb-5 items-start group cursor-pointer hover:bg-[#faf8f9] -mx-2 px-2 py-1 rounded-md transition-colors"
              >
                {/* Node dot on line */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs z-10 ${
                    isFirst ? 'bg-[#5f0b62]' : 'bg-[#d4c1ce] group-hover:bg-[#5f0b62]'
                  }`}
                ></div>

                <div className="flex-1">
                  <h4 className="text-[16px] font-medium text-[#1b1c1c] leading-tight group-hover:text-[#5f0b62] transition-colors">
                    {stop.name}
                  </h4>
                  <p className="text-[12px] text-[#50434d] mt-0.5">
                    {stop.code} • {stop.road}
                  </p>
                </div>

                {stop.estMin && (
                  <div className="text-right">
                    <span className="text-[16px] font-semibold text-[#1b1c1c]">
                      {stop.estMin}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Map View Box matching Image 3 */}
        <div className="mt-4 rounded-xl overflow-hidden border border-[#d4c1ce] h-52 relative group">
          <div
            className="bg-cover bg-center w-full h-full cursor-pointer group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url('${MAP_PREVIEW_URL}')` }}
            onClick={() => setShowFullMapModal(true)}
            title="Click to view interactive map"
          ></div>

          {/* Route details overlay pin */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-[#5f0b62] shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00875A] animate-ping"></span>
            <span>Live Vehicle 175 near Ayer Rajah</span>
          </div>

          <button
            id="btn-open-map-view"
            onClick={() => setShowFullMapModal(true)}
            className="absolute bottom-3 right-3 bg-white/95 hover:bg-white backdrop-blur-md px-3 py-1.5 rounded-lg text-[13px] font-semibold text-[#1b1c1c] shadow-sm border border-[#d4c1ce]/60 hover:text-[#5f0b62] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">map</span>
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Modal */}
      {showFullMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-[#d4c1ce] flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#d4c1ce] flex justify-between items-center bg-[#fcf9f8]">
              <div>
                <h3 className="text-lg font-bold text-[#5f0b62]">
                  Service {currentRoute.serviceNo} - Route Map
                </h3>
                <p className="text-xs text-[#50434d]">
                  {currentRoute.origin} ↔ {currentRoute.destination}
                </p>
              </div>
              <button
                onClick={() => setShowFullMapModal(false)}
                className="p-1.5 rounded-full hover:bg-[#eae7e7] text-[#50434d]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="relative flex-1 min-h-[350px] bg-slate-100 overflow-hidden">
              <img
                src={MAP_PREVIEW_URL}
                alt="Full interactive map view"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-md border border-[#d4c1ce]/80 text-xs">
                <div className="font-semibold text-[#1b1c1c] mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#5f0b62] text-sm">
                    directions_bus
                  </span>
                  SBS Transit Real-time Tracking Active
                </div>
                <div className="text-[#50434d] flex justify-between">
                  <span>Current Speed: 38 km/h</span>
                  <span>Next Stop: Ayer Rajah Food Ctr</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-[#d4c1ce] bg-white flex justify-end">
              <button
                onClick={() => setShowFullMapModal(false)}
                className="px-4 py-2 bg-[#5f0b62] text-white rounded-lg text-sm font-semibold hover:bg-[#7a297b]"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
