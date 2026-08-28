import React, { useState } from 'react';
import { BusStop } from '../types';
import { BUS_ROUTES_DATABASE } from '../data/transitData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onSelectService: (serviceNo: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stops,
  onSelectStop,
  onSelectService,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stops' | 'services'>('all');

  if (!isOpen) return null;

  const services = Object.keys(BUS_ROUTES_DATABASE);

  const filteredServices = services.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(query.toLowerCase()) ||
      stop.code.includes(query) ||
      stop.road.toLowerCase().includes(query.toLowerCase()) ||
      stop.services.some((svc) => svc.includes(query))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-20">
      <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-[#d4c1ce] flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="p-4 border-b border-[#d4c1ce] flex items-center gap-2 bg-[#fcf9f8]">
          <span className="material-symbols-outlined text-[#82737e]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bus number (e.g. 175, 14) or bus stop..."
            className="flex-1 text-[16px] bg-transparent outline-none placeholder-[#50434d]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#82737e] hover:text-[#1b1c1c] p-1">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#5f0b62] px-2.5 py-1 bg-[#5f0b62]/10 rounded-lg hover:bg-[#5f0b62]/20"
          >
            Cancel
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#f0eded] flex gap-2 bg-white">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              filterType === 'all'
                ? 'bg-[#5f0b62] text-white'
                : 'bg-[#F2F2F2] text-[#50434d] hover:bg-[#eae7e7]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('services')}
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              filterType === 'services'
                ? 'bg-[#5f0b62] text-white'
                : 'bg-[#F2F2F2] text-[#50434d] hover:bg-[#eae7e7]'
            }`}
          >
            Services ({filteredServices.length})
          </button>
          <button
            onClick={() => setFilterType('stops')}
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              filterType === 'stops'
                ? 'bg-[#5f0b62] text-white'
                : 'bg-[#F2F2F2] text-[#50434d] hover:bg-[#eae7e7]'
            }`}
          >
            Bus Stops ({filteredStops.length})
          </button>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-4 flex flex-col gap-4 flex-1">
          {/* Services Group */}
          {(filterType === 'all' || filterType === 'services') && filteredServices.length > 0 && (
            <div>
              <div className="text-xs font-bold text-[#50434d] uppercase tracking-wider mb-2">
                Bus Services
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {filteredServices.map((svc) => (
                  <button
                    key={svc}
                    onClick={() => {
                      onSelectService(svc);
                      onClose();
                    }}
                    className="p-2.5 bg-[#F2F2F2] hover:bg-[#5f0b62] hover:text-white rounded-xl font-bold text-center text-[16px] text-[#5f0b62] transition-colors active:scale-95 border border-[#d4c1ce]/50 flex flex-col items-center"
                  >
                    <span>{svc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stops Group */}
          {(filterType === 'all' || filterType === 'stops') && filteredStops.length > 0 && (
            <div>
              <div className="text-xs font-bold text-[#50434d] uppercase tracking-wider mb-2">
                Bus Stops
              </div>
              <div className="flex flex-col gap-2">
                {filteredStops.map((stop) => (
                  <button
                    key={stop.code}
                    onClick={() => {
                      onSelectStop(stop);
                      onClose();
                    }}
                    className="p-3 bg-[#faf8f9] hover:bg-[#eae7e7] rounded-xl border border-[#d4c1ce]/60 text-left transition-colors flex items-center justify-between active:scale-[0.99]"
                  >
                    <div>
                      <div className="font-semibold text-[#1b1c1c] text-[15px]">{stop.name}</div>
                      <div className="text-xs text-[#50434d] mt-0.5">
                        <span className="font-mono bg-[#eae7e7] px-1.5 py-0.5 rounded font-semibold text-[#1b1c1c]">
                          {stop.code}
                        </span>{' '}
                        • {stop.road}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#82737e]">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredServices.length === 0 && filteredStops.length === 0 && (
            <div className="py-8 text-center text-[#50434d]">
              <span className="material-symbols-outlined text-3xl text-[#82737e] mb-1">
                search_off
              </span>
              <p className="text-sm">No bus stops or services matching "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
