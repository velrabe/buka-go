"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Locale, Messages } from "@/lib/content";
import { smoothMotion } from "@/lib/demo-motion";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/task-demos.module.scss";

function Coin({ large = false }: { large?: boolean }) {
  const coin = <img className={large ? styles.largeCoin : styles.coin} src={siteUrl("/assets/hero-screen/coin.png")} width={large ? 56 : 20} height={large ? 56 : 20} alt="" />;
  return large ? <span className={styles.coinFace}>{coin}</span> : coin;
}

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

function FamilyBoard({ members }: { members: Messages["loved"]["cards"][4]["members"] }) {
  const ref = useRef<HTMLUListElement>(null);
  const playing = useDemoPlayback(ref);
  const elapsed = useRef(0);
  const [frame, setFrame] = useState({ score: 95, leading: false });
  useEffect(() => {
    if (!playing) return;
    let previous: number | undefined;
    let request: number;
    const tick = (now: number) => {
      if (previous !== undefined) elapsed.current += now - previous;
      previous = now;
      const time = (elapsed.current / 1000) % 8.2;
      // Hold, earn 50 points, take first place, hold, then return smoothly.
      const earned = time < 3
        ? smoothMotion((time - 1) / 2)
        : 1 - smoothMotion((time - 5.6) / 2);
      const score = 95 + Math.round(50 * earned);
      const leading = time >= 3 && time < 7.6;
      setFrame((current) => current.score === score && current.leading === leading
        ? current : { score, leading });
      request = window.requestAnimationFrame(tick);
    };
    request = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(request);
  }, [playing]);
  const names = Object.values(members);
  const order = frame.leading ? [1, 0, 2] : [0, 1, 2];
  return <ul ref={ref} className={styles.family}>
    {order.map((index, row) => <li key={index} style={{
      transform: `translateY(calc(${row * 100}% + ${row * 8}px))`,
      zIndex: index === 1 ? 2 : 1,
    }}>
      <img src={siteUrl(`/assets/site/images/landing/family/${["masha", "ivan", "dad"][index]}.png`)} width="24" height="24" alt="" />
      <span>{names[index]}</span>
      <strong>{index === 1 ? frame.score : [120, 95, 80][index]}<span aria-hidden="true">★</span></strong>
    </li>)}
  </ul>;
}

function Hourglass() {
  return <svg className={styles.hourglass} width="36" height="48" viewBox="0 0 36 48" fill="none" aria-hidden="true">
    <path d="M7 5h22v8c0 5-6 9-11 11 5 2 11 6 11 11v8H7v-8c0-5 6-9 11-11C13 22 7 18 7 13V5Z" fill="#f3eeff" stroke="#9279e8" strokeWidth="2.5"/>
    <path d="m10 13 8 8 8-8H10Zm8 15-9 12h18L18 28Z" fill="#ffbe32"/>
    <path d="M5 4h26M5 44h26" stroke="#9279e8" strokeWidth="4" strokeLinecap="round"/>
  </svg>;
}

const feedback: Record<
  Locale,
  { correct: string; retry: string; start: string; done: string }
> = {
  ru: {
    correct: "Верно! +25",
    retry: "Попробуйте ещё раз",
    start: "Начать",
    done: "Готово",
  },
  en: {
    correct: "Correct! +25",
    retry: "Try again",
    start: "Start",
    done: "Done",
  },
  kk: {
    correct: "Дұрыс! +25",
    retry: "Қайта көріңіз",
    start: "Бастау",
    done: "Дайын",
  },
  uz: {
    correct: "Toʻgʻri! +25",
    retry: "Qayta urinib koʻring",
    start: "Boshlash",
    done: "Tayyor",
  },
  az: {
    correct: "Düzdür! +25",
    retry: "Yenidən sınayın",
    start: "Başla",
    done: "Hazır",
  },
};

