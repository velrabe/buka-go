import { DemoSkeleton } from "./DemoSkeleton";
import { DemoValue, DemoSummaryBar } from "./ContentDemoState";
import type { CSSProperties } from "react";
import screen from "@/content/app-content-screen.json";
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
  "Аналитика", "Расписание", "Все приложения (49)", "Roblox", "Minecraft", "Duolingo",
  "Калькулятор", "Мой Дневник", "Задания", "На карте", "Контент", "Профиль",
]);
const modeButtons = new Set(["2829:83615", "2829:83619", "2829:83623", "2829:83628", "2829:83632", "2829:83636"]);
function Layer({ node, control = false }: { node: ScreenNode; control?: boolean }) {
  const isControl = control || modeButtons.has(node.id);
  // Figma can trim text bounds below the font size. Keep the layout slot,
  // but center a full line box instead of clipping the glyphs to those bounds.
  const trimmedText = node.text !== undefined &&
    parseFloat(String(node.style.fontSize)) > Number(node.style.height);
  const style: CSSProperties = {
    ...node.style as CSSProperties,
    ...(trimmedText ? {
      display: "flex", alignItems: "center",
      justifyContent: node.style.textAlign === "center" ? "center" : "flex-start",
      overflow: "visible", whiteSpace: "pre", lineHeight: 1.2,
    } as CSSProperties : {}),
  };
  if (node.id === "2829:83603") return <div style={style}><DemoSkeleton width={88} height={12} /></div>;
  if (node.id === "2799:63574") return <DemoSummaryBar />;
  if (node.text !== undefined && !isControl && !visibleLabels.has(node.text) && demoFields[node.id] !== "clock") {
    return <div className={styles.layer} style={{ ...style, display: "flex", alignItems: "center", overflow: "visible" }} data-figma-node={node.id}>
      <DemoSkeleton width={Math.max(12, Number(node.style.width) * .86)}
        height={Math.min(12, Math.max(6, Number(node.style.height) * .5))} lines={Number(node.style.height) > 28 ? 2 : 1} />
    </div>;
  }
  return (
    <div className={styles.layer} style={style} data-figma-node={node.id} data-demo-target={demoTargets[node.id]}>
      {node.asset ? (
        <img
          className={styles.asset}
          src={node.asset.src}
          width={node.asset.width}
          height={node.asset.height}
          style={{ left: node.asset.left, top: node.asset.top, width: node.asset.width, height: node.asset.height }}
          alt=""
          loading="lazy"
          draggable={false}
        />
      ) : node.text !== undefined ? (demoFields[node.id] ? <DemoValue field={demoFields[node.id]} /> : node.text) : node.children?.map((child) => <Layer key={child.id} node={child} control={isControl} />)}
    </div>
  );
}

export function ContentScreen({ locale }: { locale: string }) {
  return (
    <ScrollingPhone
      locale={locale}
      status={<Layer node={screen.status} />}
      navigation={<><Layer node={screen.tabs} /><Layer node={screen.indicator} /></>}
    >
      <Layer node={screen.body} />
    </ScrollingPhone>
  );
}
