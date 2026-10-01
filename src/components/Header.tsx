"use client";

import { useEffect, useRef, useState } from "react";
import { siteUrl } from "@/lib/site-url";
import type { Locale, Messages } from "@/lib/content";
import { BackToTop } from "./BackToTop";
import styles from "@/styles/header.module.scss";

const choices = [
  { locale: "ru", label: "Русский", home: "/", prefix: "/ru" },
  { locale: "en", label: "English", home: "/en/", prefix: "/en" },
  { locale: "kk", label: "Қазақша", home: "/kz/", prefix: "/kz/kk" },
  { locale: "uz", label: "Oʻzbekcha", home: "/uz/", prefix: "/uz" },
  { locale: "az", label: "Azərbaycan", home: "/az/", prefix: "/az" },
];
const closeMenuLabels: Record<Locale, string> = {
  ru: "Закрыть меню", en: "Close menu", kk: "Мәзірді жабу", uz: "Menyuni yopish", az: "Menyunu bağla",
};

export function Header({ locale, path, messages: m }: { locale: Locale; path: string; messages: Messages }) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const languageTrigger = useRef<HTMLButtonElement>(null);
  const lang = choices.find(l => l.locale === locale)!;
  const links = [
    [m.header.howItWorks, `${lang.home}#how-it-works`],
    [m.header.tasks, `${lang.home}#tasks`],
    [m.header.howToConnect, `${lang.home}#how-to-connect`],
    [m.header.forFamily, `${lang.home}#why-works`],
    [m.header.blog, `${lang.prefix}/blog/`],
  ];

  useEffect(() => {
    if (!open && !languageOpen) return;
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
        setLanguageOpen(false);
      }
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open, languageOpen]);

  function changeLanguage(target: (typeof choices)[number]) {
    const legal = path.match(/\/legal\/(.+)/);
    const destination = legal ? `${target.prefix}/legal/${legal[1]}/`
      : path.includes("/blog") ? `${target.prefix}/blog/` : target.home;
    try { localStorage.setItem("bukago-language", target.locale); } catch {}
    window.location.assign(siteUrl(destination) + (path.includes("/blog") || legal ? "" : window.location.hash));
  }

  return <>
    <header ref={root} className={styles.header}
      onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setLanguageOpen(false);
        }
      }}
      onKeyDown={event => {
        if (event.key === "Escape") {
          if (languageOpen) { setLanguageOpen(false); languageTrigger.current?.focus(); }
          else if (open) { setOpen(false); menuTrigger.current?.focus(); }
        }
      }}>
      <div className={styles.inner}>
        <a className={styles.brand} href={siteUrl(lang.home)} aria-label={m.common.homeAriaLabel}>
          <img className={styles.logoIcon} src={siteUrl("/assets/download/app-logo.png")} width="40" height="40" alt="" />
          <img className={styles.wordmark} src={siteUrl("/assets/site/images/bukago-logo.png")} width="100" height="20" alt="BukaGo" />
        </a>
        <nav id="main-navigation" className={`${styles.navigation} ${open ? styles.open : ""}`} aria-label={m.common.home}
          onClick={() => setOpen(false)}>
          {links.map(([label, href], index) => <a className={index === links.length - 1 ? styles.blogLink : undefined} key={href} href={siteUrl(href)}>{label}</a>)}
          <a className={styles.download} href={siteUrl(`${lang.home}#download`)}>{m.header.downloadApp}</a>
        </nav>
        <div className={styles.actions}>
          <div className={styles.language}>
            <button ref={languageTrigger} type="button" className={styles.languageTrigger} aria-label={m.languageSwitcher.label}
              aria-expanded={languageOpen} aria-controls="header-languages"
              onClick={() => { setLanguageOpen(value => !value); setOpen(false); }}>
              <span>{lang.label}</span><span className={styles.chevron} aria-hidden="true" />
            </button>
            <ul id="header-languages" className={styles.languageList} hidden={!languageOpen}>
              {choices.map(choice => <li key={choice.locale}>
                <button type="button" lang={choice.locale} aria-current={choice.locale === locale ? "true" : undefined}
                  onClick={() => { setLanguageOpen(false); if (choice.locale !== locale) changeLanguage(choice); }}>{choice.label}</button>
              </li>)}
            </ul>
          </div>
          <button ref={menuTrigger} type="button" className={styles.menuToggle}
            aria-expanded={open} aria-controls="main-navigation"
            aria-label={open ? closeMenuLabels[locale] : m.common.openMenuAriaLabel}
            onClick={() => { setOpen(value => !value); setLanguageOpen(false); }}>
            <img src={siteUrl(`/assets/site/_next/static/media/${open ? "close.0fu98zm2y7381.svg" : "menu.265zhu825z3az.svg"}`)} width="16" height="16" alt="" />
          </button>
        </div>
      </div>
    </header>
    <BackToTop locale={locale} />
  </>;
}
