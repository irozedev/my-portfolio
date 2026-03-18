import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ViewMode = 'client' | 'cv';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isClientMode: boolean;
  isCVMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('client');

  // Синхронізація з localStorage
  useEffect(() => {
    const saved = localStorage.getItem('viewMode') as ViewMode;
    if (saved === 'client' || saved === 'cv') {
      setViewModeState(saved);
    }
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('viewMode', mode);
    
    // Scroll to top при зміні режиму
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        setViewMode,
        isClientMode: viewMode === 'client',
        isCVMode: viewMode === 'cv',
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within ViewModeProvider');
  }
  return context;
}
