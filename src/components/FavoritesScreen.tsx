import React, { useState } from 'react';
import { BusStop, RecentItem } from '../types';

interface FavoritesScreenProps {
  onSelectStopCode: (stopCode: string) => void;
  onSelectService: (serviceNo: string) => void;
  onOpenAddFavoriteModal: () => void;
  recentItems: RecentItem[];
  onClearRecent: () => void;
  favoriteStopCodes: string[];
  onRemoveFavorite: (stopCode: string) => void;
  allStops: BusStop[];
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onSelectStopCode,
  onSelectService,
  onOpenAddFavoriteModal,
  recentItems,
  onClearRecent,
  favoriteStopCodes,
  onRemoveFavorite,
  allStops,
}) => {
  const [activeSegment, setActiveSegment] = useState<'favorites' | 'recent'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="max-w-3xl mx-auto px-4 py-4 w-full flex flex-col gap-4">
      {/* Segmented Control matching Image 7 */}
      <div className="flex bg-[#e5e2e1] rounded-full p-1 w-full max-w-sm mx-auto shadow-inner">
        <button
          id="tab-segmented-favorites"
          onClick={() => setActiveSegment('favorites')}
          className={`flex-1 py-2 text-center rounded-full font-semibold text-[14px] transition-all ${
            activeSegment === 'favorites'
              ? 'bg-[#5f0b62] text-white shadow-sm'
              : 'text-[#50434d] hover:text-[#1b1c1c]'
          }`}
        >
          Favorites
        </button>
        <button
          id="tab-segmented-recent"
          onClick={() => setActiveSegment('recent')}
          className={`flex-1 py-2 text-center rounded-full font-semibold text-[14px] transition-all ${
            activeSegment === 'recent'
              ? 'bg-[#5f0b62] text-white shadow-sm'
              : 'text-[#50434d] hover:text-[#1b1c1c]'
          }`}
        >
          Recent
        </button>
      </div>

      {/* Search input matching Image 7 */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82737e] text-[20px]">
          search
        </span>
        <input
          id="fav-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search saved bus stops or routes..."
          className="w-full bg-white border border-[#d4c1ce] rounded-full py-3 pl-11 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#5f0b62] focus:border-transparent placeholder-[#50434d]/70 shadow-xs transition-shadow"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#82737e] hover:text-[#1b1c1c]"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {activeSegment === 'favorites' ? (
        <div id="favorites-view" className="flex flex-col gap-4">
          {/* Saved Stop Card 1: Bedok Int (84009) matching Image 7 */}
          <div
            id="fav-card-84009"
            className="bg-white border border-[#d4c1ce] rounded-xl p-4 flex flex-col gap-3 shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => onSelectStopCode('84009')}
              >
                <div className="bg-[#7a297b]/15 p-2 rounded-full flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[#5f0b62] text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    directions_bus
                  </span>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1b1c1c] font-heading leading-tight hover:text-[#5f0b62] transition-colors">
                    Bedok Int (84009)
                  </h3>
                  <p className="text-[13px] text-[#50434d] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>Towards Tampines Int</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveFavorite('84009')}
                aria-label="Remove Bedok Int from favorites"
                className="text-[#5f0b62] hover:bg-[#eae7e7] p-2 rounded-full transition-colors active:scale-90"
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </button>
            </div>

            {/* Grid of 4 boxes matching Image 7 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
              {/* Box 1: Service 7 */}
              <button
                onClick={() => onSelectService('7')}
                className="bg-[#F2F2F2] rounded-lg p-3 flex flex-col items-center justify-center border border-[#d4c1ce]/40 hover:bg-[#eae7e7] transition-colors active:scale-95 text-center"
              >
                <span className="text-[22px] text-[#5f0b62] font-bold font-heading leading-none">
                  7
                </span>
                <span className="text-[12px] text-[#00875A] font-semibold flex items-center gap-1 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse"></span>
                  <span>2 min</span>
                </span>
              </button>

              {/* Box 2: Service 14 */}
              <button
                onClick={() => onSelectService('14')}
                className="bg-[#F2F2F2] rounded-lg p-3 flex flex-col items-center justify-center border border-[#d4c1ce]/40 hover:bg-[#eae7e7] transition-colors active:scale-95 text-center"
              >
                <span className="text-[22px] text-[#5f0b62] font-bold font-heading leading-none">
                  14
                </span>
                <span className="text-[12px] text-[#50434d] font-semibold mt-1.5">
                  5 min
                </span>
              </button>

              {/* Box 3: Service 196 (Delay warning) */}
              <button
                onClick={() => onSelectService('196')}
                className="bg-[#F2F2F2] rounded-lg p-3 flex flex-col items-center justify-center border border-[#d4c1ce]/40 hover:bg-[#eae7e7] transition-colors active:scale-95 text-center"
              >
                <span className="text-[22px] text-[#5f0b62] font-bold font-heading leading-none">
                  196
                </span>
                <span className="text-[12px] text-[#DE350B] font-semibold flex items-center gap-1 mt-1.5">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  <span>12 min</span>
                </span>
              </button>

              {/* Box 4: View All */}
              <button
                onClick={() => onSelectStopCode('84009')}
                className="bg-[#eae7e7] rounded-lg p-3 flex flex-col items-center justify-center hover:bg-[#e5e2e1] transition-colors border border-[#d4c1ce]/40 group active:scale-95"
              >
                <span className="material-symbols-outlined text-[#5f0b62] group-hover:scale-110 transition-transform text-lg">
                  add
                </span>
                <span className="text-[12px] font-semibold text-[#5f0b62] mt-1">
                  View All
                </span>
              </button>
            </div>
          </div>

          {/* Saved Stop Card 2: Opp Bugis Stn (01113) matching Image 7 */}
          <div
            id="fav-card-01113"
            className="bg-white border border-[#d4c1ce] rounded-xl p-4 flex flex-col gap-3 shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => onSelectStopCode('01113')}
              >
                <div className="bg-[#7a297b]/15 p-2 rounded-full flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[#5f0b62] text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    directions_bus
                  </span>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1b1c1c] font-heading leading-tight hover:text-[#5f0b62] transition-colors">
                    Opp Bugis Stn (01113)
                  </h3>
                  <p className="text-[13px] text-[#50434d] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>Victoria St</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveFavorite('01113')}
                aria-label="Remove Opp Bugis Stn from favorites"
                className="text-[#5f0b62] hover:bg-[#eae7e7] p-2 rounded-full transition-colors active:scale-90"
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </button>
            </div>

            {/* Grid of boxes matching Image 7 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
              {/* Box 1: Service 2 */}
              <button
                onClick={() => onSelectService('2')}
                className="bg-[#F2F2F2] rounded-lg p-3 flex flex-col items-center justify-center border border-[#d4c1ce]/40 hover:bg-[#eae7e7] transition-colors active:scale-95 text-center"
              >
                <span className="text-[22px] text-[#5f0b62] font-bold font-heading leading-none">
                  2
                </span>
                <span className="text-[12px] text-[#00875A] font-semibold flex items-center gap-1 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse"></span>
                  <span>Arr</span>
                </span>
              </button>

              {/* Box 2: Service 32 (No Svc) */}
              <div className="bg-[#F2F2F2] rounded-lg p-3 flex flex-col items-center justify-center border border-[#d4c1ce]/40 opacity-70 text-center">
                <span className="text-[22px] text-[#5f0b62] font-bold font-heading leading-none">
                  32
                </span>
                <span className="text-[12px] text-[#50434d] font-medium mt-1.5">
                  No Svc
                </span>
              </div>

              {/* Box 3: Full Timings Action */}
              <button
                onClick={() => onSelectStopCode('01113')}
                className="bg-[#eae7e7] rounded-lg p-3 flex flex-col items-center justify-center hover:bg-[#e5e2e1] transition-colors border border-[#d4c1ce]/40 group md:col-span-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[#5f0b62] group-hover:translate-x-1 transition-transform text-lg">
                  arrow_forward
                </span>
                <span className="text-[12px] font-semibold text-[#5f0b62] mt-1">
                  Full Timings
                </span>
              </button>
            </div>
          </div>

          {/* Additional saved stops if user added more */}
          {favoriteStopCodes
            .filter((c) => c !== '84009' && c !== '01113')
            .map((code) => {
              const stop = allStops.find((s) => s.code === code);
              if (!stop) return null;
              return (
                <div
                  key={code}
                  className="bg-white border border-[#d4c1ce] rounded-xl p-4 flex justify-between items-center shadow-xs cursor-pointer hover:bg-[#faf8f9]"
                  onClick={() => onSelectStopCode(code)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#7a297b]/15 p-2 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#5f0b62]">
                        directions_bus
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1b1c1c] text-base">{stop.name}</h4>
                      <p className="text-xs text-[#50434d]">
                        {stop.code} • {stop.road}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(code);
                    }}
                    className="p-2 text-[#5f0b62]"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </button>
                </div>
              );
            })}

          {/* Quick Action Button matching Image 7 */}
          <button
            id="btn-add-favorite-stop"
            onClick={onOpenAddFavoriteModal}
            className="w-full bg-[#5f0b62] text-white font-semibold text-[15px] py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#7a297b] transition-colors shadow-sm active:scale-[0.99] mt-2"
          >
            <span className="material-symbols-outlined text-[22px]">add_location</span>
            <span>Add New Favorite Stop</span>
          </button>
        </div>
      ) : (
        /* Recent Tab View */
        <div id="recent-view" className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold text-[#50434d] uppercase tracking-wider">
              Recently Viewed ({recentItems.length})
            </span>
            {recentItems.length > 0 && (
              <button
                onClick={onClearRecent}
                className="text-xs text-[#5f0b62] hover:underline font-medium"
              >
                Clear History
              </button>
            )}
          </div>

          {recentItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-[#50434d] border border-[#d4c1ce]">
              <span className="material-symbols-outlined text-4xl text-[#82737e] mb-2">
                history
              </span>
              <p className="text-sm font-medium">No recent bus stops or routes viewed yet.</p>
            </div>
          ) : (
            recentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'stop') onSelectStopCode(item.code);
                  else onSelectService(item.code);
                }}
                className="bg-white border border-[#d4c1ce] rounded-xl p-3.5 flex items-center justify-between hover:bg-[#faf8f9] transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f0eded] text-[#5f0b62] rounded-lg flex items-center justify-center font-bold">
                    {item.type === 'service' ? (
                      <span className="text-sm">{item.code}</span>
                    ) : (
                      <span className="material-symbols-outlined text-xl">directions_bus</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1b1c1c]">{item.title}</h4>
                    <p className="text-xs text-[#50434d] mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#82737e] text-lg">
                  chevron_right
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
};
