import type { Locale, Messages } from "@/lib/content";
import { blogPath } from "@/lib/content";
import media from "@/content/media.json";
import { StoreLinks } from "./StoreLinks";
import { TaskDemos } from "./TaskDemos";
import { LandingAdditions } from "./LandingAdditions";
import { TimeFeaturePreview } from "./TimeFeaturePreview";

export function Landing({
  locale,
  messages: m,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <main id="main-content">
      <section className="section hero">
        <div className="container hero-grid">
          <div>
            <h1>
              {m.hero.title}
              <span className="accent">{m.hero.titleAccent}</span>
            </h1>
            <p className="lead">{m.hero.description}</p>
            <a className="button" href="#download">
              {m.common.tryFree}
            </a>
          </div>
          <img
            className="hero-image"
            src={media.hero}
            width="1267"
            height="1021"
            alt="BukaGo"
            fetchPriority="high"
          />
        </div>
      </section>
      <section id="how-it-works" className="section">
        <div className="container feature-list">
          {Object.values(m.control.items).map((item, i) => (
            <article className={i === 0 ? "feature feature-time" : "feature"} key={i}>
              {i === 0 ? <div className="time-visual">
                <img className="time-visual-bg" src="/assets/mobile-features/bg1.png" width="390" height="483" alt="" loading="lazy" />
                <TimeFeaturePreview locale={locale} />
                <img className="time-visual-kid" src="/assets/mobile-features/k1.png" width="248" height="178.533" alt="" loading="lazy" />
              </div> : <img
                className="feature-image"
                src={media.features[i]}
                alt={item.images[0]}
                width="385"
                height="385"
                loading="lazy"
              />}
              <div className="feature-copy">
                <h2>{item.title}</h2>
                <p className="lead">{item.text}</p>
                <ul className="plain-list">
                  {Object.values(item.li).map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
                <a className="text-link" href="#download">
                  {m.common.try} <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-tint" id="smart-pauses">
        <div className="container">
          <div className="section-heading">
            <p className="meta">
              990 ·{" "}
              {new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date("2022-08-27T12:00:00Z"))}
            </p>
            <h2>{m.problem.title}</h2>
            <div className="tags">
              {Object.values(m.problem.tags).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="problem-grid">
            <div>
              {Object.values(m.problem.sections).map((item) => (
                <details key={item.title}>
                  <summary>{item.title}</summary>
                  <p>{item.text}</p>
                </details>
              ))}
            </div>
            <div>
              <h3>{m.problem.heading}</h3>
              <p>{m.problem.intro}</p>
              <p>
                {m.problem.footerTitle}
                <br />
                {m.problem.footerTitleLine2}
              </p>
              <a className="text-link" href={blogPath(locale)}>
                {m.problem.goToBlog} →
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="tasks" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>{m.loved.title}</h2>
            <p className="lead">{m.loved.description}</p>
          </div>
          <TaskDemos content={m.loved} locale={locale} />
        </div>
      </section>
      <section id="how-to-connect" className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">{m.connect.badge}</p>
            <h2>{m.connect.title}</h2>
            <p>
              {m.connect.subtitle}
              {m.connect.subtitleLine2} {m.connect.subtitleLine3}
            </p>
          </div>
          <ol className="steps">
            {Object.values(m.connect.steps).map((text, i) => (
              <li key={i}>
                <span aria-hidden="true">{i + 1}</span>
                <h3>{text}</h3>
              </li>
            ))}
          </ol>
          <StoreLinks messages={m} />
        </div>
      </section>
      <section id="why-works" className="section">
        <div className="container family-grid">
          {Object.values(m.works.items).map((item, i) => (
            <article key={i}>
              <h2>{item.title}</h2>
              <ul className="plain-list">
                {Object.values(item.list).map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <a className="text-link" href={blogPath(locale)}>
                {m.works.readArticle} →
              </a>
            </article>
          ))}
        </div>
      </section>
      <LandingAdditions locale={locale} messages={m} />
      <section id="download" className="section section-tint">
        <div className="container download-grid">
          <div>
            <h2>{m.app.title}</h2>
            <p className="lead">{m.app.subtitle}</p>
            <StoreLinks messages={m} />
          </div>
          <img
            src={media.download}
            alt={m.common.phoneAlt}
            width="350"
            height="450"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}
