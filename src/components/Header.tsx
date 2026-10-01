"use client";

import { useState } from "react";
import type { Locale, Messages } from "@/lib/content";

// Small client-side list: article content stays in server components.
const choices = [
  { locale: "ru", label: "Русский", home: "/", prefix: "/ru" },
  { locale: "en", label: "English", home: "/en/", prefix: "/en" },
  { locale: "kk", label: "Қазақша", home: "/kz/", prefix: "/kz/kk" },
  { locale: "uz", label: "Oʻzbekcha", home: "/uz/", prefix: "/uz" },
  { locale: "az", label: "AZ", home: "/az/", prefix: "/az" },
];

export function Header({
  locale,
  path,
  messages: m,
}: {
  locale: Locale;
  path: string;
  messages: Messages;
}) {
  const [open, setOpen] = useState(false);
  const lang = choices.find((l) => l.locale === locale)!;
  const links = [
    [m.header.howItWorks, `${lang.home}#how-it-works`],
    [m.header.tasks, `${lang.home}#tasks`],
    [m.header.howToConnect, `${lang.home}#how-to-connect`],
    [m.header.forFamily, `${lang.home}#why-works`],
    [m.header.blog, `${lang.prefix}/blog/`],
  ];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          className="brand"
          href={lang.home}
          aria-label={m.common.homeAriaLabel}
        >
          <img
            src="/assets/site/images/logo.png"
            width="36"
            height="36"
            alt=""
          />
          <span>BukaGo</span>
        </a>
        <nav
          id="main-navigation"
          className={`navigation ${open ? "is-open" : ""}`}
          aria-label={m.common.home}
          onClick={() => setOpen(false)}
        >
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
          <a className="button nav-download" href={`${lang.home}#download`}>
            {m.header.downloadApp}
          </a>
        </nav>
        <div className="header-actions">
          <select
            aria-label={m.languageSwitcher.label}
            value={locale}
            onChange={(e) => {
              const target = choices.find((l) => l.locale === e.target.value)!;
              const legal = path.match(/\/legal\/(.+)/);
              const destination = legal
                ? `${target.prefix}/legal/${legal[1]}/`
                : path.includes("/blog")
                  ? `${target.prefix}/blog/`
                  : target.home;
              try {
                localStorage.setItem("bukago-language", target.locale);
              } catch {}
              window.location.assign(
                destination +
                  (path.includes("/blog") || legal ? "" : window.location.hash),
              );
            }}
          >
            {choices.map((l) => (
              <option key={l.locale} value={l.locale}>
                {l.label}
              </option>
            ))}
          </select>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={m.common.openMenuAriaLabel}
            onClick={() => setOpen(!open)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
