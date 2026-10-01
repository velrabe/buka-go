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

function Layer({ node }: { node: ScreenNode }) {
  return (
    <div className={styles.layer} style={node.style as CSSProperties} data-figma-node={node.id}>
      {node.asset ? (
        <img
          className={styles.asset}
          src={node.asset.src}
          width={node.asset.width}
          height={node.asset.height}
          style={{ left: node.asset.left, top: node.asset.top }}
          alt=""
          loading="lazy"
          draggable={false}
        />
      ) : node.text !== undefined ? node.text : node.children?.map((child) => <Layer key={child.id} node={child} />)}
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
