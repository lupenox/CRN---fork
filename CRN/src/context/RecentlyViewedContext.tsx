import React, { createContext, useContext, useState } from 'react';

const MAX_RECENT = 5;

type Resource = {
  id: string | number;
  title: string;
  location: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
};

type RecentlyViewedContextType = {
  recentResources: Resource[];
  addRecentResource: (resource: Resource) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentResources: [],
  addRecentResource: () => {},
});

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentResources, setRecentResources] = useState<Resource[]>([]);

  function addRecentResource(resource: Resource) {
    setRecentResources((prev) => {
      const filtered = prev.filter((r) => r.id !== resource.id);
      return [resource, ...filtered].slice(0, MAX_RECENT);
    });
  }

  return (
    <RecentlyViewedContext.Provider value={{ recentResources, addRecentResource }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}