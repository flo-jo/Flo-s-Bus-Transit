import React from 'react';
import { BusStop, BusArrivalInfo } from '../types';

interface BusStopDetailScreenProps {
  stop: BusStop;
  arrivals: BusArrivalInfo[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectService: (serviceNo: string) => void;
}

export const BusStopDetailScreen: React.FC<BusStopDetailScreenProps> = ({
  stop,
  arrivals,
  isFavorite,
  onToggleFavorite,
  onSelectService,
}) => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-4 w-full">
      {/* Bus Stop Header Card matching Image 5 */}
      <section className="bg-white rounded-xl border border-[#d4c1ce] p-4 mb-4 shadow-xs flex justify-between items-start">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1b1c1c] leading-tight mb-1.5 font-heading">
            {stop.name}
          </h1>
          <div className="flex items-center gap-2 text-[#50434d] text-[14px]">
            <span className="bg-[#eae7e7] text-[#1b1c1c] font-semibold px-2 py-0.5 rounded font-mono text-[13px]">
              {stop.code}
            </span>
            <span>•</span>
            <span className="font-medium">{stop.road}</span>
          </div>
          {stop.direction && (
            <p className="text-xs text-[#50434d]/80 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">turn_sharp_right</span>
              {stop.direction}
            </p>
          )}
        </div>

        {/* Favorite Star Button */}
        <button
          id="btn-stop-detail-favorite"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f6f3f2] hover:bg-[#eae7e7] transition-all text-[#fd8a3b] active:scale-90 shrink-0 ml-2"
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{
              fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
              color: isFavorite ? '#5f0b62' : '#82737e',
            }}
          >
            star
          </span>
        </button>
      </section>

      {/* Bus Services List matching Image 5 */}
      <div className="flex flex-col gap-3">
        {arrivals.map((service) => {
          const next = service.nextBus;
          const next2 = service.nextBus2;
          const isLive = next.isLive || next.estimatedMin <= 3;
          const isArr = next.estimatedMin === 0;

          return (
            <article
              key={service.serviceNo}
              id={`service-detail-card-${service.serviceNo}`}
              onClick={() => onSelectService(service.serviceNo)}
              className="bg-white rounded-xl border border-[#d4c1ce] p-4 flex items-center justify-between hover:bg-[#faf8f9] transition-colors cursor-pointer min-h-[5.5rem] shadow-xs active:scale-[0.99]"
            >
              {/* Service Number on Left */}
              <div className="w-20 shrink-0">
                <div className="text-[38px] sm:text-[42px] font-bold leading-tight text-[#5f0b62] font-heading tracking-tight">
                  {service.serviceNo}
                </div>
              </div>

              {/* Arrivals Info on Right */}
              <div className="flex-1 flex justify-end gap-5 sm:gap-8 items-center">
                {/* Subsequent Bus (next2) */}
                {next2 && (
                  <div className="text-right flex flex-col items-end opacity-75 hidden sm:flex">
                    <div className="text-[19px] font-semibold text-[#50434d]">
                      {next2.estimatedMin === 0 ? 'Arr' : `${next2.estimatedMin} min`}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[#50434d]">
                      <span className="text-[12px] font-medium font-mono">{next2.type}</span>
                      {next2.feature === 'WAB' && (
                        <span className="material-symbols-outlined text-[16px]">accessible</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Next Bus (Primary) */}
                <div className="text-right flex flex-col items-end min-w-[84px]">
                  <div className="flex items-center gap-2 mb-1">
                    {isLive && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00875A] live-pulse"></div>
                    )}
                    <div
                      className={`text-[20px] font-bold ${
                        isLive ? 'text-[#00875A]' : 'text-[#1b1c1c]'
                      }`}
                    >
                      {isArr ? 'Arr' : `${next.estimatedMin} min`}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#50434d]">
                    {/* Capacity Occupancy Icons */}
                    {next.load === 'SEA' ? (
                      <span
                        className="material-symbols-outlined text-[18px] text-[#00875A]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                        title="Seats Available"
                      >
                        person
                      </span>
                    ) : next.load === 'SDA' ? (
                      <div className="flex text-[#fd8a3b]" title="Standing Available">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          person
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px] -ml-1"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          person
                        </span>
                      </div>
                    ) : (
                      <div className="flex text-[#DE350B]" title="Limited Standing">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          person
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px] -ml-1"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          person
                        </span>
                      </div>
                    )}

                    <span className="text-[12px] font-semibold text-[#50434d] ml-0.5 font-mono">
                      {next.type}
                    </span>

                    {next.feature === 'WAB' && (
                      <span
                        className="material-symbols-outlined text-[16px] text-[#50434d]"
                        title="Wheelchair Accessible"
                      >
                        accessible
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Legend & Help Footer */}
      <div className="mt-6 p-4 bg-white/70 rounded-xl border border-[#d4c1ce]/60 text-xs text-[#50434d] flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="text-[#00875A] font-bold">●</span> Seats Available
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#fd8a3b] font-bold">●</span> Standing
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#DE350B] font-bold">●</span> Crowded
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>SD: Single Deck</span>
          <span>•</span>
          <span>DD: Double Deck</span>
        </div>
      </div>
    </main>
  );
};
