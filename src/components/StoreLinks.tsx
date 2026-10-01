import type { Messages } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import { settings } from "@/lib/settings";

export function StoreLinks({ messages: m, badges = false }: { messages: Messages; badges?: boolean }) {
  return (
    <div className="store-links">
      <a
        className="button button-secondary"
        href={settings.appStore}
        target="_blank"
        rel="noopener noreferrer"
        data-goal="click-download-app-store"
        aria-label={m.common.downloadAppStore}
      >
        {badges ? <img src={siteUrl("/assets/site/images/landing/app-store.svg")} width="152" height="68" alt="App Store" /> : <>App Store <span aria-hidden="true">↗</span></>}
      </a>
      <a
        className="button button-secondary"
        href={settings.googlePlay}
        target="_blank"
        rel="noopener noreferrer"
        data-goal="click-download-google-play"
        aria-label={m.common.downloadGooglePlay}
      >
        {badges ? <img src={siteUrl("/assets/site/images/landing/google-play.svg")} width="175" height="68" alt="Google Play" /> : <>Google Play <span aria-hidden="true">↗</span></>}
      </a>
    </div>
  );
}
