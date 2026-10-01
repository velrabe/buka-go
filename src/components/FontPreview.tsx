"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/font-preview.module.scss";

const storageKey = "bukago.preview.font";
const fontOptions = ["nunito", "rubik", "mplus-rounded"];

export function FontPreview() {
  const [visible, setVisible] = useState(false);
  const [font, setFont] = useState("nunito");

  useEffect(() => {
    if (!["localhost", "127.0.0.1", "[::1]", "::1"].includes(window.location.hostname)) return;
    let selected = "nunito";
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && fontOptions.includes(saved)) selected = saved;
    } catch { /* Use Nunito when browser storage is unavailable. */ }
    setFont(selected);
    document.documentElement.dataset.fontPreview = selected;
    setVisible(true);
    return () => { delete document.documentElement.dataset.fontPreview; };
  }, []);

  if (!visible) return null;

  return (
    <aside className={styles.toolbar} aria-label="Шрифт предпросмотра">
      <label>
        Шрифт
        <select value={font} onChange={(event) => {
          setFont(event.target.value);
          document.documentElement.dataset.fontPreview = event.target.value;
          try {
            localStorage.setItem(storageKey, event.target.value);
          } catch { /* Font switching still works for the current page. */ }
        }}>
          <option value="nunito">Nunito</option>
          <option value="rubik">Rubik · тестовый</option>
          <option value="mplus-rounded">M PLUS Rounded 1c</option>
        </select>
      </label>
    </aside>
  );
}
