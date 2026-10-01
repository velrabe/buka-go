import styles from "@/styles/demo-skeleton.module.scss";

export function DemoSkeleton({ width = "100%", height = 9, lines = 1 }: {
  width?: number | string; height?: number; lines?: number;
}) {
  return <span className={styles.group} aria-hidden="true" style={{ width, height: lines > 1 ? lines * 19 : undefined }}>
    {Array.from({ length: lines }, (_, i) => <span key={i} className={styles.line}
      style={{ height, width: i === lines - 1 && lines > 1 ? "76%" : "100%" }} />)}
  </span>;
}
