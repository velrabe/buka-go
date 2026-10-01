"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const text = labels[locale] || labels.ru;

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 375));
    const visibility = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    const onVisibility = () => setTabVisible(!document.hidden);
    resize.observe(element);
    visibility.observe(element);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className={styles.demo}>
      <div className={styles.shell} data-paused={paused || !inView || !tabVisible}>
        <div className={styles.viewport} ref={viewport}>
          <div className={styles.phone} style={{ transform: `scale(${scale})` }}>
            <div className={styles.status} aria-hidden="true">{status}</div>
            <div className={styles.scrollWindow} tabIndex={0} role="region" aria-label={text.screen}>
              <div className={styles.track} aria-hidden="true">
                <div className={styles.copy}>{children}</div>
                <div className={`${styles.copy} ${styles.duplicate}`}>{children}</div>
              </div>
            </div>
            <div className={styles.navigation} aria-hidden="true">{navigation}</div>
          </div>
        </div>
      </div>
      <button className={styles.pause} type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? text.play : text.pause}
      </button>
    </div>
  );
}
