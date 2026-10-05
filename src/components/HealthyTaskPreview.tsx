"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/content";
import { smoothMotion } from "@/lib/demo-motion";
import { ProgressRing } from "./ProgressRing";
import { TaskMiniScreen } from "./TaskMiniScreen";
import styles from "@/styles/picture-task-preview.module.scss";

const labels: Record<Locale, string> = {
  ru: "Делаем зарядку", en: "Let's exercise", kk: "Жаттығу жасаймыз", uz: "Mashq qilamiz", az: "İdman edirik",
};
const controls: Record<Locale, { pause: string; resume: string; remaining: string }> = {
  ru: { pause: "Пауза", resume: "Продолжить", remaining: "Осталось" },
  en: { pause: "Pause", resume: "Continue", remaining: "Remaining" },
  kk: { pause: "Кідірту", resume: "Жалғастыру", remaining: "Қалғаны" },
  uz: { pause: "Pauza", resume: "Davom etish", remaining: "Qoldi" },
  az: { pause: "Fasilə", resume: "Davam et", remaining: "Qalıb" },
};

function remainingSeconds(elapsed: number) {
  const phase = elapsed % 35000;
  if (phase < 1500) return 180;
  if (phase < 31500) return 180 - (phase - 1500) / 1000;
  if (phase < 32500) return 150;
  return 150 + 30 * smoothMotion((phase - 32500) / 2500);
}

export function HealthyTaskPreview({ locale, playing }: { locale: Locale; playing: boolean }) {
  const elapsed = useRef(0);
  const [seconds, setSeconds] = useState(180);
  const [paused, setPaused] = useState(false);
  const text = controls[locale];
  useEffect(() => {
    if (!playing || paused) return;
    let previous: number | null = null;
    let frame: number;
    const tick = (now: number) => {
      if (previous !== null) elapsed.current += now - previous;
      previous = now;
      setSeconds(remainingSeconds(elapsed.current));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, paused]);
  const displayedSeconds = Math.ceil(seconds);
  const time = `${String(Math.floor(displayedSeconds / 60)).padStart(2, "0")}:${String(displayedSeconds % 60).padStart(2, "0")}`;
  return <TaskMiniScreen current={3} reward={150} instruction={labels[locale]} characterAsset="/assets/task-preview/character-header-3.png" sheetClassName={styles.healthySheet}
    action={<button type="button" className={styles.check} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? text.resume : text.pause}</button>}>
    <div className={styles.healthyRing} role="timer" aria-label={labels[locale]} aria-live="off">
      <ProgressRing progress={seconds / (10 * 60) * 100} strokeWidth={12} rounded />
      <div className={styles.healthyTime}><span>{text.remaining}</span><strong>{time}</strong></div>
    </div>
  </TaskMiniScreen>;
}
