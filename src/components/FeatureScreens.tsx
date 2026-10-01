"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import screens from "@/content/feature-screens.json";
import programsScreen from "@/content/programs-screen.json";
import successScreen from "@/content/success-screen.json";
import healthyScreen from "@/content/healthy-screen.json";
import mapScreen from "@/content/map-screen.json";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/feature-screens.module.scss";

import { useScreenTranslation } from "./ScreenLocale";

type Node = { id: string; name: string; style: Record<string, string | number | undefined>; text?: string; asset?: string; assetFit?: "cover"; ring?: boolean; symbol?: string; missingAsset?: boolean; children: Node[] };
function Layer({ node }: { node: Node }) {
  const t = useScreenTranslation();
  const translated = node.text === undefined ? undefined : t(node.text);
  return <div style={node.style as CSSProperties} data-figma-node={node.id} data-asset-pending={node.missingAsset || undefined}>
    {node.ring ? <><svg width="247" height="247" viewBox="0 0 247 247" aria-hidden="true">
      <circle cx="123.5" cy="123.5" r="112.5" fill="none" stroke="#9279e8" strokeOpacity=".1" strokeWidth="22" />
      <circle cx="123.5" cy="123.5" r="112.5" fill="none" stroke="#9279e8" strokeWidth="22" pathLength="100" strokeDasharray="40 60" transform="rotate(-90 123.5 123.5)" />
    </svg>{node.children.map(child => <Layer key={child.id} node={child} />)}</> : node.asset ? <img className={styles.asset} style={node.assetFit ? { objectFit: node.assetFit } : undefined} src={siteUrl(node.asset)} alt="" draggable={false} />
      : node.symbol ? <span className={styles.symbol} aria-hidden="true">{node.symbol}</span>
      : translated ?? node.children.map(child => <Layer key={child.id} node={child} />)}
  </div>;
}

export function StaticProgramsScreen() {
  return <div className={styles.staticScreen}><Layer node={programsScreen as Node} /></div>;
}

export function StaticSuccessScreen() {
  return <div className={styles.staticScreen} style={{ height: 844 }}><Layer node={successScreen as Node} /></div>;
}

export function StaticHealthyScreen() {
  return <div className={styles.staticScreen} style={{ height: 844 }}><Layer node={healthyScreen as Node} /></div>;
}

export function StaticMapScreen() {
  return <div className={styles.staticScreen} style={{ height: 812 }}><Layer node={mapScreen as Node} /></div>;
}

export function FeatureScreens({ kind }: { kind: "programs" | "task" }) {
  const t = useScreenTranslation();
  const root = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 450));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={styles.scene} aria-label={kind === "programs" ? t("Программы развития") : t("Формирование привычки")}>
    <div className={styles.canvas} style={{ zoom: scale }}>
      {kind === "programs" ? <>
        <div className={styles.programs}><Layer node={screens.programs as Node} /></div>
        <div className={styles.program} tabIndex={0} role="region" aria-label={t("Программа")}><Layer node={screens.program as Node} /></div>
      </> : <div className={styles.task} tabIndex={0} role="region" aria-label={t("Выполни задание")}><Layer node={screens.task as Node} /></div>}
    </div>
  </div>;
}
