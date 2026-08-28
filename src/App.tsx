import React, { useState, useEffect, useCallback } from 'react';
import { TabType, BusStop, AppSettings, RecentItem, BusArrivalInfo } from './types';
import {
  BUS_STOPS_DATABASE,
  BUS_ROUTES_DATABASE,
  getBusArrivalsForStop,
  INITIAL_FAVORITES_STOPS,
  INITIAL_RECENT_ITEMS,
} from './data/transitData';
import { fetchLiveBusArrivals } from './services/ltaApi';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { BusStopDetailScreen } from './components/BusStopDetailScreen';
import { RouteScreen } from './components/RouteScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SearchModal } from './components/SearchModal';
import { AddFavoriteModal } from './components/AddFavoriteModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [selectedServiceNo, setSelectedServiceNo] = useState<string>('175');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAddFavoriteModalOpen, setIsAddFavoriteModalOpen] = useState<boolean>(false);

  // Live arrivals map fetched from backend LTA proxy
  const [liveArrivalsMap, setLiveArrivalsMap] = useState<
    Record<string, { arrivals: BusArrivalInfo[]; source: 'lta_live' | 'simulated'; lastUpdated: number }>
  >({});

  // Favorites state with localStorage persistence
  const [favoriteStopCodes, setFavoriteStopCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_favorite_stops');
      return saved ? JSON.parse(saved) : INITIAL_FAVORITES_STOPS;
    } catch {
      return INITIAL_FAVORITES_STOPS;
    }
  });

  const [favoriteServiceNos, setFavoriteServiceNos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_favorite_services');
      return saved ? JSON.parse(saved) : ['14', '65', '175'];
    } catch {
      return ['14', '65', '175'];
    }
  });

  // Recent items state
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_recent_items');
      return saved ? JSON.parse(saved) : INITIAL_RECENT_ITEMS;
    } catch {
      return INITIAL_RECENT_ITEMS;
    }
  });

  // App settings state with 20s default refresh
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('sbs_settings');
      return saved
        ? JSON.parse(saved)
        : {
            autoRefresh: true,
            refreshInterval: 20, // 20-second LTA standard refresh
            wheelchairOnly: false,
            showCapacityIndicators: true,
            hapticFeedback: true,
            highContrast: false,
            compactView: false,
          };
    } catch {
      return {
        autoRefresh: true,
        refreshInterval: 20,
        wheelchairOnly: false,
        showCapacityIndicators: true,
        hapticFeedback: true,
        highContrast: false,
        compactView: false,
      };
    }
  });

  // Fetch arrival timings for a stop code from the backend proxy
  const refreshStopArrivals = useCallback(async (stopCode: string) => {
    try {
      const result = await fetchLiveBusArrivals(stopCode);
      setLiveArrivalsMap((prev) => ({
        ...prev,
        [stopCode]: {
          arrivals: result.arrivals,
          source: result.source,
          lastUpdated: result.lastUpdated,
        },
      }));
    } catch (e) {
      console.warn('Error fetching live arrivals for', stopCode, e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sbs_favorite_stops', JSON.stringify(favoriteStopCodes));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteStopCodes]);

  useEffect(() => {
    try {
      localStorage.setItem('sbs_favorite_services', JSON.stringify(favoriteServiceNos));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteServiceNos]);

  useEffect(() => {
    try {
      localStorage.setItem('sbs_recent_items', JSON.stringify(recentItems));
    } catch (e) {
      console.error(e);
    }
  }, [recentItems]);

  useEffect(() => {
    try {
      localStorage.setItem('sbs_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Initial fetch for nearby stops
  useEffect(() => {
    BUS_STOPS_DATABASE.slice(0, 4).forEach((stop) => {
      refreshStopArrivals(stop.code);
    });
    // Also fetch favorite stops
    favoriteStopCodes.forEach((code) => {
      refreshStopArrivals(code);
    });
  }, [refreshStopArrivals, favoriteStopCodes]);

  // Selected stop fetch
  useEffect(() => {
    if (selectedStop) {
      refreshStopArrivals(selectedStop.code);
    }
  }, [selectedStop, refreshStopArrivals]);

  // Live timer auto-refresh (20s default)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!settings.autoRefresh) return;
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);

      // Refresh currently selected stop or active screen stops
      if (selectedStop) {
        refreshStopArrivals(selectedStop.code);
      } else if (activeTab === 'home') {
        BUS_STOPS_DATABASE.slice(0, 4).forEach((stop) => {
          refreshStopArrivals(stop.code);
        });
      } else if (activeTab === 'favorites') {
        favoriteStopCodes.forEach((code) => {
          refreshStopArrivals(code);
        });
      }
    }, settings.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [settings.autoRefresh, settings.refreshInterval, selectedStop, activeTab, favoriteStopCodes, refreshStopArrivals]);

  // Add item to recent history
  const addRecentItem = (type: 'stop' | 'service', code: string, title: string, subtitle: string) => {
    setRecentItems((prev) => {
      const filtered = prev.filter((i) => !(i.type === type && i.code === code));
      return [{ id: `rec-${Date.now()}`, type, code, title, subtitle, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });
  };

  // Handlers for Stop selection
  const handleSelectStop = (stop: BusStop) => {
    setSelectedStop(stop);
    refreshStopArrivals(stop.code);
    addRecentItem('stop', stop.code, stop.name, `${stop.code} • ${stop.road}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStopCode = (stopCode: string) => {
    const found = BUS_STOPS_DATABASE.find((s) => s.code === stopCode);
    if (found) {
      handleSelectStop(found);
    } else {
      // Fallback virtual stop
      handleSelectStop({
        id: `stop-${stopCode}`,
        code: stopCode,
        name: `Bus Stop (${stopCode})`,
        road: 'Singapore Road Network',
        services: ['14', '65', '175'],
        lat: 1.3000,
        lng: 103.8500,
      });
    }
  };

  // Handlers for Service selection
  const handleSelectService = (serviceNo: string) => {
    setSelectedServiceNo(serviceNo);
    const route = BUS_ROUTES_DATABASE[serviceNo];
    if (route) {
      addRecentItem('service', serviceNo, `Service ${serviceNo}`, `${route.origin} ↔ ${route.destination}`);
    }
    setActiveTab('route');
    setSelectedStop(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite stop
  const toggleFavoriteStop = (stop: BusStop) => {
    setFavoriteStopCodes((prev) =>
      prev.includes(stop.code) ? prev.filter((c) => c !== stop.code) : [...prev, stop.code]
    );
  };

  // Toggle favorite service
  const toggleFavoriteService = (serviceNo: string) => {
    setFavoriteServiceNos((prev) =>
      prev.includes(serviceNo) ? prev.filter((s) => s !== serviceNo) : [...prev, serviceNo]
    );
  };

  const handleBack = () => {
    setSelectedStop(null);
  };

  const handleResetAllData = () => {
    setFavoriteStopCodes(INITIAL_FAVORITES_STOPS);
    setFavoriteServiceNos(['14', '65', '175']);
    setRecentItems(INITIAL_RECENT_ITEMS);
    localStorage.removeItem('sbs_favorite_stops');
    localStorage.removeItem('sbs_favorite_services');
    localStorage.removeItem('sbs_recent_items');
  };

  const handleRefreshNow = () => {
    setTick((prev) => prev + 1);
    if (selectedStop) {
      refreshStopArrivals(selectedStop.code);
    } else {
      BUS_STOPS_DATABASE.slice(0, 4).forEach((stop) => {
        refreshStopArrivals(stop.code);
      });
    }
  };

  // Filter arrivals if wheelchair filter is on
  const getArrivals = (code: string): BusArrivalInfo[] => {
    const live = liveArrivalsMap[code]?.arrivals;
    const raw = live && live.length > 0 ? live : getBusArrivalsForStop(code);
    if (!settings.wheelchairOnly) return raw;
    return raw.filter((a) => a.nextBus.feature === 'WAB');
  };

  return (
    <div className={`min-h-screen bg-[#F2F2F2] text-[#1b1c1c] pb-24 pt-16 font-body-md ${settings.highContrast ? 'contrast-125' : ''}`}>
      {/* Top Header matching all screens */}
      <Header
        currentTab={activeTab}
        selectedStopCode={selectedStop ? selectedStop.code : null}
        onBack={handleBack}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onBusIconClick={() => {
          setSelectedStop(null);
          setActiveTab('home');
        }}
        title={selectedStop ? "Flo's Transit" : "Flo's Transit"}
        isLiveUpdating={settings.autoRefresh}
      />

      {/* Main Content Area */}
      <main className="px-3 sm:px-4 py-3 max-w-4xl mx-auto">
        {selectedStop ? (
          /* Screen 3: Bus Stop Detail View (Image 5) */
          <BusStopDetailScreen
            stop={selectedStop}
            arrivals={getArrivals(selectedStop.code)}
            isFavorite={favoriteStopCodes.includes(selectedStop.code)}
            onToggleFavorite={() => toggleFavoriteStop(selectedStop)}
            onSelectService={handleSelectService}
          />
        ) : activeTab === 'home' ? (
          /* Screen 1: Home View (Image 1) */
          <HomeScreen
            nearbyStops={BUS_STOPS_DATABASE.slice(0, 4)}
            onSelectStop={handleSelectStop}
            onSelectService={handleSelectService}
            onViewAllFavorites={() => setActiveTab('favorites')}
            isFavoriteStop={(code) => favoriteStopCodes.includes(code)}
            toggleFavoriteStop={toggleFavoriteStop}
            getArrivalsForStop={getArrivals}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
          />
        ) : activeTab === 'favorites' ? (
          /* Screen 4: Favorites View (Image 7) */
          <FavoritesScreen
            onSelectStopCode={handleSelectStopCode}
            onSelectService={handleSelectService}
            onOpenAddFavoriteModal={() => setIsAddFavoriteModalOpen(true)}
            recentItems={recentItems}
            onClearRecent={() => setRecentItems([])}
            favoriteStopCodes={favoriteStopCodes}
            onRemoveFavorite={(code) =>
              setFavoriteStopCodes((prev) => prev.filter((c) => c !== code))
            }
            allStops={BUS_STOPS_DATABASE}
          />
        ) : activeTab === 'route' ? (
          /* Screen 2: Route View (Image 3) */
          <RouteScreen
            selectedServiceNo={selectedServiceNo}
            onSelectService={handleSelectService}
            onSelectStopCode={handleSelectStopCode}
            isFavoriteService={(svc) => favoriteServiceNos.includes(svc)}
            onToggleFavoriteService={toggleFavoriteService}
          />
        ) : (
          /* Settings View */
          <SettingsScreen
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings((s) => ({ ...s, ...newSettings }))}
            onResetAllData={handleResetAllData}
            onRefreshNow={handleRefreshNow}
          />
        )}
      </main>

      {/* Global Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={selectedStop ? 'route' : activeTab}
        onChangeTab={(tab) => {
          setSelectedStop(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        stops={BUS_STOPS_DATABASE}
        onSelectStop={handleSelectStop}
        onSelectService={handleSelectService}
      />

      {/* Add Favorite Modal */}
      <AddFavoriteModal
        isOpen={isAddFavoriteModalOpen}
        onClose={() => setIsAddFavoriteModalOpen(false)}
        allStops={BUS_STOPS_DATABASE}
        favoriteStopCodes={favoriteStopCodes}
        onAddFavorite={(code) => {
          if (!favoriteStopCodes.includes(code)) {
            setFavoriteStopCodes((prev) => [...prev, code]);
          }
        }}
      />
    </div>
  );
}
