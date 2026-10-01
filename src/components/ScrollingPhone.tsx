"use client";

import { useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { TimeVisualReady } from "./TimeVisual";
import { demoMotion } from "@/lib/demo-motion";
import { ContentDemoContext } from "./ContentDemoState";
import { sampleContentDemo, sampleAddTimeDemo, ADD_TIME_DURATION } from "@/lib/content-demo-timeline";
import { FloatingTimeCard, ModeConfirmation, MinecraftCard } from "./ContentDemoScenes";
import styles from "@/styles/content-screen.module.scss";

const labels: Record<string, { pause: string; play: string; screen: string }> = {
  ru: { pause: "Приостановить", play: "Продолжить", screen: "Экран приложения: учёт времени, умные режимы и приложения ребёнка" },
  en: { pause: "Pause", play: "Resume", screen: "App preview: screen time, smart modes and child’s apps" },
  kk: { pause: "Кідірту", play: "Жалғастыру", screen: "Қолданба: экран уақыты және баланың қолданбалары" },
  uz: { pause: "Pauza", play: "Davom etish", screen: "Ilova: ekran vaqti va bolaning ilovalari" },
  az: { pause: "Dayandır", play: "Davam et", screen: "Tətbiq: ekran vaxtı və uşağın tətbiqləri" },
};

export function ScrollingPhone({ children, locale, extended = false, deviceHeader, deviceFooter, standalone = false }: {
  children: ReactNode; locale: string; extended?: boolean; deviceHeader?: ReactNode; deviceFooter?: ReactNode; standalone?: boolean;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const clock = useRef(0);
  const frame = sampleAddTimeDemo(Math.max(0, elapsed - 1));
  const compositionReady = useContext(TimeVisualReady);
  const running = compositionReady && inView && tabVisible && !reducedMotion;
  const text = labels[locale] || labels.ru;

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 375));
    const visibility = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    const onVisibility = () => setTabVisible(!document.hidden);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReducedMotion(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);
    resize.observe(element);
    visibility.observe(element);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      motion.removeEventListener("change", onMotion);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let previous: number | undefined;
    let request = 0;
    const tick = (now: number) => {
      if (previous !== undefined) clock.current = (clock.current + (now - previous) / 1000) % (ADD_TIME_DURATION + 1);
      previous = now;
      setElapsed(clock.current);
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [running]);

  const floatingScale = Math.min(0.8, Math.max(0.68, (scale ?? 0.68) * 0.94));
  // Reserve room for the fully expanded picker, plus the guide and shadow.
  const componentFitRatio = Math.min(375 * .82 / 351, 470 * .84 / 600);
  const componentModalScale = (scale ?? 0) * componentFitRatio;
  const componentCardScale = 1 - (1 - componentFitRatio) * frame.backgroundDim;
  const confirmation = frame.modal === "confirm";
  const dialog = <div className={styles.dialogPerspective}>{confirmation ? <ModeConfirmation frame={frame} /> : <FloatingTimeCard frame={frame} />}</div>;
  const dialogStyle: CSSProperties = {
    opacity: frame.modalOpacity,
    visibility: frame.modal ? "visible" : "hidden",
    transform: `translate(-50%, calc(-50% + ${(1 - frame.modalOpacity) * demoMotion.modalLift}px))`,
  };
  if (standalone) return <ContentDemoContext.Provider value={frame}>
    <div className={`${styles.demo} ${styles.componentDemo}`}>
      <div ref={viewport} className={`${styles.stage} ${styles.componentStage}`} data-press={frame.press} data-focus={frame.focus} style={{ "--tap": frame.tap, "--guide-strength": frame.focusAmount } as CSSProperties}>
        <div className={styles.componentCard} style={{ width: 375 * (scale ?? 0), opacity: 1 - .7 * frame.backgroundDim, transform: `translate(calc(-50% - ${18 * frame.backgroundDim}px), -50%) scale(${componentCardScale})` }}>
          <div style={{ width: 375, zoom: scale ?? 0 }} onClick={() => { clock.current = 2.15; setElapsed(2.15); }}>{children}</div>
        </div>
        <div className={styles.componentModal} style={{ opacity: frame.modalOpacity, visibility: frame.modal ? "visible" : "hidden", width: 351 * componentModalScale, transform: `translate(-50%, -50%) scale(${.88 + .12 * frame.modalOpacity})` }}>
          <div style={{ width: 351, zoom: componentModalScale }}>{dialog}</div>
        </div>
      </div>
    </div>
  </ContentDemoContext.Provider>;
  return (
    <ContentDemoContext.Provider value={frame}><div className={`${styles.demo} ${extended ? styles.extended : ""}`}>
      <div className={styles.stage} data-press={frame.press} data-focus={frame.focus} style={{ "--tap": frame.tap, "--guide-strength": frame.focusAmount, "--modal-progress": frame.backgroundDim } as CSSProperties}>
        <div className={styles.shell} style={extended ? { transform: `translateY(${18 * frame.backgroundDim}px) scale(${1 - .48 * frame.backgroundDim})` } : undefined}>
          <div className={styles.viewport} ref={viewport}>
            <div className={styles.phone} style={{ "--phone-scale": scale ?? 0 } as CSSProperties}>
              <div className={styles.overview} style={{ opacity: 1 - .7 * frame.backgroundDim }}>
                {extended && <div className={styles.deviceHeader}>{deviceHeader}</div>}
                <div className={styles.scrollWindow} tabIndex={0} role="region" aria-label={text.screen}>
                  <div className={styles.track} aria-hidden="true" style={{ transform: `translateY(${-frame.scroll}px)` }}>
                    <div className={styles.copy}><ContentDemoContext.Provider value={frame.resetOverview ? sampleContentDemo(0) : frame}>{children}</ContentDemoContext.Provider></div>
                  </div>
                  <div className={styles.detail} aria-hidden="true" style={{ opacity: frame.card, visibility: frame.card > 0 ? "visible" : "hidden", transform: `translateX(${(1 - frame.card) * 100}%)` }}><MinecraftCard frame={frame} /></div>
                </div>
                {extended && <div className={styles.deviceFooter}>{deviceFooter}</div>}
              </div>
              {extended && <div className={styles.embeddedDialog} aria-hidden="true" style={dialogStyle}>{dialog}</div>}
            </div>
          </div>
        </div>
        {!extended && <div className={styles.floating} data-side={frame.modal === "add" ? "right" : "left"} aria-hidden="true" style={{ ...dialogStyle, width: 351 * floatingScale }}>
          <div style={{ width: 351, zoom: floatingScale }}>{dialog}</div>
        </div>}
      </div>
    </div></ContentDemoContext.Provider>
  );
}
