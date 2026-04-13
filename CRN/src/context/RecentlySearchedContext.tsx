import React, { createContext, useContext, useState, useCallback } from 'react';

export type SearchEntry = {
  id: string;
  query: string;
  section: 'Events' | 'Classes' | 'Directory';
  timestamp: number;
};

type RecentlySearchedContextType = {
  recentSearches: SearchEntry[];
  addRecentSearch: (query: string, section: SearchEntry['section']) => void;
  clearRecentSearches: () => void;
};

const RecentlySearchedContext = createContext<RecentlySearchedContextType>({
  recentSearches: [],
  addRecentSearch: () => {},
  clearRecentSearches: () => {},
});

export function RecentlySearchedProvider({ children }: { children: React.ReactNode }) {
  const [recentSearches, setRecentSearches] = useState<SearchEntry[]>([]);

  const addRecentSearch = useCallback((query: string, section: SearchEntry['section']) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (e) => !(e.query.toLowerCase() === query.toLowerCase() && e.section === section)
      );
      const entry: SearchEntry = {
        id: `${section}-${Date.now()}`,
        query: query.trim(),
        section,
        timestamp: Date.now(),
      };
      return [entry, ...filtered].slice(0, 10); // keep last 10
    });
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  return (
    <RecentlySearchedContext.Provider value={{ recentSearches, addRecentSearch, clearRecentSearches }}>
      {children}
    </RecentlySearchedContext.Provider>
  );
}

export function useRecentlySearched() {
  return useContext(RecentlySearchedContext);
}