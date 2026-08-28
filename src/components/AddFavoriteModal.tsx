import React, { useState } from 'react';
import { BusStop } from '../types';

interface AddFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStops: BusStop[];
  favoriteStopCodes: string[];
  onAddFavorite: (stopCode: string) => void;
}

export const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({
  isOpen,
  onClose,
  allStops,
  favoriteStopCodes,
  onAddFavorite,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const availableStops = allStops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(search.toLowerCase()) ||
      stop.code.includes(search) ||
      stop.road.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[#d4c1ce] flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-[#d4c1ce] flex justify-between items-center bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5f0b62]">add_location</span>
            <h3 className="font-bold text-[#1b1c1c] text-lg font-heading">Add Favorite Bus Stop</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#82737e] hover:text-[#1b1c1c] rounded-full hover:bg-[#eae7e7]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-[#f0eded]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#82737e] text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stop name or 5-digit code..."
              className="w-full bg-[#F2F2F2] border border-[#d4c1ce] rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5f0b62]"
            />
          </div>
        </div>

        {/* List of stops to add */}
        <div className="overflow-y-auto p-4 flex flex-col gap-2.5 flex-1">
          {availableStops.map((stop) => {
            const isAlreadyAdded = favoriteStopCodes.includes(stop.code);

            return (
              <div
                key={stop.code}
                className="p-3 bg-[#faf8f9] rounded-xl border border-[#d4c1ce]/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-[#1b1c1c] text-sm">{stop.name}</h4>
                  <p className="text-xs text-[#50434d]">
                    <span className="font-mono font-bold text-[#1b1c1c]">{stop.code}</span> •{' '}
                    {stop.road}
                  </p>
                  <p className="text-[11px] text-[#82737e] mt-0.5">
                    Services: {stop.services.join(', ')}
                  </p>
                </div>

                {isAlreadyAdded ? (
                  <span className="text-xs font-semibold text-[#00875A] bg-[#00875A]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check</span>
                    Saved
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onAddFavorite(stop.code);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#5f0b62] hover:bg-[#7a297b] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">star</span>
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
