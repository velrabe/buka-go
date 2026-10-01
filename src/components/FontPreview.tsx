"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/font-preview.module.scss";

export function FontPreview() {
  const [visible, setVisible] = useState(false);
  const [font, setFont] = useState("rubik");

  useEffect(() => {
    if (!["localhost", "127.0.0.1", "[::1]", "::1"].includes(window.location.hostname)) return;
    document.documentElement.dataset.fontPreview = "rubik";
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
        }}>
          <option value="rubik">Rubik · тестовый</option>
          <option value="mplus-rounded">M PLUS Rounded 1c</option>
        </select>
      </label>
    </aside>
  );
}
