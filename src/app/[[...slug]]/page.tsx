import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  routes,
  localeFor,
  messages,
  isHome,
  isBlog,
  getPage,
  languageFor,
  languages,
  resolvePath,
} from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Landing } from "@/components/Landing";
import { Blog, Content } from "@/components/Blog";
import { Analytics } from "@/components/Analytics";
import { Survey } from "@/components/Survey";
import { ScreenReview } from "@/components/ScreenReview";
import survey from "@/content/survey.json";

type Props = { params: Promise<{ slug?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return [...routes, "/screens", "/alt"].map((path) => ({ slug: path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = resolvePath("/" + slug.join("/")),
    locale = localeFor(path),
    m = messages[locale],
    page = getPage(path);
  const title = path === "/screens" ? "Экраны для сверки | BukaGo" :
    path === "/survey"
      ? `${survey.title} | BukaGo`
      : page
        ? `${page.title} | BukaGo`
        : isBlog(path)
          ? `${m.blog.title} | BukaGo`
          : m.metadata.siteName;
  const description = page?.description || m.metadata.siteDescription;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    icons: {
      icon: siteUrl("/assets/site/favicon.svg"),
      apple: siteUrl("/assets/site/apple-touch-icon.png"),
    },
    alternates: isHome(path)
      ? {
          languages: Object.fromEntries(
            languages.map((l) => [l.locale, siteUrl(l.home)]),
          ),
        }
      : undefined,
    openGraph: {
      title,
      description,
      siteName: "BukaGo",
      locale: m.metadata.openGraphLocale,
      type: page?.kind === "article" ? "article" : "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const path = resolvePath("/" + slug.join("/")),
    locale = localeFor(path),
    m = messages[locale],
    page = getPage(path),
    lang = languageFor(locale);
  const home = isHome(path) || path === "/alt",
    blog = isBlog(path);
  if (path === "/screens") return <ScreenReview />;
  if (!home && !blog && !page && path !== "/survey") notFound();
  return (
    <>
      <a className="skip-link" href="#main-content">
        {locale === "ru" ? "К содержимому" : "Skip to content"}
      </a>
      <Header locale={locale} path={path} messages={m} />
      {home ? (
        <Landing locale={locale} messages={m} alternative={path === "/alt"} />
      ) : blog ? (
        <Blog
          locale={locale}
          messages={m}
          page={Number(path.match(/page-(\d+)/)?.[1] || 1)}
        />
      ) : page ? (
        <Content page={page} locale={locale} messages={m} />
      ) : path === "/survey" ? (
        <Survey />
      ) : null}
      <Footer locale={locale} messages={m} />
      <Analytics
        messages={m}
        privacyPath={`${lang.prefix}/legal/privacy-policy/`}
      />
    </>
  );
}
