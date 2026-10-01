import type { Messages } from "@/lib/content";
import { settings } from "@/lib/settings";

export function StoreLinks({ messages: m }: { messages: Messages }) {
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
        App Store <span aria-hidden="true">↗</span>
      </a>
      <a
        className="button button-secondary"
        href={settings.googlePlay}
        target="_blank"
        rel="noopener noreferrer"
        data-goal="click-download-google-play"
        aria-label={m.common.downloadGooglePlay}
      >
        Google Play <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
