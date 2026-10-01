"use client";
import { siteUrl } from "@/lib/site-url";


import { useContext } from "react";
import { ContentDemoContext } from "./ContentDemoState";
import styles from "@/styles/screen-time-summary.module.scss";

import { useScreenTranslation } from "./ScreenLocale";

const categories = [
  { title: "Учеба", minutes: 10, icon: "6b4d5c7803e11793.svg", color: "#559be6" },
  { title: "Уроки", minutes: 15, icon: "a357b3331b8b7c1f.svg", color: "#e87979" },
  { title: "Игры", minutes: 35, icon: "game-solid.svg", color: "#e7883f" },
];

/** Figma 3874:64675: 375×286, padding/gaps 16, summary 343×145, action 343×56. */
export function ScreenTimeSummary({ extended = false, standalone = false }: { extended?: boolean; standalone?: boolean }) {
  const frame = useContext(ContentDemoContext);
  const t = useScreenTranslation();
  return <div className={`${styles.summary} ${extended ? styles.extended : ""} ${standalone ? styles.standalone : ""}`} data-figma-node="3874:64675">
    <div className={styles.heading}><strong>{t("Экранное время")}</strong><span>{t("Аналитика")} <img src={siteUrl("/assets/app-content/7c5e9813fdfd1404.svg")} width="6" height="10" alt="" /></span></div>
    <div className={styles.stats}>
      <div className={styles.date}>{t("Сегодня, 9 июля")}</div>
      <div className={styles.total}><strong>{t("2ч 15мин")}</strong><span style={{ opacity: frame.limitOpacity }}>{t(`из 4ч ${frame.dailyLimit === 255 ? "15" : "00"}мин`)}</span></div>
      <div className={styles.bar} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.categories}>{categories.map(category => <div key={t(category.title)} style={{ color: category.color, background: `${category.color}1a` }}>
        <span className={styles.icon} style={{ maskImage: `url(${siteUrl(`/assets/app-content/${category.icon}`)})` }} />
        <span><strong>{t(category.title)}</strong><small>{t(`${category.minutes} мин`)}</small></span>
      </div>)}</div>
    </div>
    <div className={styles.add} data-demo-target="add" data-demo-button="true">
      <span className={styles.clock}><img src={siteUrl("/assets/app-content/026cc3bf14ea7730.svg")} width="16" height="16" alt="" /></span>
      <strong>{t("Добавить время")}</strong>
      <span className={styles.chevron}><img src={siteUrl("/assets/app-content/349b472d0de52d09.svg")} width="8" height="12" alt="" /></span>
    </div>
    {standalone && <div className={styles.settings}>{t("Настройки")}</div>}
    {extended && <>
      <div className={styles.settings}>{t("Настройки")}</div>
      <div className={styles.smartHeading}><strong>{t("Умные режимы")} <b>PRO</b></strong><span>{t("Расписание ›")}</span></div>
      <div className={styles.activeMode}><small>{t("АКТИВНЫЙ РЕЖИМ:")}</small><div><strong><span className={styles.icon} style={{ maskImage: `url(${siteUrl("/assets/app-content/game-solid.svg")})` }} />{t("Игры")}</strong><span>17:00 – 18:30</span></div></div>
    </>}
  </div>;
}
