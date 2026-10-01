
import { siteUrl } from "@/lib/site-url";
import type { Locale, Messages } from "@/lib/content";
import { languageFor, legalSlugs } from "@/lib/content";
import { settings } from "@/lib/settings";
import { StoreLinks } from "./StoreLinks";
import { Newsletter } from "./Newsletter";

export function Footer({
  locale,
  messages: m,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const lang = languageFor(locale);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="brand" href={siteUrl(lang.home)}>
              <img
                src={siteUrl("/assets/download/app-logo.png")}
                alt=""
                width="36"
                height="36"
              />
              <span>BukaGo</span>
            </a>
            <p>{m.common.siteTagline}</p>
          </div>
          <nav className="footer-navigation" aria-label={m.common.home}>
            {[
              [m.header.howItWorks, "#how-it-works"],
              [m.header.tasks, "#tasks"],
              [m.header.howToConnect, "#how-to-connect"],
              [m.header.forFamily, "#why-works"],
            ].map(([label, id]) => (
              <a key={id} href={siteUrl(`${lang.home}${id}`)}>
                {label}
              </a>
            ))}
            <a href={siteUrl(`${lang.prefix}/blog/`)}>{m.header.blog}</a>
          </nav>
          <StoreLinks messages={m} badges />
        </div>
        <div className="footer-documents">
          <div>
            <h3>{m.common.documents}</h3>
            <nav className="legal-links" aria-label={m.common.documents}>
              {Object.values(m.legal.links).map((label, i) => (
                <a key={label} href={siteUrl(`${lang.prefix}/legal/${legalSlugs[i]}/`)}>
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="company">
          <p>
            ООО «БЭЙСИК» · ОГРН 1267700165193 · ИНН 7751390100 · КПП 775101001
          </p>
          <p>
            108824, г. Москва, вн. тер. г. муниципальный округ Щербинка, с.
            Остафьево, ул. Троицкая, д. 49, стр. 2
          </p>
        </div>
        <div className="footer-bottom">
          <a
            className="footer-social"
            href={siteUrl(settings.telegram)}
            data-goal="click-social-network"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor" d="M21.4 4.6 18.2 20c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.3L5.8 13.7 1 12.2c-1-.3-1-1 .2-1.4L20 3.6c.9-.3 1.7.2 1.4 1Z" />
            </svg>
          </a>
          <p className="footer-copyright">
            {m.common.copyright.replace("{year}", "2026")}
            <br />ООО «БЭЙСИК»
          </p>
          <div className="footer-newsletter">
            <p>{m.footer.newsletterHint}</p>
            <Newsletter
              locale={locale}
              messages={m}
              privacyPath={`${lang.prefix}/legal/privacy-policy/`}
            />
          </div>
        </div>
        <a
          className="back-top"
          href={siteUrl("#top")}
          aria-label={locale === "ru" ? "Наверх" : "Back to top"}
        >
          ↑
        </a>
      </div>
    </footer>
  );
}
