import styles from "@/styles/progress-ring.module.scss";

export function ProgressRing({ progress, strokeWidth = 22, rounded = false }: { progress: number; strokeWidth?: number; rounded?: boolean }) {
  const value = Math.max(0, Math.min(100, progress));
  return <svg className={styles.ring} width="247" height="247" viewBox="0 0 247 247" aria-hidden="true">
    <circle cx="123.5" cy="123.5" r="112.5" fill="none" stroke="#9279e8" strokeOpacity=".1" strokeWidth={strokeWidth} />
    <circle cx="123.5" cy="123.5" r="112.5" fill="none" stroke="#9279e8" strokeWidth={strokeWidth} strokeLinecap={rounded ? "round" : "butt"} pathLength="100" strokeDasharray={`${value} ${100 - value}`} transform="rotate(-90 123.5 123.5)" />
  </svg>;
}
