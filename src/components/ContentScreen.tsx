import { translateScreen } from "@/lib/screen-translations";

import { siteUrl } from "@/lib/site-url";
import { DemoSkeleton } from "./DemoSkeleton";
import { DemoValue, DemoActiveMode, DemoSummaryBar, DemoModeButton } from "./ContentDemoState";
import type { CSSProperties } from "react";
import screen from "@/content/app-content-screen.json";
import { ScreenTimeSummary } from "./ScreenTimeSummary";
import { ScrollingPhone } from "./ScrollingPhone";
import styles from "@/styles/content-screen.module.scss";

type ScreenNode = {
  id: string;
  style: Record<string, string | number | undefined>;
  text?: string;
  children?: ScreenNode[];
  asset?: { src: string; width: number; height: number; left: number; top: number };
};

const demoTargets: Record<string, string> = {
  "3736:57391": "add",
  "2829:83615": "quick",
  "2829:71940": "minecraft",
};

const demoFields: Record<string, string> = {
  "I2799:62446;81:1242;839:7108": "clock",
  "I2799:63572;1:636;1:632": "total",
  "I2799:63573;1:636;1:632": "limit",
  "I2799:63585;1:636;1:632": "study",
  "I2799:63597;1:636;1:632": "games",
  "I2829:71950;1:636;1:632": "minecraft",
  "I2829:83605;1:636;1:632": "modeStart",
  "I2829:83608;1:636;1:632": "modeEnd",
};

const visibleLabels = new Set([
  "Экранное время", "Умные режимы", "Приложения", "Добавить время", "Настройки",
  "Сегодня", "Активный режим:", "–", "Учеба", "Уроки", "Игры", "Образование", "Все приложения (49)", "Minecraft", "Roblox", "Duolingo", "Калькулятор", "Мой Дневник", "PRO",
  "Задания", "На карте", "Контент", "Профиль",
]);
const modeButtons = new Set(["2829:83615", "2829:83619", "2829:83623", "2829:83628", "2829:83632", "2829:83636"]);
// Text-only chains exported from Figma are hug-content, rather than fixed
// boxes sized for the Russian label. Keep icon and device geometry fixed.
function isTextChain(node: ScreenNode): boolean {
  if (node.asset) return false;
  if (node.text !== undefined) return true;
  return node.children?.length === 1 && isTextChain(node.children[0]) || false;
}
const categoryCards = new Set(["2799:63580", "2799:63586", "2799:63592"]);
function Layer({ node, control = false, wrapped = false, staticView = false, locale = "ru" }: { locale?: string; node: ScreenNode; control?: boolean; wrapped?: boolean; staticView?: boolean }) {
  if (!staticView && !wrapped && modeButtons.has(node.id)) return <DemoModeButton mode={node.id === "2829:83615" ? "Игры" : node.id === "2829:83619" ? "Учеба" : ""}><Layer node={node} control wrapped locale={locale} /></DemoModeButton>;
  const isControl = control || modeButtons.has(node.id);
  // Figma can trim text bounds below the font size. Keep the layout slot,
  // but center a full line box instead of clipping the glyphs to those bounds.
  const trimmedText = node.text !== undefined &&
    parseFloat(String(node.style.fontSize)) > Number(node.style.height);
  const style: CSSProperties = {
    ...node.style as CSSProperties,
    ...(isTextChain(node) && node.style.position !== "absolute" ? {
      width: "auto", maxWidth: "100%", minWidth: 0, flex: "0 1 auto",
      ...(node.text !== undefined && !/[\n\u2028]/.test(node.text) && Number(node.style.height) <= parseFloat(String(node.style.fontSize)) * 1.5 ? { whiteSpace: "nowrap" } : {}),
    } as CSSProperties : {}),
    ...(categoryCards.has(node.id) ? { width: "auto", maxWidth: "100%", minWidth: 0, flex: "0 1 auto" } : {}),
    ...(node.id === "3511:79340" ? { width: "100%", minWidth: 0 } : {}),
    ...(trimmedText ? {
      display: "flex", alignItems: "center",
      justifyContent: node.style.textAlign === "center" ? "center" : "flex-start",
      overflow: "visible", whiteSpace: "pre", lineHeight: 1.2,
    } as CSSProperties : {}),
  };
  if (!staticView && node.id === "2829:83603") return <div style={style}><DemoActiveMode /></div>;
  if (!staticView && node.id === "2799:63574") return <DemoSummaryBar />;
  if (!staticView && node.text !== undefined && !isControl && !visibleLabels.has(node.text) && !["clock", "total", "limit"].includes(demoFields[node.id])) {
    return <div className={styles.layer} style={{ ...style, display: "flex", alignItems: "center", overflow: "visible" }} data-figma-node={node.id}>
      <DemoSkeleton width={node.text.toLowerCase().includes("активный режим") ? 110 : Math.max(12, Number(node.style.width) * .86)}
        height={Math.min(12, Math.max(6, Number(node.style.height) * .5))} lines={Number(node.style.height) > 28 ? 2 : 1} />
    </div>;
  }
  return (
    <div className={styles.layer} style={style} data-figma-node={node.id} data-demo-target={demoTargets[node.id]} data-demo-button={demoTargets[node.id] || modeButtons.has(node.id) || ["3736:57367", "2829:71997", "2799:63568", "2829:83598"].includes(node.id) ? "true" : undefined}>
      {node.asset ? (
        <img
          className={styles.asset}
          data-inactive-nav={node.asset.src.includes("/nav-") && node.asset.src.endsWith("-off.png") ? "true" : undefined}
          src={siteUrl(node.asset.src)}
          width={node.asset.width}
          height={node.asset.height}
          style={{ left: node.asset.left, top: node.asset.top, width: node.asset.width, height: node.asset.height }}
          alt=""
          loading="lazy"
          draggable={false}
        />
      ) : node.text !== undefined ? (!staticView && demoFields[node.id] ? <DemoValue field={demoFields[node.id]} /> : translateScreen(node.text, locale)) : node.children?.map((child) => <Layer key={child.id} node={child} control={isControl} staticView={staticView} locale={locale} />)}
    </div>
  );
}

export function ContentScreen({ locale, extended = false }: { locale: string; extended?: boolean }) {
  return (
    <ScrollingPhone
      locale={locale}
      extended={extended}
      deviceHeader={extended ? <Layer node={screen.status} locale={locale} /> : undefined}
      deviceFooter={extended ? <><Layer node={screen.tabs} locale={locale} /><Layer node={screen.indicator} locale={locale} /></> : undefined}
    >
      <ScreenTimeSummary extended={extended} />
    </ScrollingPhone>
  );
}

export function StaticContentScreen() {
  return <div className={styles.phone} style={{ height: "auto" }}>
    <div className={styles.status}><Layer node={screen.status} /></div>
    <Layer node={screen.body} />
    <div className={styles.navigation}><Layer node={screen.tabs} /><Layer node={screen.indicator} /></div>
  </div>;
}

export function StaticContentBody({ locale = "ru" }: { locale?: string }) {
  const body = {
    ...screen.body,
    style: { ...screen.body.style, height: 1187 },
    children: screen.body.children.map(section => ({
      ...section,
      style: { ...section.style, paddingTop: 24, height: Number(section.style.height) + 8 },
    })),
  };
  return <div className={styles.bodyCanvas}><Layer node={body} staticView locale={locale} /></div>;
}
