"use client";

import { useState } from "react";
import { TaskMiniScreen } from "./TaskMiniScreen";
import type { Locale } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import task from "@/content/picture-task-preview.json";
import styles from "@/styles/picture-task-preview.module.scss";

const copy: Record<Locale, { instruction: string; check: string; cat: string; picture: string; correct: string; retry: string }> = {
  ru: { instruction: task.instruction, check: task.checkLabel, cat: "Кот", picture: "Картинка", correct: "Верно!", retry: "Попробуй ещё раз" },
  en: { instruction: "Choose the odd picture out", check: "Check", cat: "Cat", picture: "Picture", correct: "Correct!", retry: "Try again" },
  kk: { instruction: "Артық суретті таңда", check: "Тексеру", cat: "Мысық", picture: "Сурет", correct: "Дұрыс!", retry: "Қайта көр" },
  uz: { instruction: "Ortiqcha rasmni tanla", check: "Tekshirish", cat: "Mushuk", picture: "Rasm", correct: "Toʻgʻri!", retry: "Yana urinib koʻr" },
  az: { instruction: "Fərqli şəkli seç", check: "Yoxla", cat: "Pişik", picture: "Şəkil", correct: "Düzdür!", retry: "Yenidən sına" },
};

const oddAnswer = task.answers.findIndex(answer => answer.id === task.correctAnswerId);

export function PictureTaskPreview({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const t = copy[locale];
  const instruction = t.instruction;
  const backgroundAsset = task.background.asset as string | null;
  const ready = task.answers.every(answer => answer.asset !== null);
  const result = checked ? selected === oddAnswer ? `${t.correct} +${task.reward}` : t.retry : "";

  return <TaskMiniScreen current={task.progress.current} reward={task.reward} instruction={instruction}
    sourceId={task.source.rootId} characterId={task.character.id} backgroundAsset={backgroundAsset} result={result}
    action={<button type="button" className={styles.check} disabled={selected === null || !ready}
      onClick={() => setChecked(true)}>{result || t.check}</button>}>
    <div className={styles.answers} role="group" aria-label={t.instruction}>
      {task.answers.map((answer, index) => {
        const asset = answer.asset as string | null;
        return <button type="button" key={answer.id} data-figma-node={answer.id} data-asset-pending={!asset || undefined}
          aria-label={`${t.picture} ${index + 1}`} aria-pressed={selected === index}
          className={styles.option} data-result={checked && selected === index ? selected === oddAnswer ? "correct" : "retry" : undefined}
          onClick={() => { setSelected(index); setChecked(false); }}>
          {asset ? <img src={siteUrl(asset)} alt="" width="128" height="128" /> : <span className={styles.missing}>{t.picture}<b>{index + 1}</b></span>}
        </button>;
      })}
    </div>
  </TaskMiniScreen>;
}
