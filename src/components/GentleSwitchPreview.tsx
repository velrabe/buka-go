"use client";

import { useState } from "react";
import type { Locale } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import preview from "@/content/gentle-switch-preview.json";
import styles from "@/styles/gentle-switch-preview.module.scss";
import taskStyles from "@/styles/picture-task-preview.module.scss";
import { TaskMiniScreen } from "./TaskMiniScreen";

const labels: Record<Locale, {
  heading: string; kind: string; title: string; goal: string; charity: string;
  action: string; later: string; timer: string; selected: string; postponed: string;
}> = {
  ru: { heading: preview.heading, kind: preview.kind, title: preview.title, goal: preview.rewards[0].label, charity: preview.rewards[1].label, action: preview.action, later: preview.later, timer: "До паузы", selected: "Задание выбрано", postponed: "Пауза отложена" },
  en: { heading: "A break is coming soon", kind: "Healthy minute", title: "Eye exercises", goal: "For a goal", charity: "For good", action: "Do the task", later: "Later", timer: "Until the break", selected: "Task selected", postponed: "Break postponed" },
  kk: { heading: "Үзіліс жақында басталады", kind: "Денсаулық минуты", title: "Көзге арналған жаттығу", goal: "Мақсатқа", charity: "Жақсылыққа", action: "Тапсырманы орындау", later: "Кейін", timer: "Үзіліске дейін", selected: "Тапсырма таңдалды", postponed: "Үзіліс кейінге қалдырылды" },
  uz: { heading: "Tanaffus tez orada boshlanadi", kind: "Sogʻlom daqiqa", title: "Koʻzlar uchun mashq", goal: "Maqsad uchun", charity: "Yaxshilik uchun", action: "Topshiriqni bajarish", later: "Keyinroq", timer: "Tanaffusgacha", selected: "Topshiriq tanlandi", postponed: "Tanaffus kechiktirildi" },
  az: { heading: "Fasilə tezliklə başlayacaq", kind: "Sağlamlıq dəqiqəsi", title: "Gözlər üçün məşq", goal: "Məqsəd üçün", charity: "Xeyir üçün", action: "Tapşırığı yerinə yetir", later: "Sonra", timer: "Fasiləyə qədər", selected: "Tapşırıq seçildi", postponed: "Fasilə təxirə salındı" },
};

export function GentleSwitchPreview({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [choice, setChoice] = useState<"task" | "later" | null>(null);
  const time = `${String(Math.floor(preview.seconds / 60)).padStart(2, "0")}:${String(preview.seconds % 60).padStart(2, "0")}`;
  return <TaskMiniScreen className={styles.screen} sheetClassName={styles.sheet} reward={0} instruction={t.heading}
    showBubble={false} sourceId={preview.source.rootId}
    result={choice === "task" ? t.selected : choice === "later" ? t.postponed : ""}
    header={<div className={`${taskStyles.topbar} ${styles.notice}`} data-figma-node="3989:84611">
      <p>{t.heading}</p>
    </div>}
    observerVisual={<div className={styles.timerStage}>
      <div className={styles.timer} role="timer" aria-label={`${t.heading}: ${time}`} aria-live="off" data-figma-node="3989:84614">
        {Array.from(time).map((character, index) => <span key={index} className={character === ":" ? styles.separator : styles.digit} aria-hidden="true">{character}</span>)}
      </div>
    </div>}
    action={<div className={styles.actions}>
      <button type="button" className={`${taskStyles.check} ${styles.action}`} data-figma-node="3989:84636" aria-pressed={choice === "task"} onClick={() => setChoice("task")}>{t.action}</button>
      <button type="button" className={`${taskStyles.check} ${styles.later}`} data-figma-node="3989:84637" aria-pressed={choice === "later"} onClick={() => setChoice("later")}>{t.later}</button>
    </div>}>
    <div className={styles.exercise} data-figma-node="3989:84620">
      <div className={styles.exerciseHeading}>
        <h4>{t.title}</h4>
      </div>
      <div className={styles.rewards}>
        {preview.rewards.map((reward, index) => <div className={styles.reward} key={reward.id} data-figma-node={reward.id}>
          <div><img src={siteUrl(reward.asset)} width="24" height="24" alt="" /><span>{reward.value}</span></div>
          <p>{index === 0 ? t.goal : t.charity}</p>
        </div>)}
      </div>
    </div>
  </TaskMiniScreen>;
}
