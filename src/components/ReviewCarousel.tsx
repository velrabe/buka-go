"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/content";
import styles from "@/styles/review-carousel.module.scss";

type Review = { id: string; quote: string; author: string };
const labels: Record<Locale, { previous: string; next: string; carousel: string; slide: string }> = {
  ru: { previous: "Предыдущий отзыв", next: "Следующий отзыв", carousel: "Карусель отзывов", slide: "Отзыв" },
  en: { previous: "Previous review", next: "Next review", carousel: "Review carousel", slide: "Review" },
  kk: { previous: "Алдыңғы пікір", next: "Келесі пікір", carousel: "Пікірлер каруселі", slide: "Пікір" },
  uz: { previous: "Oldingi sharh", next: "Keyingi sharh", carousel: "Sharhlar karuseli", slide: "Sharh" },
  az: { previous: "Əvvəlki rəy", next: "Növbəti rəy", carousel: "Rəylər karuseli", slide: "Rəy" },
};

export function ReviewCarousel({ reviews, locale }: { reviews: Review[]; locale: Locale }) {
  const [active, setActive] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const m = labels[locale];
  const count = reviews.length;
  const move = (direction: number) => setActive(current => (current + direction + count) % count);
  if (!count) return null;

  return <div className={styles.carousel} role="region" aria-roledescription={m.carousel} aria-labelledby="reviews-title"
    onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
    <div className={styles.stage}
      onPointerDown={event => {
        if (event.pointerType !== "mouse") touch.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerCancel={() => { touch.current = null; }}
      onPointerUp={event => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const delta = event.clientX - start.x;
        if (Math.abs(delta) > 48 && Math.abs(delta) > Math.abs(event.clientY - start.y)) move(delta > 0 ? -1 : 1);
      }}>
      {reviews.map((review, index) => {
        const offset = (index - active + count) % count;
        const position = offset === 0 ? "active" : offset === 1 ? "next" : offset === count - 1 ? "previous" : "hidden";
        return <figure key={review.id} className={styles.card} data-position={position} role="group" aria-roledescription={m.slide} aria-label={`${index + 1} / ${count}`} aria-hidden={index !== active || undefined}>
          <span className={styles.quoteMark} aria-hidden="true">“</span>
          <blockquote><p>«{review.quote}»</p></blockquote>
          <figcaption>— {review.author}</figcaption>
        </figure>;
      })}
      <button className={`${styles.arrow} ${styles.previous}`} type="button" onClick={() => move(-1)} aria-label={m.previous}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
      </button>
      <button className={`${styles.arrow} ${styles.next}`} type="button" onClick={() => move(1)} aria-label={m.next}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
      </button>
    </div>
    <div className={styles.controls}>
      <div className={styles.dots}>
        {reviews.map((review, index) => <button key={review.id} className={styles.dot} type="button" onClick={() => setActive(index)} aria-label={`${m.slide} ${index + 1} / ${count}`} aria-current={index === active ? "true" : undefined} />)}
      </div>
      <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{m.slide} {active + 1} / {count}</span>
    </div>
  </div>;
}
