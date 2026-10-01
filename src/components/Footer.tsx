
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
          <div>
            <a className="brand" href={siteUrl(lang.home)}>
              <img
                src={siteUrl("/assets/site/images/logo.png")}
                alt=""
                width="36"
                height="36"
              />
              <span>BukaGo</span>
            </a>
            <p>{m.common.siteTagline}</p>
          </div>
          <StoreLinks messages={m} />
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
        <div className="footer-grid">
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
          <div>
            <h3>{m.footer.newsletterHint}</h3>
            <Newsletter
              locale={locale}
              messages={m}
              privacyPath={`${lang.prefix}/legal/privacy-policy/`}
            />
            <p>
              <a
                href={siteUrl(settings.telegram)}
                data-goal="click-social-network"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram ↗
              </a>
            </p>
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
          <p>{m.common.copyright.replace("{year}", "2026")}</p>
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
