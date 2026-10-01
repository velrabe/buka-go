"use client";

import Script from "next/script";
declare global {
  interface Window {
    Ya?: { share2: (id: string) => unknown };
  }
}

/** The same functional sharing widget used by the original blog. */
export function Share({ url, title }: { url: string; title: string }) {
  return (
    <>
      <div
        id="ya-share2"
        className="ya-share2"
        data-curtain="true"
        data-size="s"
        data-limit="0"
        data-more-button-type="short"
        data-shape="round"
        data-services="vkontakte,odnoklassniki,telegram,viber,whatsapp,moimir,lj"
        data-url={url}
        data-title={title}
      />
      <Script
        src="https://yastatic.net/share2/share.js"
        onReady={() => {
          window.Ya?.share2("ya-share2");
        }}
      />
    </>
  );
}
