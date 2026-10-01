
import { siteUrl, siteHtml } from "@/lib/site-url";
import {
  articles,
  blogPath,
  pageSize,
  languageFor,
  type Locale,
  type Messages,
  type ContentPage,
} from "@/lib/content";
import { settings } from "@/lib/settings";
import { Share } from "./Share";
import { SurveyLink } from "./Survey";

export function Blog({
  locale,
  messages: m,
  page = 1,
}: {
  locale: Locale;
  messages: Messages;
  page?: number;
}) {
  const all = articles.filter((p) => p.locale === locale);
  const count = Math.ceil(all.length / pageSize);
  const visible = all.slice((page - 1) * pageSize, page * pageSize);
  return (
    <main id="main-content" className="section">
      <div className="container">
        <nav className="breadcrumbs">
          <a href={siteUrl(languageFor(locale).home)}>{m.common.home}</a>
          <span aria-hidden="true">/</span>
          <span>{m.blog.title}</span>
        </nav>
        <div className="section-heading">
          <h1>{m.blog.title}</h1>
          <p className="lead">{m.blog.description}</p>
        </div>
        {locale === "ru" && <SurveyLink />}
        {visible.length ? (
          <div className="blog-grid">
            {visible.map((article) => (
              <article key={article.path}>
                <a href={siteUrl(`${article.path}/`)}>
                  {article.cover && (
                    <img
                      src={siteUrl(article.cover)}
                      alt=""
                      width="640"
                      height="360"
                      loading="lazy"
                    />
                  )}
                  <h2>{article.title}</h2>
                </a>
                <p>{article.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>{m.blog.empty}</p>
        )}
        {count > 1 && (
          <nav className="pagination" aria-label={m.blog.title}>
            {page > 1 && (
              <a
                href={siteUrl(page === 2
                    ? blogPath(locale)
                    : `${blogPath(locale)}page-${page - 1}/`)}
              >
                {m.blog.prevPage}
              </a>
            )}
            {Array.from({ length: count }, (_, i) => (
              <a
                key={i}
                href={siteUrl(i === 0
                    ? blogPath(locale)
                    : `${blogPath(locale)}page-${i + 1}/`)}
                aria-current={page === i + 1 ? "page" : undefined}
                aria-label={m.blog.pageAriaLabel.replace(
                  "{page}",
                  String(i + 1),
                )}
              >
                {i + 1}
              </a>
            ))}
            {page < count && (
              <a href={siteUrl(`${blogPath(locale)}page-${page + 1}/`)}>
                {m.blog.nextPage}
              </a>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}

export function Content({
  page,
  locale,
  messages: m,
}: {
  page: ContentPage;
  locale: Locale;
  messages: Messages;
}) {
  const lang = languageFor(locale);
  return (
    <main id="main-content" className="section">
      <div className="container reading-width">
        <nav className="breadcrumbs">
          <a href={siteUrl(lang.home)}>{m.common.home}</a>
          <span aria-hidden="true">/</span>
          <a
            href={siteUrl(page.kind === "article"
                ? blogPath(locale)
                : `${lang.prefix}/legal/requisites/`)}
          >
            {page.kind === "article" ? m.blog.title : m.common.documents}
          </a>
        </nav>
        {page.kind === "article" && <SurveyLink />}
        <article>
          <header className="article-header">
            <h1>{page.title}</h1>
            {page.updated && <p className="meta">{page.updated}</p>}
            {page.kind === "article" && (
              <div className="article-meta">
                {page.published && (
                  <time dateTime={page.published}>
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: "long",
                      timeZone: "UTC",
                    }).format(new Date(page.published))}
                  </time>
                )}
                {page.meta && <span>{page.meta} просмотров</span>}
                <Share url={page.source} title={page.title} />
              </div>
            )}
            {page.cover && (
              <img
                className="article-cover"
                src={siteUrl(page.cover)}
                alt={page.title}
                width="1300"
                height="600"
              />
            )}
          </header>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: siteHtml(page.body) }}
          />
        </article>
        {page.kind === "article" && (
          <aside className="article-follow">
            <p>{m.modal.socialHint}</p>
            <a
              className="button button-secondary"
              href={siteUrl(settings.telegram)}
              target="_blank"
              rel="noopener noreferrer"
              data-goal="click-banner-telegram"
            >
              Telegram ↗
            </a>
          </aside>
        )}
      </div>
    </main>
  );
}
