"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Locale, Messages } from "@/lib/content";
import { settings } from "@/lib/settings";
import { trackGoal } from "./Analytics";

const ui: Record<
  Locale,
  {
    close: string;
    fallback: string;
    continue: string;
    consent: string;
    success: string;
  }
> = {
  ru: {
    close: "Закрыть",
    fallback:
      "Подписка на рассылку доступна на основном сайте BukaGo: нажмите «Подписаться» внизу страницы.",
    continue: "Перейти на BukaGo",
    consent: "Согласен на обработку данных для получения рассылки",
    success: "Подписка оформлена",
  },
  en: {
    close: "Close",
    fallback:
      "Subscribe on the main BukaGo website using the Subscribe button at the bottom of the page.",
    continue: "Go to BukaGo",
    consent: "I agree to data processing to receive the newsletter",
    success: "Subscription confirmed",
  },
  kk: {
    close: "Жабу",
    fallback:
      "BukaGo негізгі сайтының төменгі жағындағы жазылу түймесін пайдаланыңыз.",
    continue: "BukaGo сайтына өту",
    consent: "Хаттарды алу үшін деректерді өңдеуге келісемін",
    success: "Жазылым расталды",
  },
  uz: {
    close: "Yopish",
    fallback:
      "BukaGo asosiy saytining pastki qismidagi obuna tugmasidan foydalaning.",
    continue: "BukaGo saytiga oʻtish",
    consent: "Xabarnoma uchun maʼlumotlarni qayta ishlashga roziman",
    success: "Obuna tasdiqlandi",
  },
  az: {
    close: "Bağla",
    fallback:
      "BukaGo əsas saytının aşağı hissəsindəki abunə düyməsindən istifadə edin.",
    continue: "BukaGo saytına keç",
    consent: "Xəbərləri almaq üçün məlumatların işlənməsinə razıyam",
    success: "Abunə təsdiqləndi",
  },
};

export function Newsletter({
  messages: m,
  locale,
  privacyPath,
}: {
  messages: Messages;
  locale: Locale;
  privacyPath: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const t = ui[locale];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings.newsletterEndpoint) return;
    const form = event.currentTarget;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(settings.newsletterEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: new FormData(form).get("email"),
          consent: true,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error();
      setStatus(typeof data.message === "string" ? data.message : t.success);
      form.reset();
      trackGoal("send-subscribe-form");
    } catch {
      setStatus(m.modal.submitError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="button button-secondary"
        onClick={() => {
          setStatus("");
          dialog.current?.showModal();
          trackGoal("open-subscribe-modal");
        }}
      >
        {m.common.subscribe}
      </button>
      <dialog
        ref={dialog}
        className="newsletter-dialog"
        aria-labelledby="newsletter-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-content">
          <button
            className="dialog-close"
            aria-label={t.close}
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
          <h2 id="newsletter-title">{m.modal.title}</h2>
          <p>{m.modal.description}</p>
          {settings.newsletterEndpoint ? (
            <form onSubmit={submit}>
              <label>
                {m.modal.emailPlaceholder}
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={m.modal.emailPlaceholder}
                />
              </label>
              <label className="consent">
                <input type="checkbox" required />{" "}
                <span>
                  {t.consent} ·{" "}
                  <a href={privacyPath}>{m.cookie.privacyPolicy}</a>
                </span>
              </label>
              <button className="button" type="submit" disabled={busy}>
                {busy ? "…" : m.common.subscribe}
              </button>
              <p role="status">{status}</p>
            </form>
          ) : (
            <>
              <p>{t.fallback}</p>
              <a
                className="button"
                href="https://bukago.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.continue} ↗
              </a>
            </>
          )}
          <p>{m.modal.socialHint}</p>
          <a
            href={settings.telegram}
            target="_blank"
            rel="noopener noreferrer"
            data-goal="click-social-network"
          >
            Telegram ↗
          </a>
        </div>
      </dialog>
    </>
  );
}
