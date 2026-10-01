"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/landing-additions.module.scss";

export function PromoCodeButton({ code, label, copied, failure }: { code: string; label: string; copied: string; failure: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };
  return <span className={styles.promoCodeWrap}>
    <button className={styles.promoCode} type="button" onClick={copy} aria-label={label}><code>{code}</code></button>
    <span className={styles.copyStatus} role="status" aria-live="polite">{status === "copied" ? copied : status === "failed" ? failure : ""}</span>
  </span>;
}
