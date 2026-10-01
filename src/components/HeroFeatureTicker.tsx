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
  return <div className={styles.featureStrip}>
    <div className={styles.featureWindow}>
      <div className={styles.featureTrack}>
        {[false, true].map(duplicate => <ul key={String(duplicate)} className={styles.featureTags} aria-label={duplicate ? undefined : copy.title} aria-hidden={duplicate || undefined}>
          {copy.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>)}
      </div>
    </div>
  </div>;
}
