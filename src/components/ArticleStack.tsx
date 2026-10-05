"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import carouselStyles from "@/styles/review-carousel.module.scss";
import styles from "@/styles/landing-article.module.scss";

export function ArticleStack({ children, titles, label, previousLabel, nextLabel, action }: {
  children: ReactNode[];
  titles: string[];
  label: string;
  previousLabel: string;
  nextLabel: string;
  action: ReactNode;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const count = children.length;
  const move = (direction: number) => setActive(current => (current + direction + count) % count);

  useEffect(() => {
    const followAnchor = () => {
      if (window.location.hash === "#why-works") setActive(1);
      else if (window.location.hash === "#smart-pauses") setActive(0);
    };
    followAnchor();
    window.addEventListener("hashchange", followAnchor);
    return () => window.removeEventListener("hashchange", followAnchor);
  }, []);

  if (!count) return null;

  return <div className={`${carouselStyles.carousel} ${styles.carousel}`} role="region" aria-label={label}
    onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
    <div id={id} className={`${carouselStyles.stage} ${styles.stage}`}
      onPointerDown={event => {
        suppressClick.current = false;
        if (event.pointerType !== "mouse") touch.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerCancel={() => { touch.current = null; }}
      onPointerUp={event => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const delta = event.clientX - start.x;
        if (Math.abs(delta) > 48 && Math.abs(delta) > Math.abs(event.clientY - start.y)) {
          event.preventDefault();
          suppressClick.current = true;
          move(delta > 0 ? -1 : 1);
        }
      }}
      onClickCapture={event => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }}>
      {children.map((card, index) => {
        const offset = (index - active + count) % count;
        const position = offset === 0 ? "active" : offset === 1 ? "next" : offset === count - 1 ? "previous" : "hidden";
        return <div key={titles[index]} className={`${carouselStyles.card} ${styles.slide}`} data-position={position}
          role="group" aria-label={titles[index]} aria-hidden={index !== active || undefined} inert={index !== active}>
          {card}
        </div>;
      })}
      <button className={`${carouselStyles.arrow} ${carouselStyles.previous}`} type="button" onClick={() => move(-1)} aria-label={previousLabel} aria-controls={id}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
      </button>
      <button className={`${carouselStyles.arrow} ${carouselStyles.next}`} type="button" onClick={() => move(1)} aria-label={nextLabel} aria-controls={id}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
      </button>
    </div>
    <div className={styles.blogActions}>{action}</div>
    <div className={carouselStyles.controls}>
      <div className={carouselStyles.dots}>
        {titles.map((title, index) => <button key={title} className={carouselStyles.dot} type="button" onClick={() => setActive(index)} aria-label={title} aria-current={index === active ? "true" : undefined} aria-controls={id} />)}
      </div>
      <span className={carouselStyles.srOnly} aria-live="polite" aria-atomic="true">{titles[active]} · {active + 1} / {count}</span>
    </div>
  </div>;
}
