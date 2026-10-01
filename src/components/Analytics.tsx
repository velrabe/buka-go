"use client";

import { useEffect, useState } from "react";
import { settings } from "@/lib/settings";
import type { Messages } from "@/lib/content";

type Metrika = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
declare global {
  interface Window {
    ym?: Metrika;
  }
}
const consentKey = "bukago-cookie-consent";

export function trackGoal(goal: string) {
  if (settings.analyticsHosts.includes(window.location.hostname))
    window.ym?.(settings.metrikaId, "reachGoal", goal);
}

export function Analytics({
  messages: m,
  privacyPath,
}: {
  messages: Messages;
  privacyPath: string;
}) {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    try {
      const consent = localStorage.getItem(consentKey) === "accepted";
      setAccepted(consent);
      setVisible(!consent);
    } catch {
      setVisible(true);
    }
  }, []);
  useEffect(() => {
    if (
      !accepted ||
      !settings.metrikaId ||
      !settings.analyticsHosts.includes(window.location.hostname)
    )
      return;
    if (!window.ym) {
      const queue: Metrika = (...args: unknown[]) => {
        (queue.a ??= []).push(args);
      };
      queue.l = Date.now();
      window.ym = queue;
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://mc.yandex.ru/metrika/tag.js?id=${settings.metrikaId}`;
      document.head.append(script);
      window.ym(settings.metrikaId, "init", {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        referrer: document.referrer,
        url: window.location.href,
        accurateTrackBounce: true,
        trackLinks: true,
      });
    }
    function onClick(event: MouseEvent) {
      const el =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-goal]")
          : null;
      if (el?.dataset.goal) trackGoal(el.dataset.goal);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [accepted]);
  return visible ? (
    <aside className="cookie-notice" aria-label={m.cookie.ariaLabel}>
      <div>
        <strong>{m.cookie.title}</strong>
        <p>
          {m.cookie.text}
          <a href={privacyPath}>{m.cookie.privacyPolicy}</a>.
        </p>
      </div>
      <button
        className="button button-small"
        onClick={() => {
          try {
            localStorage.setItem(consentKey, "accepted");
          } catch {}
          setAccepted(true);
          setVisible(false);
        }}
      >
        {m.cookie.accept}
      </button>
    </aside>
  ) : null;
}
