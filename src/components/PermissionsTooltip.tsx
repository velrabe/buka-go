"use client";

import { useEffect, useId, useRef, useState } from "react";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/landing-additions.module.scss";

const icons = ["usage", "overlay", "location", "background-location", "notifications", "battery", "administrator", "accessibility"];

export function PermissionsTooltip({ title, labels }: { title: string; labels: string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return <div ref={root} className={styles.permissionInfo}
    onPointerEnter={event => { if (event.pointerType === "mouse") setOpen(true); }}
    onPointerLeave={event => { if (event.pointerType === "mouse" && !root.current?.contains(document.activeElement)) setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === "Escape") { setOpen(false); event.stopPropagation(); } }}>
    <button type="button" className={styles.permissionTrigger} aria-expanded={open} aria-controls={id} aria-describedby={open ? id : undefined}
      onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setOpen(true); }}
      onClick={() => setOpen(value => !value)}>
      {title}<span className={styles.infoIcon} aria-hidden="true">i</span>
    </button>
    <div id={id} className={styles.permissionTooltip} role="tooltip" aria-hidden={!open} data-open={open}>
      <ul>{labels.map((label, index) => <li key={icons[index]}>
        <img src={siteUrl(`/assets/permissions/${icons[index]}.svg`)} width="32" height="32" alt="" />
        <span>{label}</span>
      </li>)}</ul>
    </div>
  </div>;
}
