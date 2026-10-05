"use client";

import { useRef, useState } from "react";
import { siteUrl } from "@/lib/site-url";
import styles from "@/styles/picture-task-preview.module.scss";

export function TaskCharacterVideo({ idleOnly = false }: { idleOnly?: boolean }) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const reveal = (index: number) => { setActive(index); setReady(true); };
  return <div className={styles.videoStage}>
    {!ready && <img src={siteUrl("/assets/task-preview/character-header-1.png")} width="128" height="128" alt="" />}
    {(idleOnly ? ["idle"] : ["sleep", "idle"]).map((clip, index) => <video key={clip}
      ref={video => { videos.current[index] = video; }}
      src={siteUrl(`/assets/picture-task/${clip}.webm`)} width="540" height="540"
      autoPlay={index === 0} loop={idleOnly} muted playsInline preload="auto" aria-hidden="true" data-active={ready && active === index}
      onLoadedData={() => { if (index === 0 && !ready) reveal(index); }}
      onPlaying={() => reveal(index)}
      onError={() => { if (active === index) setReady(false); }}
      onEnded={() => {
        const next = videos.current[1 - index];
        if (!next) return;
        next.currentTime = 0;
        next.play().catch(() => {});
      }} />)}
  </div>;
}
