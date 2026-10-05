"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Locale, Messages } from "@/lib/content";
import { familyBoardFrame } from "@/lib/family-board-motion";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/task-demos.module.scss";
import taskStyles from "@/styles/picture-task-preview.module.scss";
import { PictureTaskPreview } from "./PictureTaskPreview";
import { ParentTaskPreview } from "./ParentTaskPreview";
import { HealthyTaskPreview } from "./HealthyTaskPreview";
import { GentleSwitchPreview } from "./GentleSwitchPreview";
import { TaskMiniScreen } from "./TaskMiniScreen";

function useDemoPlayback(ref: RefObject<HTMLElement | null>) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => setPlaying(visible && !document.hidden && !reducedMotion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [ref]);
  return playing;
}

function FamilyBoard({ members, onLeaderChange }: { members: Messages["loved"]["cards"][4]["members"]; onLeaderChange: (leader: 0 | 1) => void }) {
  const ref = useRef<HTMLUListElement>(null);
  const playing = useDemoPlayback(ref);
  const elapsed = useRef(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const scoreText = useRef<HTMLSpanElement>(null);
  const lastLeader = useRef<0 | 1>(0);
  useEffect(() => {
    if (!playing) return;
    let previous: number | undefined;
    let request: number;
    const lastTransforms = ["", ""];
    const tick = (now: number) => {
      if (previous !== undefined) elapsed.current += now - previous;
      previous = now;
      const { score, swap } = familyBoardFrame(elapsed.current);
      const leader = swap >= .5 ? 1 : 0;
      if (lastLeader.current !== leader) {
        lastLeader.current = leader;
        onLeaderChange(leader);
      }
      [swap, 1 - swap].forEach((position, index) => {
        const row = rows.current[index];
        const transform = `translateY(calc(${(position * 100).toFixed(4)}% + ${(position * 8).toFixed(4)}px))`;
        if (row && lastTransforms[index] !== transform) {
          row.style.transform = transform;
          lastTransforms[index] = transform;
        }
      });
      const scoreNode = scoreText.current;
      if (scoreNode && scoreNode.textContent !== String(score)) scoreNode.textContent = String(score);
      request = window.requestAnimationFrame(tick);
    };
    request = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(request);
  }, [playing, onLeaderChange]);
  const names = Object.values(members);
  return <ul ref={ref} className={styles.family} data-playing={playing}>
    {[0, 1, 2].map(index => <li key={index} ref={element => { rows.current[index] = element; }} style={{
      transform: `translateY(calc(${index * 100}% + ${index * 8}px))`,
      zIndex: index === 1 ? 2 : 1,
    }}>
      <img src={siteUrl(`/assets/site/images/landing/family/${["masha", "ivan", "dad"][index]}.png`)} width="24" height="24" alt="" />
      <span>{names[index]}</span>
      <strong><span className={styles.familyScore} ref={index === 1 ? scoreText : undefined}>{[120, 95, 80][index]}</span><span className={styles.familyStar} aria-hidden="true">★</span></strong>
    </li>)}
  </ul>;
}

function FamilyTaskPreview({ card, locale }: { card: Messages["loved"]["cards"][4]; locale: Locale }) {
  const [leader, setLeader] = useState<0 | 1>(0);
  const name = Object.values(card.members)[leader];
  const announcement: Record<Locale, string> = {
    ru: `${name} выходит вперёд`, en: `${name} takes the lead`, kk: `${name} алға шықты`,
    uz: `${name} oldinga chiqdi`, az: `${name} önə keçir`,
  };
  return <TaskMiniScreen reward={0} instruction={announcement[locale]} characterAsset="/assets/task-preview/character-header-4.png"
    header={<div className={`${taskStyles.topbar} ${styles.familyHeader}`}>{card.title}</div>}
    action={<a className={`${taskStyles.check} ${styles.familyAction}`} href={siteUrl("#download")}>{card.addTask}</a>}>
    <FamilyBoard members={card.members} onLeaderChange={setLeader} />
  </TaskMiniScreen>;
}

export function TaskDemos({
  content,
  locale,
}: {
  content: Messages["loved"];
  locale: Locale;
}) {
  const cards = Object.values(content.cards);
  const ref = useRef<HTMLDivElement>(null);
  const playing = useDemoPlayback(ref);
  return (
    <div ref={ref} className={styles.grid} data-playing={playing}>
      {cards.map((card, i) => (
        <article className={styles.card} key={card.subtitle}>
          <div className={`${styles.preview} ${styles.picturePreview}`}>
            {i === 0 && <PictureTaskPreview locale={locale} />}
            {i === 1 && <ParentTaskPreview locale={locale} />}
            {i === 2 && <HealthyTaskPreview locale={locale} playing={playing} />}
            {i === 3 && <GentleSwitchPreview locale={locale} />}
            {i === 4 && <FamilyTaskPreview card={content.cards[4]} locale={locale} />}
          </div>
          <div className={styles.cardContent}>
            <h3>{card.subtitle}</h3>
            <p>{card.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
