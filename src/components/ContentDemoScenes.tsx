"use client";
import { siteUrl } from "@/lib/site-url";


import { DemoSkeleton } from "./DemoSkeleton";
import type { CSSProperties } from "react";
import copy from "@/content/app-demo.json";
import type { ContentDemoFrame } from "@/lib/content-demo-timeline";
import styles from "@/styles/content-demo-scenes.module.scss";

const asset = (name: string) => siteUrl(`/assets/app-content/${name}`);
const modes = [
  { name: "Мой режим", icon: "433123a6c53ccade.svg", color: "#9279e8" },
  { name: "Учеба", icon: "6b4d5c7803e11793.svg", color: "#559be6" },
  { name: "Уроки", icon: "a357b3331b8b7c1f.svg", color: "#f37178" },
  { name: "Игры", icon: "game-solid.svg", color: "#e7883f" },
  { name: "Отдых", icon: "98165725ea0b8728.svg", color: "#69c46d" },
  { name: "Сон", icon: "07a95523a0ec277d.svg", color: "#9279e8" },
];
function tapStyle(frame: ContentDemoFrame, target: string): CSSProperties {
  const active = frame.focus === target;
  const press = active ? frame.tap : 0;
  return { zIndex: active && frame.focusAmount > 0 ? 8 : undefined, "--guide-strength": active ? frame.focusAmount : 0, "--guide-press": press,
    filter: press > 0 ? `brightness(${1 + press * (target === "submit" ? .12 : -.1)})` : undefined,
  } as CSSProperties;
}
function text(section: keyof typeof copy, id: string) {
  return (copy[section].text as Record<string, { text: string }>)[id].text;
}
function Icon({ index }: { index: number }) {
  return <span className={styles.icon} style={{ maskImage: `url(${asset(modes[index].icon)})` }} />;
}
function Wheel({ value, maximum }: { value: number; maximum: number }) {
  const center = Math.round(value);
  return <div className={styles.wheelColumn}>{Array.from({ length: 9 }, (_, i) => {
    const number = center + i - 4;
    const distance = number - value;
    return <span key={number} style={{
      transform: `translateY(${distance * 30}px) rotateX(${Math.max(-78, Math.min(78, distance * 18))}deg)`,
      opacity: Math.max(0, 1 - Math.abs(distance) / 4.5),
    }}>{((number % maximum) + maximum) % maximum}</span>;
  })}</div>;
}

export function FloatingTimeCard({ frame }: { frame: ContentDemoFrame }) {
  const quick = frame.modal === "quick";
  const section = quick ? "quick" : "add";
  const index = (quick ? 2 : 1) + frame.selection * (quick ? 1 : 2);
  const selected = Math.round(index);
  const hours = quick ? 5 + frame.wheel : 0;
  const minutes = quick ? 10 + frame.wheel * 10 : 5 + frame.wheel * 10;
  const title = text(section, quick ? "I3736:81799;1:636;1:632" : "I3736:81730;1:636;1:632");
  return <div className={styles.modal} data-figma-node={copy[section].sourceNode}>
    <div className={styles.header} style={tapStyle(frame, "header")}><strong>{title}</strong><span className={styles.close}>×</span></div>
    <div className={styles.modeSection}>
      <div className={styles.carousel}>
        <div className={styles.modeTrack} style={{ transform: `translateX(${135.5 - index * 80}px)` }}>
          {modes.map((mode, i) => <div key={mode.name} className={styles.mode} data-selected={i === selected}
            style={{ "--mode-color": mode.color, "--mode-weight": Math.max(0, 1 - Math.abs(index - i)) } as CSSProperties}><Icon index={i} /><span>{mode.name}</span></div>)}
        </div>
        <svg className={styles.swipe} viewBox="0 0 351 95" aria-hidden="true" style={{ opacity: frame.swipeOpacity }}>
          <path d={`M ${255 - frame.selection * (quick ? 80 : 160) + 44 * Math.sin(frame.selection * Math.PI)} 65 H ${255 - frame.selection * (quick ? 80 : 160)}`} fill="none" stroke="#9279e8" strokeWidth="8" strokeLinecap="round" opacity=".3" />
          <circle cx={255 - frame.selection * (quick ? 80 : 160)} cy="65" r="7" fill="#9279e8" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    </div>
    <div className={styles.timeSection}>
      <div className={styles.presets}>
        {(quick ? ["на 15 мин", "на 30 мин", "на 1 час", "До завтра", "Указать свое"] :
          ["15 мин", "30 мин", "1 час", "До завтра", "Указать свое"]).map((label, i) =>
          <span key={label} data-selected={quick ? i === (frame.presetPress > 0 ? 1 : 0) : i === (frame.custom ? 4 : 0)} style={{ ...tapStyle(frame, i === (quick ? 1 : 4) ? (quick ? "preset" : "custom") : "other"), "--selection-weight": i === 0 ? 1 - frame.presetBlend : i === (quick ? 1 : 4) ? frame.presetBlend : 0 } as CSSProperties}><span>{label}</span></span>)}
      </div>
      {!quick && <div className={styles.picker} style={{ height: 180 * frame.picker, borderWidth: frame.picker }}>
        <div className={styles.wheels} style={{ height: 180 * frame.picker }}><div className={styles.selectedLine} /><Wheel value={hours} maximum={24} /><Wheel value={minutes} maximum={60} /></div>
        <svg className={styles.wheelSwipe} viewBox="0 0 327 180" aria-hidden="true" style={{ opacity: frame.wheelSwipeOpacity }}>
          <path d={`M 196 ${140 - frame.wheel * 100 + 40 * Math.sin(frame.wheel * Math.PI)} V ${140 - frame.wheel * 100}`} fill="none" stroke="#9279e8" strokeWidth="8" strokeLinecap="round" opacity=".3" />
          <circle cx="196" cy={140 - frame.wheel * 100} r="7" fill="#9279e8" stroke="white" strokeWidth="2" />
        </svg>
      </div>}
    </div>
    {<div className={styles.modalBottom}><div className={styles.action} style={tapStyle(frame, "submit")}>
      {quick ? text("quick", "I2799:49143;387:4040;1:636;1:632") : text("add", "I2759:31229;387:4040;1:636;1:632")}
    </div></div>}
  </div>;
}

