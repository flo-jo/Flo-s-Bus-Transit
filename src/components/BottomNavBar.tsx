import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'favorites', label: 'Favorites', icon: 'star' },
    { id: 'route', label: 'Route', icon: 'alt_route' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-[#fcf9f8] border-t border-[#d4c1ce]/80 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-2"
    >
      <div className="flex w-full max-w-lg justify-around items-center mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (isActive) {
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                className="flex flex-col items-center justify-center bg-[#7a297b] text-white rounded-full px-4 py-1 active:scale-90 duration-200 transition-all shadow-sm"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {tab.icon}
                </span>
                <span className="text-[11px] font-semibold tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className="flex flex-col items-center justify-center text-[#50434d] p-2 hover:bg-[#f0eded] hover:text-[#5f0b62] rounded-full transition-all active:scale-90 duration-200"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] font-medium mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
