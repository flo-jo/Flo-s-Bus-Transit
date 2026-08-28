import React from 'react';
import { FlosTransitLogo } from './FlosTransitLogo';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  selectedStopCode: string | null;
  onBack: () => void;
  onOpenSearch: () => void;
  onBusIconClick: () => void;
  title?: string;
  isLiveUpdating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedStopCode,
  onBack,
  onOpenSearch,
  onBusIconClick,
  title = "Flo's Transit",
  isLiveUpdating = true,
}) => {
  const showBackButton = selectedStopCode !== null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#fcf9f8] border-b border-[#d4c1ce]/80 shadow-none transition-all">
      {/* Left button */}
      {showBackButton ? (
        <button
          id="btn-header-back"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#eae7e7] text-[#50434d] active:scale-95 transition-all duration-150"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
      ) : (
        <button
          id="btn-header-bus"
          onClick={onBusIconClick}
          aria-label="Flo's Transit Menu"
          className="p-2 -ml-2 text-[#5f0b62] hover:bg-[#eae7e7] transition-colors rounded-full active:opacity-80 active:scale-95 duration-150 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-2xl">directions_bus</span>
        </button>
      )}

      {/* Center title / logo */}
      <div className="flex items-center justify-center h-full flex-1 px-2">
        {selectedStopCode ? (
          <h1 className="text-[22px] font-bold text-[#5f0b62] truncate text-center tracking-tight font-heading">
            {title}
          </h1>
        ) : (
          <div
            className="flex items-center justify-center h-full cursor-pointer transition-transform active:scale-98"
            onClick={onBusIconClick}
          >
            <FlosTransitLogo size="md" />
          </div>
        )}
      </div>

      {/* Right Search / Action Button */}
      <div className="flex items-center gap-1">
        {isLiveUpdating && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#00875A]/10 text-[#00875A] mr-1">
            <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse"></span>
            LIVE
          </span>
        )}
        <button
          id="btn-header-search"
          onClick={onOpenSearch}
          aria-label="Search bus stops or services"
          className="p-2 -mr-2 text-[#5f0b62] hover:bg-[#eae7e7] transition-colors rounded-full active:opacity-80 active:scale-95 duration-150 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      </div>
    </header>
  );
};
