import type { Locale } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/country-availability.module.scss";

const copy = {
  ru: { title: "Доступно в странах", countries: ["Россия", "Узбекистан", "Казахстан"] },
  en: { title: "Available in", countries: ["Russia", "Uzbekistan", "Kazakhstan"] },
  kk: { title: "Қолжетімді елдер", countries: ["Ресей", "Өзбекстан", "Қазақстан"] },
  uz: { title: "Mavjud mamlakatlar", countries: ["Rossiya", "O‘zbekiston", "Qozog‘iston"] },
  az: { title: "Mövcud olduğu ölkələr", countries: ["Rusiya", "Özbəkistan", "Qazaxıstan"] },
};
const countries = [{ locale: "ru", href: "/#download" }, { locale: "uz", href: "/uz/#download" }, { locale: "kk", href: "/kz/#download" }];

export function CountryAvailability({ locale, footer = false, compact = false }: { locale: Locale; footer?: boolean; compact?: boolean }) {
  const m = copy[locale];
  return <div className={`${styles.block} ${footer ? styles.footer : ""} ${compact ? styles.compact : ""}`}>
    <p className={styles.title}>{m.title}</p>
    <nav className={styles.links} aria-label={m.title}>{countries.map((country, index) =>
      <a key={country.locale} href={siteUrl(country.href)}><img src={siteUrl(`/assets/flags/${country.locale}.svg`)} width="24" height="16" alt="" /><span>{m.countries[index]}</span></a>
    )}</nav>
  </div>;
}