export function TaskDemos({
  content,
  locale,
}: {
  content: Messages["loved"];
  locale: Locale;
}) {
  const cards = Object.values(content.cards);
  const [answer, setAnswer] = useState<number | null>(null);
  const [result, setResult] = useState("");
  const [seconds, setSeconds] = useState(8);
  const [running, setRunning] = useState(false);
  const [choice, setChoice] = useState<"break" | "task" | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const playing = useDemoPlayback(ref);
  const text = feedback[locale];
  useEffect(() => {
    if (!running || seconds === 0) return;
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [running, seconds]);
  return (
    <div ref={ref} className={styles.grid} data-playing={playing}>
      {cards.map((card, i) => (
        <article className={styles.card} key={card.subtitle}>
          <div className={styles.preview}>
            {i === 0 && (
              <>
                <p className={`${styles.previewTitle} ${styles.titleRow}`}>
                  {content.cards[0].title}<span>{content.cards[0].progress}</span>
                </p>
                <div className={styles.previewBody}>
                  <p className={styles.question}>{content.cards[0].question}</p>
                  <div className={styles.answers}>
                    {[4, 5, 6, 7].map((value) => (
                      <button
                        key={value}
                        aria-pressed={answer === value}
                        onClick={() => {
                          setAnswer(value);
                          setResult("");
                        }}
                        aria-label={content.cards[0].answerAriaLabel.replace(
                          "{value}",
                          String(value),
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className={`${styles.button} ${styles.answerButton}`}
                  disabled={answer === null}
                  onClick={() =>
                    setResult(answer === 5 ? text.correct : text.retry)
                  }
                >
                  <span>{content.cards[0].answerButton}</span><span className={styles.rewardBadge}><Coin />+25</span>
                </button>
                <p role="status" className={styles.result}>
                  {result}
                </p>
              </>
            )}
            {i === 1 && (
              <>
                <p className={styles.previewTitle}>
                  {content.cards[1].title}
                  <br />
                  {content.cards[1].titleLine2}
                </p>
                <div className={styles.previewBody}>
                  <div className={styles.parentReward}><Coin large /><strong>{content.cards[1].reward}</strong></div>
                  <p className={styles.report}>✓ {content.cards[1].photoReport}</p>
                </div>
                <span className={styles.received}>
                  {content.cards[1].rewardReceived}
                </span>
              </>
            )}
            {i === 2 && (
              <>
                <p className={styles.previewTitle}>{content.cards[2].title}</p>
                <div className={styles.previewBody}>
                  <p className={styles.timer}>
                    00:{String(seconds).padStart(2, "0")}
                  </p>
                  <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={8} aria-valuenow={8 - seconds} aria-label={content.cards[2].title}><span style={{ width: `${Math.max(20, (8 - seconds) / 8 * 100)}%` }} /></div>
                  <p className={styles.exercise}>{content.cards[2].exerciseDescription}</p>
                </div>
                <button
                  className={`${styles.button} ${styles.pauseButton}`}
                  onClick={() => {
                    if (seconds === 0) setSeconds(8);
                    setRunning(!running || seconds === 0);
                  }}
                >
                  {seconds === 0 ? <>{text.done}<span aria-hidden="true">✓</span></> : running ? <>{content.cards[2].pause}<span aria-hidden="true">Ⅱ</span></> : <>{text.start}<span aria-hidden="true">▷</span></>}
                </button>
              </>
            )}
            {i === 3 && (
              <>
                <p className={styles.previewTitle}>{content.cards[3].title}</p>
                <div className={styles.previewBody}><div className={styles.breakPrompt}><Hourglass /><h4>{content.cards[3].breakSoon}</h4><p>{content.cards[3].breakOrTask}</p></div></div>
                <div className={styles.choices}>
                  <button
                    className={styles.button}
                    aria-pressed={choice === "break"}
                    onClick={() => setChoice("break")}
                  >
                    {content.cards[3].break}
                  </button>
                  <button
                    className={`${styles.button} ${styles.taskButton}`}
                    aria-pressed={choice === "task"}
                    onClick={() => setChoice("task")}
                  >
                    <span>{content.cards[3].task}</span><span className={styles.rewardBadge}><Coin />+25</span>
                  </button>
                </div>
                <p role="status" className={styles.result}>
                  {choice ? `${content.cards[3][choice]} ✓` : ""}
                </p>
              </>
            )}
            {i === 4 && (
              <>
                <p className={styles.previewTitle}>{content.cards[4].title}</p>
                <div className={styles.previewBody}><FamilyBoard members={content.cards[4].members} /></div>
                <a className={styles.button} href={siteUrl("#download")}>
                  {content.cards[4].addTask}
                </a>
              </>
            )}
          </div>
          <h3>{card.subtitle}</h3>
          <p>{card.text}</p>
        </article>
      ))}
    </div>
  );
}
