"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/content";
import { HeroAppScreen } from "./HeroAppScreen";
import { HeroFeatureTicker } from "./HeroFeatureTicker";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/hero-composition.module.scss";

export function HeroComposition({ children, locale }: { children: ReactNode; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const foregroundImage = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = foregroundImage.current;
    const element = scene.current;
    if (!image || !element) return;
    const reveal = () => { if (image.naturalWidth > 0) element.dataset.screenReady = "true"; };
    image.addEventListener("load", reveal);
    if (image.complete) reveal();
    return () => image.removeEventListener("load", reveal);
  }, []);
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const update = (width: number) => element.style.setProperty("--hero-screen-scale", String(width / 1260));
    update(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const decorImage = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = decorImage.current;
    if (!image) return;
    const reveal = () => {
      if (image.naturalWidth > 0 && image.parentElement) {
        image.parentElement.dataset.loaded = "true";
      }
    };
    image.addEventListener("load", reveal);
    // Cached images may finish loading before React attaches event handlers.
    if (image.complete) reveal();
    return () => image.removeEventListener("load", reveal);
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      element.dataset.moving = String(visible && !document.hidden && !preference.matches);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
    };
  }, []);

  return <section ref={root} className={styles.hero} data-locale={locale}>
    <div className={styles.sky} aria-hidden="true">
      <div className={styles.clouds}>{["xl", "l", "m", "s", "xs"].map((size, i) =>
        <img key={size} src={siteUrl(`/assets/hero/cloud-${size}.png`)} width="427" height="170" alt="" style={{ animationDelay: `${-i * 5}s` }} />
      )}</div>
    </div>
    <div className={styles.middle} aria-hidden="true">
      <i className={styles.blueShape} /><i className={styles.lilacShape} />
      <div className={styles.plant}><i /><i /><i /><span /></div>
      <div className={styles.books}><i /><i /><i /></div>
    </div>
    <div className={styles.lighting} aria-hidden="true">
      <i className={styles.textLight} /><i className={styles.floorLight} />
    </div>
    <div className={`container ${styles.layout}`}>
      <div className={styles.copy}>{children}</div>
      <div className={styles.sceneViewport}>
      <div ref={scene} className={styles.scene}>
        <div className={styles.decor} aria-hidden="true" style={{ "--decor-image": `url("${siteUrl("/assets/hero/hero-image-2.png")}")` } as CSSProperties}>
          <div className={styles.decorFloat}>
            <div className={styles.decorReveal}>
              <img ref={decorImage} src={siteUrl("/assets/hero/hero-image-2.png")} width="1260" height="1200" alt="" />
              <div className={styles.decorSheen} />
            </div>
          </div>
        </div>
        <picture className={styles.foreground}>
          <img ref={foregroundImage} src={siteUrl("/assets/hero/hero-image.png")} width="1260" height="1200" alt="Персонажи BukaGo рядом с экраном приложения родительского контроля" fetchPriority="high" />
        </picture>
        <div className={styles.screenSlot}>
          <div className={styles.screenScale}><HeroAppScreen locale={locale} animate /></div>
        </div>
      </div>
      </div>
      <HeroFeatureTicker locale={locale} />
    </div>
  </section>;
}
