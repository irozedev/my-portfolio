import { createContext, useContext, useState, useRef, useEffect, useLayoutEffect, ReactNode } from 'react';

type ViewMode = 'client' | 'cv';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isClientMode: boolean;
  isCVMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  // CV comes first, not services and pricing. The audience is recruiters and
  // hiring managers: shown an hourly rate before the experience, they read the
  // page as a freelance pitch rather than a job application. Client mode is
  // still one click away on the toggle.
  // The saved choice is read in the initialiser, not in an effect. As an effect
  // it ran after the first paint, so a returning visitor whose saved mode was
  // `client` got a frame of the CV page and then a full swap to services —
  // which is exactly what "the toggle jumps around" looks like.
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'cv';
    try {
      const saved = localStorage.getItem('viewMode');
      if (saved === 'client' || saved === 'cv') return saved;
    } catch {
      // Private mode / storage disabled — fall through to the default.
    }
    return 'cv';
  });

  // Set when a switch is in flight, so the reset below fires only on a real
  // mode change and never on the first render (which would fight the browser
  // restoring scroll position on a reload, or a #section deep link).
  const pendingReset = useRef(false);

  const setViewMode = (mode: ViewMode) => {
    if (mode === viewMode) return;
    pendingReset.current = true;
    setViewModeState(mode);
    try {
      localStorage.setItem('viewMode', mode);
    } catch {
      // Not being able to remember the choice is not worth breaking the switch.
    }
  };

  // Jump to the top, do not glide, and do it after the new sections are in the
  // DOM.
  //
  // Two things went wrong with the obvious version — a smooth `scrollTo` inside
  // the click handler. Smooth animates through a page that was replaced on the
  // same tick, so the reader watches unrelated content fly past. And scrolling
  // before the commit does not stick: the old, taller tree is still mounted, so
  // the browser's scroll anchoring pulls the viewport back down as the sections
  // above shrink. Measured: the page settled at 135px instead of 0, just far
  // enough for the fixed header to overlap the hero.
  useLayoutEffect(() => {
    if (!pendingReset.current) return;
    pendingReset.current = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [viewMode]);

  // Publish the mode on <html> so CSS can reach it.
  //
  // The 2026 client design has its own palette and its own type — Archivo and
  // Instrument Sans instead of Inter Tight and Inter. The CV keeps what it had,
  // deliberately: it is the page recruiters already read, and it was not part
  // of the redesign. Scoping every new token under [data-view="client"] is what
  // lets one stylesheet carry both without the CV shifting a pixel.
  //
  // useLayoutEffect, not useEffect: as an effect the attribute landed after the
  // first paint, so a returning client-mode visitor got a frame of CV colours.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-view', viewMode);
  }, [viewMode]);

  // The client faces are not in index.html. Fetching them for a CV reader who
  // never switches would be three families of dead weight, so they load the
  // first time client mode is actually shown. Same approach as the Arabic faces
  // in language-context.tsx; the <link> is idempotent and stays for the session.
  useEffect(() => {
    if (typeof document === 'undefined' || viewMode !== 'client') return;
    const id = 'client-fonts';
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,500;75..125,700;75..125,800' +
      '&family=Instrument+Sans:wght@400;500;600' +
      '&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, [viewMode]);

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
