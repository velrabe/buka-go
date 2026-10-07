"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "@/lib/content";
import styles from "@/styles/hero-composition.module.scss";

const labels: Record<Locale, { title: string; tags: string[] }> = {
  ru: { title: "Возможности BukaGo", tags: ["Местоположение", "Контроль приложений", "Умные паузы", "Переключение внимания", "Задания от родителей", "Лимиты экранного времени", "Обучение по возрасту", "Полезные привычки", "Напоминания об уроках", "Разминка и зарядка для глаз", "Игровые награды", "Геозоны", "История маршрутов", "Логика, чтение и математика"] },
  en: { title: "BukaGo features", tags: ["Location", "App control", "Smart breaks", "Attention switching", "Tasks from parents", "Screen time limits", "Age-appropriate learning", "Healthy habits", "Homework reminders", "Movement and eye exercises", "Game rewards", "Geofences", "Route history", "Logic, reading and math"] },
  kk: { title: "BukaGo мүмкіндіктері", tags: ["Орналасқан жері", "Қолданбаларды бақылау", "Ақылды үзілістер", "Назарды ауыстыру", "Ата-аналардың тапсырмалары", "Экран уақытының шектеулері", "Жасқа сай оқыту", "Пайдалы әдеттер", "Сабақ туралы еске салу", "Дене және көз жаттығулары", "Ойын марапаттары", "Геоаймақтар", "Маршруттар тарихы", "Логика, оқу және математика"] },
  uz: { title: "BukaGo imkoniyatlari", tags: ["Joylashuv", "Ilovalarni nazorat qilish", "Aqlli tanaffuslar", "Diqqatni almashtirish", "Ota-onalardan topshiriqlar", "Ekran vaqti chegaralari", "Yoshga mos ta’lim", "Foydali odatlar", "Darslarni eslatish", "Badantarbiya va ko‘z mashqlari", "O‘yin mukofotlari", "Geozonalar", "Yo‘nalishlar tarixi", "Mantiq, o‘qish va matematika"] },
  az: { title: "BukaGo imkanları", tags: ["Məkan", "Tətbiqlərə nəzarət", "Ağıllı fasilələr", "Diqqətin dəyişdirilməsi", "Valideynlərin tapşırıqları", "Ekran vaxtı limitləri", "Yaşa uyğun öyrənmə", "Faydalı vərdişlər", "Dərs xatırlatmaları", "Hərəkət və göz məşqləri", "Oyun mükafatları", "Geozonalar", "Marşrut tarixçəsi", "Məntiq, oxu və riyaziyyat"] },
};

export function HeroFeatureTicker({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const patentLabels: Record<Locale, string> = {
    ru: "Запатентованная технология", en: "Patented technology", kk: "Патенттелген технология",
    uz: "Patentlangan texnologiya", az: "Patentləşdirilmiş texnologiya",
  };
  const patent = patentLabels[locale];
  const windowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const [layout, setLayout] = useState<{ width: number; batch: number; patent: number; tags: number[] } | null>(null);

  useEffect(() => {
    const viewport = windowRef.current;
    const measure = measureRef.current;
    if (!viewport || !measure) return;
    let mounted = true;
    const update = () => {
      if (!mounted) return;
      const widths = Array.from(measure.children, item => item.getBoundingClientRect().width);
      const width = viewport.getBoundingClientRect().width;
      if (!width || !widths[0]) return;
      setLayout({ width, batch: Math.max(width, widths[0] + Math.max(...widths.slice(1)) + 32), patent: widths[0], tags: widths.slice(1) });
    };
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    void document.fonts.ready.then(update);
    update();
    return () => { mounted = false; observer.disconnect(); };
  }, [locale]);

  // Repeat the accent about once per viewport, keeping every tag in one continuous row.
  const batches: { tags: string[]; width: number }[] = [];
  if (layout) {
    let batch: string[] = [];
    let used = layout.patent;
    copy.tags.forEach((tag, index) => {
      const width = layout.tags[index] + 16;
      if (batch.length && used + width > layout.batch - 16) {
        batches.push({ tags: batch, width: used + 16 });
        batch = [];
        used = layout.patent;
      }
      batch.push(tag);
      used += width;
    });
    batches.push({ tags: batch, width: used + 16 });
  }
  const motion = layout ? {
    "--ticker-duration": `${batches.reduce((total, batch) => total + batch.width, 0) / 36}s`,
    "--ticker-delay": `${-(batches[0].width - layout.width / 2 + layout.patent / 2) / 36}s`,
  } as CSSProperties : undefined;
  return <div className={styles.featureStrip}>
    <div ref={windowRef} className={styles.featureWindow}>
      <ul ref={measureRef} className={`${styles.featureTags} ${styles.featureMeasure}`} aria-hidden="true">
        <li className={styles.patentTag}>{patent}</li>
        {copy.tags.map(tag => <li key={tag}>{tag}</li>)}
      </ul>
      {layout ? <div className={styles.featureTrack} style={motion}>
        {[false, true].flatMap(duplicate => batches.map(({ tags }, index) => <ul key={`${duplicate}-${index}`} className={styles.featureTags} aria-label={duplicate ? undefined : copy.title} aria-hidden={duplicate || undefined}>
          <li className={styles.patentTag} aria-hidden={duplicate || index > 0 || undefined}>{patent}</li>
          {tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>))}
      </div> : <ul className={`${styles.featureTags} ${styles.featureFallback}`} aria-label={copy.title}><li className={styles.patentTag}>{patent}</li></ul>}
    </div>
  </div>;
}
