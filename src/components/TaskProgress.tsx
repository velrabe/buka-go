import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/picture-task-preview.module.scss";

export function TaskProgress({ current, total, label, reward, diamond = false }: { current: number; total: number; label: string; reward: number; diamond?: boolean }) {
  return <div className={styles.topbar}>
    <div className={styles.progress}>
      <span className={styles.counter}>{current} / {total}</span>
      <span className={styles.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={current}>
        <span style={{ width: `${current / total * 100}%` }} />
      </span>
    </div>
    <span className={`${styles.reward} ${diamond ? styles.diamondReward : ""}`}>
      <img src={siteUrl(`/assets/hero-screen/${diamond ? "diamond" : "coin"}.png`)} width="16" height="16" alt="" />+{reward}
    </span>
  </div>;
}
