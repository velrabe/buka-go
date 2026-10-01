"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/font-preview.module.scss";

export function FontPreview() {
  const [visible, setVisible] = useState(false);

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
        <select defaultValue="rubik">
          <option value="rubik">Rubik · тестовый</option>
        </select>
      </label>
    </aside>
  );
}
