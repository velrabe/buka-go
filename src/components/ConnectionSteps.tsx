import type { Messages } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import { StoreLinks } from "./StoreLinks";
import styles from "@/styles/connection-steps.module.scss";

export function ConnectionSteps({ messages: m }: { messages: Messages }) {
  return (
    <section id="how-to-connect" className={styles.section}>
      <div className={styles.clouds} aria-hidden="true">
        {["xl", "l", "m", "s"].map((size) => (
          <img key={size} src={siteUrl(`/assets/hero/cloud-${size}.png`)} alt="" loading="lazy" />
        ))}
      </div>
      <img className={styles.footer} src={siteUrl("/assets/mobile-features/steps-footer.png")} width="1920" height="531" alt="" loading="lazy" />
      <div className={`container ${styles.inner}`}>
        <header className={styles.heading}>
          <p className={styles.badge}>{m.connect.badge}</p>
          <h2>{m.connect.title}</h2>
          <p className={styles.subtitle}>
            <span>{m.connect.subtitle.trim()}</span>
            <span>{m.connect.subtitleLine2} {m.connect.subtitleLine3}</span>
          </p>
        </header>
        <ol className={styles.steps}>
          {Object.values(m.connect.steps).map((text, index) => (
            <li key={index}>
              <span className={styles.number} aria-hidden="true">{index + 1}</span>
              <h3>{text}</h3>
            </li>
          ))}
        </ol>
        <StoreLinks messages={m} badges />
      </div>
    </section>
  );
}
