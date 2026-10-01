import type { CSSProperties } from "react";
import { siteUrl } from "@/lib/site-url";
import type { Locale } from "@/lib/content";
import screen from "@/content/hero-screen.json";
import translations from "@/content/hero-screen-translations.json";
import styles from "@/styles/hero-app-screen.module.scss";

type LayerNode = {
  id: string;
  name: string;
  style: Record<string, string | number>;
  text?: string;
  assetHash?: string;
  asset?: { src: string; inactive: boolean };
  missingVector?: boolean;
  children?: LayerNode[];
};

const bodySteps = ["3888:65855", "3888:65857", "3888:65866", "3888:65931", "3888:65937"];

function Layer({ node, locale, animate = false }: { node: LayerNode; locale: Locale; animate?: boolean }) {
  const dictionary = translations[locale] as Record<string, string>;
  // Missing original assets remain empty; do not invent replacements for the export.
  if (node.missingVector) return null;
  const text = node.text === undefined ? undefined : dictionary[node.text] ?? node.text;
  const step = bodySteps.indexOf(node.id);
  const isRoot = node.id === screen.id;
  const style = { ...node.style, ...(animate && node.id === screen.id ? { background: "transparent", boxShadow: "none" } : {}), ...(step >= 0 ? { "--body-delay": `${1320 + step * 75}ms` } : {}) } as CSSProperties;
  return <div className={animate ? (step >= 0 ? styles.bodyEntrance : undefined) : undefined} style={style} data-figma-node={node.id} data-asset-pending={node.assetHash}>
    {node.asset ? <img className={styles.asset} src={siteUrl(node.asset.src)} width={Number(node.style.width)} height={Number(node.style.height)} alt="" draggable={false} data-inactive={node.asset.inactive || undefined} /> : text === undefined ? <>{node.children?.filter(child => !isRoot || !["3888:65944", "3888:65945"].includes(child.id)).map(child => <Layer key={child.id} node={child} locale={locale} animate={animate} />)}
        {isRoot && <div className={`${styles.navDock} ${animate ? styles.navEntrance : ""}`}>
          {node.children?.filter(child => ["3888:65944", "3888:65945"].includes(child.id)).map(child => <Layer key={child.id} node={{ ...child, style: { ...child.style, left: 0, top: child.id === "3888:65944" ? 0 : 61, width: 359, height: child.id === "3888:65944" ? 62 : 33, background: "#fff" } }} locale={locale} />)}
        </div>}</> :
      <span className={styles.label} title={text}>{text}</span>}
  </div>;
}

export function HeroAppScreen({ locale, animate = false }: { locale: Locale; animate?: boolean }) {
  return <div className={styles.screen} lang={locale} data-animate={animate || undefined}>
    <Layer node={screen as LayerNode} locale={locale} animate={animate} />

  </div>;
}
