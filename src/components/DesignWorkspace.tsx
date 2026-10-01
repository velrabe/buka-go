"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DESIGN_FRAME_NAME, DESIGN_MESSAGE, DESIGN_STORAGE_KEY,
  applyDesignSettings, defaults, densities, fonts, isLocalPreview,
  presets, settingsFromStorage, widths, type DesignSettings,
} from "@/lib/design-settings";
import styles from "@/styles/design-workspace.module.scss";

export function DesignWorkspace({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"page" | "workspace">("page");
  const [settings, setSettings] = useState<DesignSettings>(defaults);
  const [source, setSource] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const panel = useRef<HTMLDetailsElement>(null);
  const readySettings = useRef(settings);
  readySettings.current = settings;

  useEffect(() => {
    if (!isLocalPreview(window.location.hostname)) return;
    if (window.parent !== window && window.name === DESIGN_FRAME_NAME) {
      applyDesignSettings(settingsFromStorage());
      const receive = (event: MessageEvent) => {
        if (event.origin !== window.location.origin || event.source !== window.parent) return;
        if (event.data?.type === DESIGN_MESSAGE) applyDesignSettings(event.data.settings);
      };
      const refresh = (event: StorageEvent) => {
        if (event.key === DESIGN_STORAGE_KEY || event.key === null) {
          applyDesignSettings(settingsFromStorage());
        }
      };
      window.addEventListener("message", receive);
      window.addEventListener("storage", refresh);
      // Request current values after hydration, including when storage is unavailable.
      window.parent.postMessage({ type: `${DESIGN_MESSAGE}:ready` }, window.location.origin);
      return () => {
        window.removeEventListener("message", receive);
        window.removeEventListener("storage", refresh);
      };
    }
    if (window.parent !== window) return;
    setSettings(settingsFromStorage());
    setSource(window.location.pathname + window.location.search + window.location.hash);
    setMode("workspace");
  }, []);

  useEffect(() => {
    if (mode !== "workspace") return;
    try {
      localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(settings));
    } catch { /* Preview still works for this session when storage is unavailable. */ }
    frame.current?.contentWindow?.postMessage(
      { type: DESIGN_MESSAGE, settings }, window.location.origin,
    );
  }, [settings, mode]);

  useEffect(() => {
    if (mode !== "workspace") return;
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === `${DESIGN_MESSAGE}:ready`) {
        frame.current?.contentWindow?.postMessage(
          { type: DESIGN_MESSAGE, settings: readySettings.current }, window.location.origin,
        );
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [mode]);

  if (mode === "page") return children;

  const preset = Object.entries(presets).find(([, item]) =>
    Object.entries(item.settings).every(([key, value]) => settings[key as keyof DesignSettings] === value),
  )?.[0] || "custom";
  const change = <K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  return (
    <div className={styles.workspace}>
      <header className={styles.toolbar} aria-label="Настройки предпросмотра дизайна">
        <details ref={panel} className={styles.panel} onKeyDown={(event) => {
          if (event.key === "Escape" && panel.current?.open) {
            panel.current.open = false;
            panel.current.querySelector("summary")?.focus();
          }
        }}>
          <summary className={styles.summary}>
            <span className={styles.title}>Дизайн</span>
            <span className={styles.current}>{settings.width === "full" ? "Весь экран" : `${settings.width} px`} · {fonts[settings.heading].label}</span>
            <span className={styles.chevron} aria-hidden="true">⌄</span>
          </summary>
          <div className={styles.dropdown}>
            <div className={styles.panelHeading}>
              <strong>Примеряем стиль</strong>
              <span>Сохраняется в этом браузере</span>
            </div>
            <div className={styles.controls}>
              <label>Пресет
                <select value={preset} onChange={(event) => {
                  const selected = presets[event.target.value];
                  if (selected) setSettings((current) => ({ ...current, ...selected.settings }));
                }}>
                  {preset === "custom" && <option value="custom">Свои настройки</option>}
                  {Object.entries(presets).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
                </select>
              </label>
              <label>Ширина экрана
                <select value={settings.width} onChange={(event) => change("width", event.target.value as DesignSettings["width"])}>
                  {widths.map((width) => <option key={width} value={width}>{width === "full" ? "Весь экран" : `${width} px · мобильный`}</option>)}
                </select>
              </label>
              <label>Шрифт заголовков
                <select value={settings.heading} onChange={(event) => change("heading", event.target.value as DesignSettings["heading"])}>
                  {Object.entries(fonts).map(([key, font]) => <option key={key} value={key}>{font.label}</option>)}
                </select>
              </label>
              <label>Шрифт текста
                <select value={settings.body} onChange={(event) => change("body", event.target.value as DesignSettings["body"])}>
                  {Object.entries(fonts).map(([key, font]) => <option key={key} value={key}>{font.label}</option>)}
                </select>
              </label>
              <label>Скругления
                <select value={settings.radius} onChange={(event) => change("radius", event.target.value as DesignSettings["radius"])}>
                  {["8", "16", "24"].map((radius) => <option key={radius} value={radius}>{radius} px</option>)}
                </select>
              </label>
              <label>Отступы между блоками
                <select value={settings.density} onChange={(event) => change("density", event.target.value as DesignSettings["density"])}>
                  {Object.entries(densities).map(([key, density]) => <option key={key} value={key}>{density.label}</option>)}
                </select>
              </label>
            </div>
            <p className={styles.note}>Системный Rounded зависит от устройства. Если он недоступен, используется Nunito.</p>
            <div className={styles.actions}>
              <button type="button" onClick={() => setSettings({ ...defaults })}>Сбросить</button>
              <button type="button" className={styles.done} onClick={() => {
                if (panel.current) {
                  panel.current.open = false;
                  panel.current.querySelector("summary")?.focus();
                }
              }}>Готово</button>
            </div>
          </div>
        </details>
        <span className={styles.local}>Локальный просмотр</span>
      </header>
      <main className={styles.stage} aria-label="Предпросмотр сайта">
        <iframe
          ref={frame}
          name={DESIGN_FRAME_NAME}
          title={`BukaGo — ${settings.width === "full" ? "весь экран" : `${settings.width} px`}`}
          src={source}
          className={styles.canvas}
          style={{ width: settings.width === "full" ? "100%" : `${settings.width}px` }}
        />
      </main>
    </div>
  );
}
