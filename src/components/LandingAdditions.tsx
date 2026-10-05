
import { siteUrl } from "@/lib/site-url";
import copy from "@/content/landing-additions.json";
import { languageFor, type Locale } from "@/lib/content";
import styles from "@/styles/landing-additions.module.scss";
import { PermissionsTooltip } from "./PermissionsTooltip";
import { SupportedPlatforms } from "./SupportedPlatforms";
import { ReviewCarousel } from "./ReviewCarousel";
import { PromoCodeButton } from "./PromoCodeButton";
import type { CSSProperties } from "react";

function PricingIcon({ kind }: { kind: "arrow" | "check" }) {
  const asset = kind === "arrow" ? "/assets/feature-ui/right.svg" : "/assets/site/images/landing/check.svg";
  return <span className={styles.pricingIcon} aria-hidden="true" style={{ "--pricing-icon": `url("${siteUrl(asset)}")` } as CSSProperties} />;
}

export function LandingAdditions({ locale }: { locale: Locale }) {
  const m = copy[locale];
  const legal = `${languageFor(locale).prefix}/legal`;
  return <>
    <section id="compatibility" className={`section ${styles.section}`} aria-labelledby="compatibility-title">
      <div className={`container ${styles.compatibilityContainer}`}>
        <header className={styles.heading}><h2 id="compatibility-title">{m.compatTitle}</h2></header>
        <div className={styles.compatibilityPanel}>
          <div className={styles.compatibilityGrid}>{[m.parent, m.child].map((title, index) => <article className={styles.device} key={title}>
            <img className={styles.deviceImage} src={siteUrl(`/assets/compatibility/${index === 0 ? "parent" : "child"}.png`)} width="981" height="644" alt="" loading="lazy" />
            <div className={styles.deviceContent}>
              <h3>{title}</h3>
              <SupportedPlatforms />
            </div>
          </article>)}</div>
          <div className={styles.compatibilityNote}>
            <div><PermissionsTooltip title={m.permissionsTitle} labels={m.permissionLabels} /><p>{m.platformNote}</p></div>
          </div>
        </div>
      </div>
    </section>
    <section id="plans" className={`section ${styles.section} ${styles.pricingSection}`} aria-labelledby="plans-title">
      <div className={`container ${styles.pricingContainer}`}>
        <header className={styles.pricingHeading}>
          <h2 id="plans-title">{m.plansHeadline}<span>{m.plansAccent}</span></h2>
        </header>
        <div className={styles.pair}>
          <article className={styles.plan}>
            <h3>{m.free}</h3>
            <ul className={styles.planFeatures}>{m.freeFeatures.map(feature => <li key={feature}><PricingIcon kind="check" /><span>{feature}</span></li>)}</ul>
            <a className={styles.planAction} href={siteUrl(`${languageFor(locale).home}#download`)}><span>{m.freeAction}</span><PricingIcon kind="arrow" /></a>
          </article>
          <article className={`${styles.plan} ${styles.pro}`}>
            <h3>BukaGo <span>PRO</span></h3>
            <ul className={styles.planFeatures}>{m.proFeatures.map(feature => {
              const [title, description] = feature.split(" — ");
              return <li key={feature}><PricingIcon kind="check" /><span>{description ? <><strong>{title}</strong> — {description}</> : feature}</span></li>;
            })}</ul>
            <a className={`${styles.planAction} ${styles.proAction}`} href={siteUrl(`${languageFor(locale).home}#download`)}><span>{m.proAction}</span><PricingIcon kind="arrow" /></a>
          </article>
        </div>
        <aside className={styles.promo} id="pro-offer">
          <div><p>{m.promoPrefix}{" "}<PromoCodeButton code={m.promoCode} label={m.copyCode} copied={m.codeCopied} failure={m.copyCodeFailed} /> — {m.promoBenefit}</p><p>{m.promoNote}</p></div>
          <a className={styles.promoAction} href={siteUrl(`${languageFor(locale).home}#download`)}><span>{m.promoAction}</span><PricingIcon kind="arrow" /></a>
        </aside>
      </div>
    </section>
    <section id="reviews" className={`section ${styles.section} ${styles.reviewSection}`} aria-labelledby="reviews-title">
      <div className="container">
        <header className={styles.heading}><h2 id="reviews-title">{m.reviewsTitle}</h2></header>
        <ReviewCarousel locale={locale} reviews={m.reviews} />
      </div>
    </section>
    <section id="partners" className={`section ${styles.section}`} aria-labelledby="partners-title">
      <div className="container"><header className={styles.heading}><h2 id="partners-title">{m.partnersTitle}</h2></header>
        <div className={styles.partnerGrid}>
          {m.partners.map((partner, index) => <article className={styles.partner} key={partner.name}>
            <div className={styles.partnerInner}>
              <div className={styles.partnerVisual} aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="9" cy="9" r="1.5" /><path d="m4 18 5-5 4 4 3-3 4 4" /></svg>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.partnerContent}>
                <h3>{partner.name}</h3>
                <p>{partner.profile}</p>
              </div>
            </div>
          </article>)}
        </div>
      </div>
    </section>
    <section id="faq" className={`section ${styles.section}`}>
      <div className={`container ${styles.faq}`}>
        <div className={styles.faqHeading}><h2>{m.faqTitle}</h2></div>
        <div className={styles.faqList}>
          {m.faq.map(([question, answer]) => <details className={styles.faqItem} key={question}>
            <summary className={styles.faqQuestion}>
              <span>{question}</span>
              <span className={styles.faqToggle} aria-hidden="true" />
            </summary>
            <p className={styles.faqAnswer}>{answer}</p>
          </details>)}
        </div>
        <div className={styles.links}><a href={siteUrl(`${legal}/privacy-policy/`)}>{m.privacy}</a><a href={siteUrl(`${legal}/offer/`)}>{m.terms}</a></div>
      </div>
    </section>
  </>;
}
