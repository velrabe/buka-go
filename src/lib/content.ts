import ru from "@/content/locales/ru.json";
import en from "@/content/locales/en.json";
import kk from "@/content/locales/kk.json";
import uz from "@/content/locales/uz.json";
import az from "@/content/locales/az.json";
import pages from "@/content/pages.json";
import aliases from "@/content/aliases.json";

export type Locale = "ru" | "en" | "kk" | "uz" | "az";
export type Messages = typeof ru;
export type ContentPage = (typeof pages)[number];
export const messages: Record<Locale, Messages> = { ru, en, kk, uz, az };
export const languages: {
  locale: Locale;
  label: string;
  home: string;
  prefix: string;
}[] = [
  { locale: "ru", label: "Русский", home: "/", prefix: "/ru" },
  { locale: "en", label: "English", home: "/en/", prefix: "/en" },
  { locale: "kk", label: "Қазақша", home: "/kz/", prefix: "/kz/kk" },
  { locale: "uz", label: "Oʻzbekcha", home: "/uz/", prefix: "/uz" },
  { locale: "az", label: "AZ", home: "/az/", prefix: "/az" },
];
export const localeFor = (path: string): Locale =>
  path.startsWith("/kz")
    ? "kk"
    : (languages.find(
        (l) => path.startsWith(l.prefix + "/") || path === l.prefix,
      )?.locale ?? "ru");
export const languageFor = (locale: Locale) =>
  languages.find((l) => l.locale === locale)!;
export const articles = pages
  .filter((p) => p.kind === "article")
  .sort((a, b) => b.published.localeCompare(a.published));
export const legalSlugs = [
  "user-agreement",
  "privacy-policy",
  "personal-data-consent",
  "offer",
  "account-deletion",
  "requisites",
  "it-accreditation",
];
export const blogPath = (locale: Locale) =>
  languageFor(locale).prefix + "/blog/";
export const pageSize = 18;
export const blogCount = Math.ceil(articles.length / pageSize);

export function resolvePath(path: string) {
  const canonical = (aliases as Record<string, string>)[path];
  if (canonical) return canonical;
  if (path === "/ru") return "/";
  if (path.startsWith("/legal/")) return "/ru" + path;
  if (path.startsWith("/blog")) return "/ru" + path;
  if (path === "/kz/kk") return "/kz";
  return path;
}
export function getPage(path: string) {
  return pages.find((p) => p.path === resolvePath(path));
}
export function isHome(path: string) {
  return ["/", "/ru", "/en", "/kz", "/kz/kk", "/uz", "/az"].includes(path);
}
export function isBlog(path: string) {
  return /\/(?:blog)(?:\/page-\d+)?$/.test(path);
}

export const routes = Array.from(
  new Set([
    "/",
    "/ru",
    "/en",
    "/kz",
    "/kz/kk",
    "/uz",
    "/az",
    "/survey",
    ...pages.map((p) => p.path),
    ...languages.map((l) => `${l.prefix}/blog`),
    "/kz/blog",
    "/blog",
    ...Array.from(
      { length: blogCount - 1 },
      (_, i) => `/ru/blog/page-${i + 2}`,
    ),
    ...Array.from({ length: blogCount - 1 }, (_, i) => `/blog/page-${i + 2}`),
    ...legalSlugs.map((slug) => `/legal/${slug}`),
    ...Object.keys(aliases),
  ]),
);
