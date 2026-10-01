"use client";

import { useState } from "react";
import type { Locale } from "@/lib/content";
import styles from "@/styles/time-feature-preview.module.scss";

const labels = {
  ru: { title: "Экранное время", used: "2ч 15мин", limit: "из 4 часов", add: "Добавить время", modes: "Умные режимы", categories: ["Учёба", "Уроки", "Игры"], minutes: "мин", close: "Закрыть", added: "Добавлено" },
  en: { title: "Screen time", used: "2h 15min", limit: "of 4 hours", add: "Add time", modes: "Smart modes", categories: ["Learning", "Lessons", "Games"], minutes: "min", close: "Close", added: "Added" },
  kk: { title: "Экран уақыты", used: "2сағ 15мин", limit: "4 сағаттан", add: "Уақыт қосу", modes: "Ақылды режимдер", categories: ["Оқу", "Сабақтар", "Ойындар"], minutes: "мин", close: "Жабу", added: "Қосылды" },
  uz: { title: "Ekran vaqti", used: "2s 15daq", limit: "4 soatdan", add: "Vaqt qo‘shish", modes: "Aqlli rejimlar", categories: ["Ta’lim", "Darslar", "O‘yinlar"], minutes: "daq", close: "Yopish", added: "Qo‘shildi" },
  az: { title: "Ekran vaxtı", used: "2s 15dəq", limit: "4 saatdan", add: "Vaxt əlavə et", modes: "Ağıllı rejimlər", categories: ["Təhsil", "Dərslər", "Oyunlar"], minutes: "dəq", close: "Bağla", added: "Əlavə edildi" },
};

export function TimeFeaturePreview({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(15);
  const [added, setAdded] = useState(0);
  return <div className={styles.preview}>
    <div className={styles.card}>
      <h3>{text.title}</h3>
      <div className={styles.summary}>
        <div className={styles.amount}><strong>{text.used}</strong><span>{text.limit}{added > 0 && ` + ${added} ${text.minutes}`}</span></div>
        <div className={styles.bar} aria-hidden="true"><i style={{ width: `${85 / (240 + added) * 100}%` }} /><i style={{ width: `${15 / (240 + added) * 100}%` }} /><i style={{ width: `${35 / (240 + added) * 100}%` }} /></div>
        <div className={styles.categories}>{text.categories.map((name, i) => <span key={name} data-category={i}><i />{name}</span>)}</div>
      </div>
      <button className={styles.add} onClick={() => setOpen(true)} aria-expanded={open}>＋ <span>{text.add}</span></button>
      <div className={styles.modes} aria-hidden="true">{text.modes} <small>PRO</small></div>
    </div>
    {open && <form className={styles.editor} aria-label={text.add} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }} onSubmit={event => { event.preventDefault(); setAdded(value => value + minutes); setOpen(false); }}>
      <div className={styles.editorHeading}><strong>{text.add}</strong><button type="button" aria-label={text.close} onClick={() => setOpen(false)}>×</button></div>
      <div className={styles.choices}>{[15, 30, 60].map(value => <button autoFocus={value === 15} key={value} type="button" aria-pressed={minutes === value} onClick={() => setMinutes(value)}>{value} {text.minutes}</button>)}</div>
      <button className={styles.add} type="submit">{text.add}</button>
    </form>}
    <span className={styles.live} role="status">{added > 0 ? `${text.added}: ${added} ${text.minutes}` : ""}</span>
  </div>;
}
