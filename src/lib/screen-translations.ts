import translations from "@/content/screen-translations.json";

export function translateScreen(text: string, locale: string = "ru"): string {
  if (locale === "ru") return text;
  const dictionary = translations[locale as keyof typeof translations] as Record<string, string> | undefined;
  if (!dictionary) return text;
  const normalized = text.replace(/\u2028/g, "\n");
  const exact = dictionary[text] ?? dictionary[normalized];
  if (exact !== undefined) return exact;
  const units = {
    en: { h: "h", min: "min", of: "of", today: "today" },
    kk: { h: "сағ", min: "мин", of: "/", today: "бүгін" },
    uz: { h: "soat", min: "daq", of: "/", today: "bugun" },
    az: { h: "saat", min: "dəq", of: "/", today: "bu gün" },
  }[locale];
  if (!units) return text;
  return text.replace(/из /g, `${units.of} `).replace(/за сегодня/g, units.today)
    .replace(/(\d)\s*ч(?:асов)?/g, `$1 ${units.h} `).replace(/(\d)\s*мин/g, `$1 ${units.min}`).trim();
}
