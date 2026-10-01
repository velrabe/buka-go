"use client";

import { createContext, useEffect, useRef, useState, type ReactNode } from "react";

// Start the UI demo once the fixed scene is visible.
export const TimeVisualReady = createContext(true);

export function TimeVisual({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < .45) return;
      setReady(true);
      observer.disconnect();
    }, { threshold: .45, rootMargin: "0px 0px -8% 0px" });
    observer.observe(element);
    return () => { observer.disconnect(); };
  }, []);
  return <TimeVisualReady.Provider value={ready}>
    <div ref={root} className={`time-visual ${className}`}>{children}</div>
  </TimeVisualReady.Provider>;
}
