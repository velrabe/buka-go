
import { siteUrl } from "@/lib/site-url";
import copy from "@/content/landing-additions.json";
import { languageFor, type Locale, type Messages } from "@/lib/content";
import { settings } from "@/lib/settings";
import { StoreLinks } from "./StoreLinks";
import styles from "@/styles/landing-additions.module.scss";

const reviews = [
  ["На будни один режим, на выходные другой", "AlexanderHarhc85"],
  ["Здесь нравится, что ребёнку не просто закрывают телефон, а предлагают переключиться.", "Dr.Melnik_IS"],
  ["Я вижу общую картину", "AlyaMelnik"],
];
export function LandingAdditions({ locale, messages }: { locale: Locale; messages: Messages }) {
  const m = copy[locale];
  const legal = `${languageFor(locale).prefix}/legal`;
  return <>
    <section id="compatibility" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-heading"><h2>{m.compatTitle}</h2></div>
        <div className={styles.pair}>{[m.parent, m.child].map(title => <article className={styles.card} key={title}>
          <h3>{title}</h3><p>{m.ios}</p><p>{m.android}</p>
        </article>)}</div>
        <div className={styles.note}><h3>{m.permissionsTitle}</h3><p>{m.permissions}</p><p>{m.platformNote}</p></div>
        <StoreLinks messages={messages} />
      </div>
    </section>
    <section id="reviews" className={`section section-tint ${styles.section}`}>
      <div className="container">
        <div className="section-heading"><h2>{m.reviewsTitle}</h2></div>
        <div className={styles.reviews}>{reviews.map(([quote, author]) => <figure className={styles.card} key={author}>
          <blockquote lang="ru"><p>«{quote}»</p></blockquote>
          <figcaption><strong>{author}</strong><a href={siteUrl(settings.appStore)} target="_blank" rel="noopener noreferrer">{m.reviewLink} ↗</a></figcaption>
        </figure>)}</div><p className={styles.fine}>{m.reviewNote}</p>
      </div>
    </section>
    <section id="plans" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-heading"><h2>{m.plansTitle}</h2></div>
        <div className={styles.pair}>
          <article className={styles.plan}><h3>{m.free}</h3><p>{m.freeIntro}</p><p className={styles.fine}>{m.freeNote}</p><a className="button button-secondary" href={siteUrl("#download")}>{m.useFree}</a></article>
          <article className={`${styles.plan} ${styles.pro}`}><h3>BukaGo <span>PRO</span></h3><p>{m.proIntro}</p><ul>{m.proFeatures.map(feature => <li key={feature}>{feature}</li>)}</ul><a className="button" href={siteUrl("#download")}>{m.viewPro}</a></article>
        </div><p className={styles.fine}>{m.planNote}</p>
        <aside className={styles.promo} id="pro-offer"><div><h3>{m.promoTitle}</h3><p>{m.promoLead}</p><p className={styles.fine}>{m.promoNote}</p><a href={siteUrl(`${legal}/offer/`)}>{m.terms} ↗</a></div><a className="button" href={siteUrl("#download")}>{m.promoCta}</a></aside>
      </div>
    </section>
    <section id="partners" className={`section ${styles.section}`}>
      <div className="container"><div className="section-heading"><h2>{m.partnersTitle}</h2></div>
        <div className={styles.pair}>{["ТОО «GlobalTransSystem»", "ООО «AZIM GRAND DIGITAL»"].map((name, i) => <article className={styles.card} key={name}><h3>{name}</h3><p>{m.partnerRoles[i]}</p></article>)}</div>
        <p className={styles.fine}><a href={siteUrl(`${legal}/offer/`)}>{m.sourceLabel} ↗</a></p>
      </div>
    </section>
    <section id="faq" className={`section ${styles.section}`}>
      <div className={`container ${styles.faq}`}><div className="section-heading"><h2>{m.faqTitle}</h2></div>
        {m.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        <div className={styles.links}><a href={siteUrl(`${legal}/privacy-policy/`)}>{m.privacy}</a><a href={siteUrl(`${legal}/offer/`)}>{m.terms}</a></div>
      </div>
    </section>
  </>;
}