export function ModeConfirmation({ frame }: { frame: ContentDemoFrame }) {
  return <div className={styles.modal} data-figma-node={copy.confirm.sourceNode}>
    <div className={styles.header} style={tapStyle(frame, "header")}><strong>Быстрый режим</strong><span className={styles.close}>×</span></div>
    <div className={styles.confirmModes} style={tapStyle(frame, "summary")}>
      <div><span>Текущий режим:<small>До 18:30 · Остался 1 час</small></span><strong style={{ color: modes[1].color }}><Icon index={1} />Учеба</strong></div>
      <span className={styles.changeArrow}>⌄</span>
      <div><span>Новый режим:<small>До 18:00 · На 30 мин</small></span><strong style={{ color: modes[3].color }}><Icon index={3} />Игры</strong></div>
    </div>
    <details className={styles.schedule} style={tapStyle(frame, "schedule")}><summary>Изменения в расписании</summary>
      {[[3, "17:30 – 18:00"], [1, "18:00 – 18:30"]].map(([mode, time]) => <div key={mode}>
        <span style={{ color: modes[Number(mode)].color }}><Icon index={Number(mode)} />{modes[Number(mode)].name}</span><span>{time}</span>
      </div>)}
    </details>
    <div className={styles.modalBottom}>
      <div className={styles.action} style={tapStyle(frame, "submit")}>Подтвердить</div>
    </div>
  </div>;
}

export function MinecraftCard({ frame }: { frame: ContentDemoFrame }) {
  return <div className={styles.appCard} data-figma-node={copy.app.sourceNode}>
    <div className={styles.appHeader}><span className={styles.back} style={tapStyle(frame, "back")} data-demo-target="back"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="m14 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span><strong style={tapStyle(frame, "header")}>{text("app", "I3736:81881;1:636;1:632")}</strong></div>
    <div className={styles.appSummary}>
      <div className={styles.appIdentity} style={tapStyle(frame, "identity")}><img src={siteUrl(asset("92ed7e45760bf2c1.svg"))} alt="" /><div>Minecraft<small>Игры</small></div></div>
      <div className={styles.stats} style={tapStyle(frame, "usage")}>
        <div className={styles.date}><span>Сегодня</span><span><DemoSkeleton width={72} /></span></div>
        <div className={styles.total}><strong>{frame.minutes} мин</strong><span>из 60 мин</span></div>
        <div className={styles.progress}><span style={{ width: `${(30 + frame.consumption * 5) / 60 * 100}%` }} /><span style={{ width: `${5 / 60 * 100}%` }} /></div>
        <div className={styles.categories}>
          <div style={{ color: modes[3].color }}><Icon index={3} /><div>Игры</div></div>
          <div style={{ color: modes[0].color }}><Icon index={0} /><div>Мой режим</div></div>
        </div>
      </div>
    </div>
    <div className={styles.permissions} style={tapStyle(frame, "permissions")}>
      <strong>Доступы и лимиты</strong>
      <div className={styles.permissionList}>{[1, 2, 4, 3, 5, 0].map(i => <div key={i}>
        <span style={{ color: modes[i].color }}><Icon index={i} /></span><div>{modes[i].name}</div>
        <span className={styles.toggle} data-on={i === 0 || i === 3} />
      </div>)}</div>

    </div>
  </div>;
}
