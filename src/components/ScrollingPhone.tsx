"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ContentDemoContext } from "./ContentDemoState";
import { sampleContentDemo, DEMO_DURATION } from "@/lib/content-demo-timeline";
import { FloatingTimeCard, ModeConfirmation, MinecraftCard } from "./ContentDemoScenes";
import styles from "@/styles/content-screen.module.scss";

const labels: Record<string, { pause: string; play: string; screen: string }> = {
  ru: { pause: "Приостановить", play: "Продолжить", screen: "Экран приложения: учёт времени, умные режимы и приложения ребёнка" },
  en: { pause: "Pause", play: "Resume", screen: "App preview: screen time, smart modes and child’s apps" },
  kk: { pause: "Кідірту", play: "Жалғастыру", screen: "Қолданба: экран уақыты және баланың қолданбалары" },
  uz: { pause: "Pauza", play: "Davom etish", screen: "Ilova: ekran vaqti va bolaning ilovalari" },
  az: { pause: "Dayandır", play: "Davam et", screen: "Tətbiq: ekran vaxtı və uşağın tətbiqləri" },
};

export function ScrollingPhone({ children, status, navigation, locale }: {
  children: ReactNode; status: ReactNode; navigation: ReactNode; locale: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const clock = useRef(0);
  const frame = sampleContentDemo(elapsed);
  const running = !paused && inView && tabVisible && !reducedMotion;
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
      if (previous !== undefined) clock.current = (clock.current + (now - previous) / 1000) % DEMO_DURATION;
      previous = now;
      setElapsed(clock.current);
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [running]);

  const floatingScale = Math.min(0.8, scale * 0.94);
  const confirmation = frame.modal === "confirm";
  return (
    <ContentDemoContext.Provider value={frame}><div className={styles.demo}>
      <div className={styles.stage} data-press={frame.press} data-focus={frame.focus} style={{ "--tap": frame.tap, "--guide-strength": frame.focusAmount } as CSSProperties}>
        <div className={styles.shell}>
          <div className={styles.viewport} ref={viewport}>
            <div className={styles.phone} style={{ transform: `scale(${scale})`, opacity: 1 - .7 * frame.backgroundDim }}>
              <div className={styles.status} aria-hidden="true">{status}</div>
              <div className={styles.scrollWindow} tabIndex={0} role="region" aria-label={text.screen}>
                <div className={styles.track} aria-hidden="true" style={{ transform: `translateY(${-frame.scroll}px)` }}>
                  <div className={styles.copy}><ContentDemoContext.Provider value={frame.resetOverview ? sampleContentDemo(0) : frame}>{children}</ContentDemoContext.Provider></div>
                </div>
                <div className={styles.detail} aria-hidden="true" style={{
                  opacity: frame.card, visibility: frame.card > 0 ? "visible" : "hidden",
                  transform: `translateX(${(1 - frame.card) * 100}%)`,
                }}><MinecraftCard frame={frame} /></div>
              </div>
              <div className={styles.navigation} aria-hidden="true">{navigation}</div>
            </div>
          </div>
        </div>
        <div className={styles.floating} data-side={frame.modal === "add" ? "right" : "left"} aria-hidden="true" style={{
          width: 351 * floatingScale,
          opacity: frame.modalOpacity,
          visibility: frame.modal ? "visible" : "hidden",
          transform: `translateY(${(1 - frame.modalOpacity) * 16}px)`,
        }}>
          <div style={{ width: 351, transform: `scale(${floatingScale})`, transformOrigin: "top left" }}>
            {confirmation ? <ModeConfirmation frame={frame} /> : <FloatingTimeCard frame={frame} />}
          </div>
        </div>
      </div>
      <button className={styles.pause} type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? text.play : text.pause}
      </button>
    </div></ContentDemoContext.Provider>
  );
}
