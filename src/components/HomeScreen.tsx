import React, { useState } from 'react';
import { BusStop, BusArrivalInfo } from '../types';

interface HomeScreenProps {
  nearbyStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onSelectService: (serviceNo: string) => void;
  onViewAllFavorites: () => void;
  isFavoriteStop: (code: string) => boolean;
  toggleFavoriteStop: (stop: BusStop) => void;
  getArrivalsForStop: (code: string) => BusArrivalInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSearchModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  nearbyStops,
  onSelectStop,
  onSelectService,
  onViewAllFavorites,
  isFavoriteStop,
  toggleFavoriteStop,
  getArrivalsForStop,
  searchQuery,
  setSearchQuery,
  onOpenSearchModal,
}) => {
  const [favoriteServices, setFavoriteServices] = useState([
    { serviceNo: '14', name: 'Orchard Stn/Tang Plaza', time: '2 min', isLive: true, stopCode: '09047' },
    { serviceNo: '65', name: 'Bef Tampines West Stn', time: '8 min', isLive: false, stopCode: '75059' },
  ]);

  // Filter stops based on search query if typed directly
  const filteredStops = searchQuery.trim()
    ? nearbyStops.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.includes(searchQuery) ||
          s.road.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.services.some((svc) => svc.includes(searchQuery))
      )
    : nearbyStops;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Search Bar matching Image 1 */}
      <section className="w-full">
        <div className="relative w-full h-12">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#82737e]">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
          <input
            id="home-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bus stops or services..."
            className="block w-full h-full pl-11 pr-10 py-2 border border-[#d4c1ce] rounded-lg bg-white text-[#1b1c1c] placeholder-[#50434d] focus:outline-none focus:border-[#5f0b62] focus:ring-1 focus:ring-[#5f0b62] text-[15px] transition-shadow shadow-sm"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#82737e] hover:text-[#1b1c1c]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          ) : (
            <button
              onClick={onOpenSearchModal}
              title="Filter / All Services"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#82737e] hover:text-[#5f0b62]"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
            </button>
          )}
        </div>
      </section>

      {/* Favorites Section (Bento style) matching Image 1 */}
      <section>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h2 className="text-[20px] font-semibold text-[#1b1c1c] tracking-tight font-heading">
            Favorites
          </h2>
          <button
            id="btn-view-all-favorites"
            onClick={onViewAllFavorites}
            className="text-[#5f0b62] text-[14px] font-semibold hover:underline active:opacity-75 transition-all"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Favorite Item 1: Service 14 */}
          <button
            id="fav-bento-1"
            onClick={() => onSelectService(favoriteServices[0].serviceNo)}
            className="bg-white p-4 rounded-xl border border-[#d4c1ce] hover:bg-[#faf8f9] transition-all flex flex-col items-start gap-2 active:scale-[0.98] text-left shadow-sm group"
          >
            <div className="flex justify-between w-full items-center">
              <span className="bg-[#5f0b62] text-white text-[20px] px-2.5 py-1 rounded font-bold tracking-tight">
                {favoriteServices[0].serviceNo}
              </span>
              <span
                className="material-symbols-outlined text-[#5f0b62]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div className="text-left w-full mt-1">
              <p className="text-[15px] font-normal text-[#1b1c1c] truncate">
                {favoriteServices[0].name}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#00875A] pulse-animation"></span>
                <span className="text-[12px] text-[#00875A] font-semibold">
                  {favoriteServices[0].time}
                </span>
              </div>
            </div>
          </button>

          {/* Favorite Item 2: Service 65 */}
          <button
            id="fav-bento-2"
            onClick={() => onSelectService(favoriteServices[1].serviceNo)}
            className="bg-white p-4 rounded-xl border border-[#d4c1ce] hover:bg-[#faf8f9] transition-all flex flex-col items-start gap-2 active:scale-[0.98] text-left shadow-sm group"
          >
            <div className="flex justify-between w-full items-center">
              <span className="bg-[#5f0b62] text-white text-[20px] px-2.5 py-1 rounded font-bold tracking-tight">
                {favoriteServices[1].serviceNo}
              </span>
              <span
                className="material-symbols-outlined text-[#5f0b62]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div className="text-left w-full mt-1">
              <p className="text-[15px] font-normal text-[#1b1c1c] truncate">
                {favoriteServices[1].name}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[12px] text-[#50434d] font-medium">
                  {favoriteServices[1].time}
                </span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Nearby Bus Stops Section matching Image 1 */}
      <section>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-[20px] font-semibold text-[#1b1c1c] tracking-tight font-heading">
            Nearby Bus Stops
          </h2>
          <span className="text-xs text-[#50434d] bg-[#eae7e7] px-2 py-0.5 rounded-full font-medium">
            GPS Active
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {filteredStops.map((stop) => {
            const arrivals = getArrivalsForStop(stop.code);
            const isFav = isFavoriteStop(stop.code);

            return (
              <div
                key={stop.id}
                id={`stop-card-${stop.code}`}
                className="bg-white border border-[#d4c1ce] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Stop Card Header */}
                <div className="p-4 border-b border-[#d4c1ce]/70 flex justify-between items-start bg-[#fcf9f8]/60">
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => onSelectStop(stop)}
                  >
                    <h3 className="text-[19px] font-semibold text-[#1b1c1c] hover:text-[#5f0b62] transition-colors leading-snug">
                      {stop.name}
                    </h3>
                    <p className="text-[14px] text-[#50434d] mt-0.5">
                      {stop.code} • {stop.distance || '100m away'}
                    </p>
                  </div>
                  <button
                    id={`btn-fav-stop-${stop.code}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteStop(stop);
                    }}
                    aria-label={`Favorite ${stop.name}`}
                    className="p-1.5 text-[#82737e] hover:text-[#5f0b62] transition-colors rounded-full active:scale-90"
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{
                        fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0",
                        color: isFav ? '#5f0b62' : '#82737e',
                      }}
                    >
                      star
                    </span>
                  </button>
                </div>

                {/* Services Arrival List inside Stop Card */}
                <div className="p-4 flex flex-col gap-3">
                  {arrivals.slice(0, 2).map((arrival, index) => {
                    const isArr = arrival.nextBus.estimatedMin === 0;
                    const isLowLoad = arrival.nextBus.load === 'SEA';
                    const isMediumLoad = arrival.nextBus.load === 'SDA';

                    return (
                      <div
                        key={arrival.serviceNo}
                        id={`service-row-${stop.code}-${arrival.serviceNo}`}
                        onClick={() => onSelectService(arrival.serviceNo)}
                        className="flex justify-between items-center h-12 cursor-pointer hover:bg-[#fcf9f8] -mx-2 px-2 rounded-lg transition-colors"
                      >
                        {/* Service Number Badge & Load icon */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-[#5f0b62] text-white rounded flex items-center justify-center text-[19px] font-bold shadow-xs">
                            {arrival.serviceNo}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {isLowLoad ? (
                              <span className="material-symbols-outlined text-[18px] text-[#00875A]">
                                person
                              </span>
                            ) : isMediumLoad ? (
                              <div className="flex text-[#fd8a3b]">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                <span className="material-symbols-outlined text-[18px]">person</span>
                              </div>
                            ) : (
                              <div className="flex text-[#DE350B]">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                <span className="material-symbols-outlined text-[18px]">person</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timing Display */}
                        <div className="text-right">
                          {isArr ? (
                            <span className="text-[24px] font-bold text-[#1b1c1c] tracking-tight">
                              Arr
                            </span>
                          ) : (
                            <span className="text-[24px] font-bold text-[#1b1c1c] tracking-tight">
                              {arrival.nextBus.estimatedMin}{' '}
                              <span className="text-[16px] font-normal text-[#50434d]">
                                min
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {arrivals.length > 2 && (
                    <button
                      onClick={() => onSelectStop(stop)}
                      className="text-xs text-[#5f0b62] font-semibold text-center pt-1 hover:underline flex items-center justify-center gap-1"
                    >
                      <span>+{arrivals.length - 2} more services</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
