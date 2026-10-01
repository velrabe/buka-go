import { ScreenLocaleProvider } from "./ScreenLocale";

import { siteUrl } from "@/lib/site-url";
import type { Locale, Messages } from "@/lib/content";
import { blogPath } from "@/lib/content";
import media from "@/content/media.json";
import { StoreLinks } from "./StoreLinks";
import { TaskDemos } from "./TaskDemos";
import { LandingAdditions } from "./LandingAdditions";
import { TimeVisual } from "./TimeVisual";
import { StaticProgramsScreen, StaticSuccessScreen, StaticHealthyScreen, StaticMapScreen } from "./FeatureScreens";
import { ContentScreen, StaticContentBody } from "./ContentScreen";
import { HeroComposition } from "./HeroComposition";
import { ConnectionSteps } from "./ConnectionSteps";
import articleStyles from "@/styles/landing-article.module.scss";
import taskStyles from "@/styles/task-demos.module.scss";
import worksStyles from "@/styles/works-features.module.scss";
import downloadStyles from "@/styles/download-banner.module.scss";

export function Landing({
  locale,
  messages: m,
  alternative = false,
}: {
  locale: Locale;
  messages: Messages;
  alternative?: boolean;
}) {
  return (
    <ScreenLocaleProvider locale={locale}><main id="main-content">
      <HeroComposition locale={locale}>
        {locale === "ru" && <p data-hero-benefit>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 3c1.4 5 2.8 6.5 7 8-4.2 1.5-5.6 3-7 8-1.4-5-2.8-6.5-7-8 4.2-1.5 5.6-3 7-8ZM5 1c.6 2.1 1.2 2.7 3 3.5C6.2 5.3 5.6 5.9 5 8c-.6-2.1-1.2-2.7-3-3.5C3.8 3.7 4.4 3.1 5 1ZM5 15c.6 2.1 1.2 2.7 3 3.5C6.2 19.3 5.6 19.9 5 22c-.6-2.1-1.2-2.7-3-3.5C3.8 17.7 4.4 17.1 5 15Z" /></svg>
          <strong><span>Переключает внимание</span>{" "}<span>ребёнка с&nbsp;телефона</span></strong>
        </p>}
        <h1>{m.hero.title}<span>{locale === "ru" ? m.hero.titleAccent.replace(/(^|\s)(с|на) /g, "$1$2\u00a0") : m.hero.titleAccent}</span></h1>
        <p>{m.hero.description}</p>
        <a href={siteUrl("#download")}>{m.common.tryFree} <span aria-hidden="true">→</span></a>
        <StoreLinks messages={m} badges />
      </HeroComposition>
      <section id="how-it-works" className="section">
        <div className="container feature-list">
          {Object.values(m.control.items).map((item, i) => (
            <article className={i === 0 ? "feature feature-time" : "feature"} key={i}>
              {i === 0 ? <TimeVisual className={alternative ? "" : "time-visual-layered"}>
                {alternative && <div className="time-visual-scene">
                <img className="time-visual-bg" src={siteUrl("/assets/mobile-features/bg1.png")} width="390" height="483" alt="" loading="lazy" />
                <img className="time-visual-kid" src={siteUrl("/assets/mobile-features/k1.png")} width="248" height="178.533" alt="" loading="lazy" />
                </div>}
                {alternative ? <div className="time-visual-phone"><ContentScreen locale={locale} /></div> : <>
                  <div className="time-visual-main-screen" aria-hidden="true">
                    <div className="time-visual-screen-viewport">
                      <div className="time-visual-main-screen-scale">
                        <div className="time-visual-scroll-track">
                          <StaticContentBody locale={locale} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <img className="time-visual-foreground" src={siteUrl("/assets/mobile-features/f1.png")} width="1120" height="1120" alt="" loading="lazy" />
                </>}
              </TimeVisual> : i === 1 ? <TimeVisual className="time-visual-layered time-visual-programs">
                <div className="time-visual-main-screen" aria-hidden="true">
                  <div className="time-visual-screen-viewport">
                    <div className="time-visual-program-screen-scale">
                      <StaticProgramsScreen />
                    </div>
                  </div>
                </div>
                <img className="time-visual-foreground" src={siteUrl("/assets/mobile-features/f2.png")} width="1120" height="1120" alt="" loading="lazy" />
              </TimeVisual> : i === 2 ? <TimeVisual className="time-visual-layered time-visual-success">
                <div className="time-visual-main-screen" aria-hidden="true">
                  <div className="time-visual-screen-viewport">
                    <div className="time-visual-success-screen-scale">
                      <StaticSuccessScreen />
                    </div>
                  </div>
                </div>
                <img className="time-visual-foreground" src={siteUrl("/assets/mobile-features/f3.png")} width="1120" height="1120" alt="" loading="lazy" />
              </TimeVisual> : i === 3 ? <TimeVisual className="time-visual-layered time-visual-healthy">
                <div className="time-visual-main-screen" aria-hidden="true">
                  <div className="time-visual-screen-viewport">
                    <div className="time-visual-success-screen-scale">
                      <StaticHealthyScreen />
                    </div>
                  </div>
                </div>
                <img className="time-visual-foreground" src={siteUrl("/assets/mobile-features/f4.png")} width="1120" height="1120" alt="" loading="lazy" />
              </TimeVisual> : i === 4 ? <TimeVisual className="time-visual-layered time-visual-map">
                <div className="time-visual-main-screen" aria-hidden="true">
                  <div className="time-visual-screen-viewport">
                    <div className="time-visual-main-screen-scale">
                      <StaticMapScreen />
                    </div>
                  </div>
                </div>
                <img className="time-visual-foreground" src={siteUrl("/assets/mobile-features/f5.png")} width="1120" height="1120" alt="" loading="lazy" />
              </TimeVisual> : <img
                className="feature-image"
                src={siteUrl(media.features[i])}
                alt={item.images[0]}
                width="385"
                height="385"
                loading="lazy"
              />}
              <div className="feature-copy">
                {i <= 4 && <div className="feature-icon-container">
                  <img
                    className="feature-content-icon"
                    src={siteUrl(i === 0 ? "/assets/app-content/nav-content-on.png" : i === 4 ? "/assets/app-content/nav-map-on.png" : "/assets/app-content/nav-tasks-on.png")}
                    width="48"
                    height="48"
                    alt=""
                    aria-hidden="true"
                  />
                </div>}
                <div className="feature-heading">
                  <h2>{item.title}</h2>
                  <p className="lead">{locale === "ru" ? item.text.replace(/(^|\s)(в|во|на|и|с|со|к|ко|по|из|от|до|у|о|об|для|без|над|под|за)\s+/gi, "$1$2\u00a0") : item.text}</p>
                </div>
                <ul className="plain-list">
                  {Object.values(item.li).map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
                <div className="feature-actions">
                  <a className="text-link" href={siteUrl("#download")}>
                    {m.common.try} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className={`section ${articleStyles.section}`} id="smart-pauses">
        <article className="container">
          <img className={articleStyles.cover} src={siteUrl("/assets/mobile-features/problem.png")} width="1536" height="787" alt={m.problem.imageAlt} loading="lazy" />
          <header className={articleStyles.header}>
            <p className={articleStyles.meta}>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>990</span><span aria-hidden="true">·</span>{" "}
              {new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date("2022-08-27T12:00:00Z"))}
            </p>
            <h2>{m.problem.title}</h2>
            <div className={articleStyles.tags}>
              {Object.values(m.problem.tags).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </header>
          <div className={articleStyles.body}>
            <div className={articleStyles.preview}>
            <ol className={articleStyles.points}>
              {Object.values(m.problem.sections).map((item, index) => (
                <li className={articleStyles.point} key={item.title}>
                  <span className={articleStyles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{locale === "ru" ? item.text.replace(/(^|\s)(в|во|на|и|с|со|к|ко|по|из|от|до|у|о|об|для|без|над|под|за)\s+/gi, "$1$2\u00a0") : item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
              <p className={articleStyles.intro}>{m.problem.intro}</p>
            </div>
            <div className={articleStyles.excerpt}>
              <p className={articleStyles.journalPrompt}>
                <span>{m.problem.footerTitle}</span>
                <span>{m.problem.footerTitleLine2}</span>
              </p>
              <a className={articleStyles.blogLink} href={siteUrl(blogPath(locale))}>
                {m.problem.goToBlog} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </article>
      </section>
      <section id="tasks" className={`section ${taskStyles.section}`}>
        <div className="container">
          <div className="section-heading">
            <h2>{m.loved.title}</h2>
            <p className="lead">{m.loved.description}</p>
          </div>
          <TaskDemos content={m.loved} locale={locale} />
        </div>
      </section>
      <ConnectionSteps messages={m} />
      <section id="why-works" className="section">
        <div className={`container feature-list ${worksStyles.list}`}>
          {Object.values(m.works.items).map((item, i) => (
            <article className={`feature ${worksStyles.feature}`} key={i}>
              <img
                className={worksStyles.image}
                src={siteUrl(`/assets/mobile-features/works-${i + 1}.png`)}
                width="968"
                height="968"
                alt={item.title}
                loading="lazy"
              />
              <div className={worksStyles.copy}>
                <div className={worksStyles.heading}><h2>{item.title}</h2></div>
                <ul className={`plain-list ${worksStyles.points}`}>
                  {Object.values(item.list).map((text) => (
                    <li key={text}>{locale === "ru" ? text.replace(/(^|\s)(в|во|на|и|с|со|к|ко|по|из|от|до|у|о|об|для|без|над|под|за)\s+/gi, "$1$2\u00a0") : text}</li>
                  ))}
                </ul>
                <div className={worksStyles.actions}>
                  <a className={worksStyles.link} href={siteUrl(blogPath(locale))}>
                    {m.works.readArticle} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <LandingAdditions locale={locale} />
      <section id="download" className={`section ${downloadStyles.section}`} aria-labelledby="download-title">
        <div className={`container ${downloadStyles.banner}`}>
          <div className={downloadStyles.copy}>
            <h2 id="download-title">{m.app.title}</h2>
            <p>{m.app.subtitle}</p>
            <StoreLinks messages={m} badges />
          </div>
          <div className={downloadStyles.visual}>
            <img className={downloadStyles.cloud} src={siteUrl("/assets/hero/cloud-xl.png")} width="856" height="358" alt="" loading="lazy" />
            <img className={downloadStyles.phone} src={siteUrl("/assets/download/phone.png")} alt={m.common.phoneAlt} width="883" height="1120" loading="lazy" />
            <img className={downloadStyles.logo} src={siteUrl("/assets/download/app-logo.png")} alt="" width="420" height="420" loading="lazy" />
          </div>
        </div>
      </section>
    </main></ScreenLocaleProvider>
  );
}
