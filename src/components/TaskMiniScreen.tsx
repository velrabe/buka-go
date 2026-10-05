import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site-url";
import { TaskCharacterVideo } from "./TaskCharacterVideo";
import { TaskProgress } from "./TaskProgress";
import styles from "@/styles/picture-task-preview.module.scss";

export function TaskMiniScreen({
  current, reward, diamond = false, instruction, children, action, result,
  idleOnly = false, sourceId, characterId, backgroundAsset, sheetClassName = "", characterAsset, header, className = "", showObserver = true,
}: {
  current?: number;
  reward: number;
  diamond?: boolean;
  instruction: string;
  children: ReactNode;
  action: ReactNode;
  result?: string;
  idleOnly?: boolean;
  sourceId?: string;
  characterId?: string;
  backgroundAsset?: string | null;
  sheetClassName?: string;
  characterAsset?: string;
  header?: ReactNode;
  className?: string;
  showObserver?: boolean;
}) {
  return <div className={`${styles.task} ${className}`} data-mini-screen={current} data-figma-node={sourceId}
    style={backgroundAsset ? { backgroundImage: `url(${siteUrl(backgroundAsset)})` } : undefined}>
    {header ?? <TaskProgress current={current ?? 1} total={3} label={instruction} reward={reward} diamond={diamond} />}
    {showObserver && <div className={styles.observer}>
      <div className={styles.character} data-figma-node={characterId}>
        {characterAsset ? <img src={siteUrl(characterAsset)} width="128" height="128" alt="" /> : <TaskCharacterVideo idleOnly={idleOnly} />}
      </div>
      <p className={styles.bubble}><span>{instruction}</span></p>
    </div>}
    <div className={`${styles.sheet} ${sheetClassName}`}>
      <div className={styles.taskContent}>{children}</div>
      <div className={styles.cta}>{action}</div>
      <p role="status" aria-live="polite" className={styles.result} hidden={!result}>{result}</p>
    </div>
  </div>;
}
