"use client";

import { useEffect, useState } from "react";
import type { Locale, Messages } from "@/lib/content";

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
  const text = feedback[locale];
  useEffect(() => {
    if (!running || seconds === 0) return;
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [running, seconds]);
  return (
    <div className="demo-grid">
      {cards.map((card, i) => (
        <article className="demo-card" key={card.subtitle}>
          <div className="demo-preview">
            {i === 0 && (
              <>
                <p className="meta">
                  {content.cards[0].title} {content.cards[0].progress}
                </p>
                <p className="question">{content.cards[0].question}</p>
                <div className="answer-options">
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
                <button
                  className="button button-small"
                  disabled={answer === null}
                  onClick={() =>
                    setResult(answer === 5 ? text.correct : text.retry)
                  }
                >
                  {content.cards[0].answerButton} · +25
                </button>
                <p role="status" className="demo-result">
                  {result}
                </p>
              </>
            )}
            {i === 1 && (
              <>
                <p>
                  {content.cards[1].title}
                  {content.cards[1].titleLine2}
                </p>
                <strong className="question">{content.cards[1].reward}</strong>
                <p className="meta">✓ {content.cards[1].photoReport}</p>
                <span className="status-label">
                  {content.cards[1].rewardReceived}
                </span>
              </>
            )}
            {i === 2 && (
              <>
                <p className="meta">{content.cards[2].title}</p>
                <p className="question">
                  00:{String(seconds).padStart(2, "0")}
                </p>
                <p>{content.cards[2].exerciseDescription}</p>
                <button
                  className="button button-small"
                  onClick={() => {
                    if (seconds === 0) setSeconds(8);
                    setRunning(!running || seconds === 0);
                  }}
                >
                  {running && seconds > 0 ? content.cards[2].pause : text.start}
                </button>
                {seconds === 0 && <p role="status">{text.done} ✓</p>}
              </>
            )}
            {i === 3 && (
              <>
                <p className="meta">{content.cards[3].title}</p>
                <h4>{content.cards[3].breakSoon}</h4>
                <p>{content.cards[3].breakOrTask}</p>
                <div className="answer-options">
                  <button
                    aria-pressed={choice === "break"}
                    onClick={() => setChoice("break")}
                  >
                    {content.cards[3].break}
                  </button>
                  <button
                    aria-pressed={choice === "task"}
                    onClick={() => setChoice("task")}
                  >
                    {content.cards[3].task} +25
                  </button>
                </div>
                <p role="status" className="demo-result">
                  {choice ? `${content.cards[3][choice]} ✓` : ""}
                </p>
              </>
            )}
            {i === 4 && (
              <>
                <p className="meta">{content.cards[4].title}</p>
                <ul className="family-board">
                  {Object.values(content.cards[4].members).map(
                    (member, index) => (
                      <li key={member}>
                        <span>{member}</span>
                        <strong>{[120, 95, 80][index]} ★</strong>
                      </li>
                    ),
                  )}
                </ul>
                <a className="text-link" href="#download">
                  {content.cards[4].addTask} →
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
