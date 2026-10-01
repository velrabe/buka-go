import { siteUrl } from "@/lib/site-url";
import type { CSSProperties } from "react";
import styles from "@/styles/landing-additions.module.scss";

export function SupportedPlatforms() {
  return <div className={styles.platforms}>
    <span className={styles.platform}>
      <span className={styles.platformIcon}><svg width="20" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.1 12.5c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.8-3.4.8s-1.8-.8-3-.8c-1.5 0-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.2 2.8 2.2 1.1 0 1.5-.7 2.9-.7s1.8.7 3 .7c1.2 0 2-1.1 2.7-2.1.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-.9-2.4-3.5ZM14.9 6c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.9-1 2.9 1 .1 2.1-.5 2.7-1.3Z" /></svg></span>
      <span className={styles.platformName}>iOS</span><span className={styles.platformCheck} aria-hidden="true" style={{ "--platform-check": `url("${siteUrl("/assets/site/images/landing/check.svg")}")` } as CSSProperties} />
    </span>
    <span className={styles.platform}>
      <span className={styles.platformIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m6.5 3 .9-.5L9 5.2a9.3 9.3 0 0 1 6 0l1.6-2.7.9.5L16 5.7A7 7 0 0 1 19 11H5a7 7 0 0 1 3-5.3L6.5 3ZM8 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM5 12h14v7a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-2 0v-2H9v2a1 1 0 0 1-2 0v-2H6a1 1 0 0 1-1-1v-7ZM2 12a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0v-6Zm18 0a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0v-6Z" /></svg></span>
      <span className={styles.platformName}>Android</span><span className={styles.platformCheck} aria-hidden="true" style={{ "--platform-check": `url("${siteUrl("/assets/site/images/landing/check.svg")}")` } as CSSProperties} />
    </span>
  </div>;
}
