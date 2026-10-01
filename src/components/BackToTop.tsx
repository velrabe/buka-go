"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/back-to-top.module.scss";

const labels: Record<Locale, string> = {
  ru: "Наверх", en: "Back to top", kk: "Жоғарыға", uz: "Yuqoriga", az: "Yuxarı",
};

export function BackToTop({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 400);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <button type="button" className={styles.button} hidden={!visible} aria-label={labels[locale]} title={labels[locale]}
    onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}>
    <img src={siteUrl("/assets/site/_next/static/media/arrow.22vs_qx71wk14.svg")} width="24" height="24" alt="" />
  </button>;
}
