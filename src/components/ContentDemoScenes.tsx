"use client";

import { DemoSkeleton } from "./DemoSkeleton";
import type { CSSProperties } from "react";
import copy from "@/content/app-demo.json";
import type { ContentDemoFrame } from "@/lib/content-demo-timeline";
import styles from "@/styles/content-demo-scenes.module.scss";

const asset = (name: string) => `/assets/app-content/${name}`;
const modes = [
  { name: "Мой режим", icon: "433123a6c53ccade.svg", color: "#9279e8" },
  { name: "Учеба", icon: "6b4d5c7803e11793.svg", color: "#559be6" },
  { name: "Уроки", icon: "a357b3331b8b7c1f.svg", color: "#f37178" },
  { name: "Игры", icon: "game-solid.svg", color: "#e7883f" },
  { name: "Отдых", icon: "98165725ea0b8728.svg", color: "#69c46d" },
  { name: "Сон", icon: "07a95523a0ec277d.svg", color: "#9279e8" },
];
function focusStyle(frame: ContentDemoFrame, target: string): CSSProperties {
  const active = frame.focus === target;
  return { opacity: !frame.focus || active ? 1 : 1 - .7 * frame.focusAmount,
    ...(active && frame.tap > .001 ? { boxShadow: `0 0 0 ${frame.tap * 5}px #9279e850`, transform: `scale(${1 - frame.tap * .04})`, borderRadius: 12 } : {}) };
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
    <div className={styles.header} style={focusStyle(frame, "header")}><strong>{title}</strong><span className={styles.close}>×</span></div>
    <div className={styles.modeSection}>
      <div className={styles.carousel}>
        <div className={styles.modeTrack} style={{ transform: `translateX(${135.5 - index * 80}px)` }}>
          {modes.map((mode, i) => <div key={mode.name} className={styles.mode} data-selected={i === selected}
            style={{ ...focusStyle(frame, i === 3 ? "mode" : "other"), "--mode-color": mode.color } as CSSProperties}><Icon index={i} /><span>{mode.name}</span></div>)}
        </div>
      </div>
    </div>
    <div className={styles.timeSection}>
      <div className={styles.presets}>
        {(quick ? ["на 15 мин", "на 30 мин", "на 1 час", "До завтра", "Указать свое"] :
          ["15 мин", "30 мин", "1 час", "До завтра", "Указать свое"]).map((label, i) =>
          <span key={label} data-selected={quick ? i === (frame.presetPress > 0 ? 1 : 0) : i === (frame.custom ? 4 : 0)} style={focusStyle(frame, i === (quick ? 1 : 4) ? (quick ? "preset" : "custom") : "other")}>{label}</span>)}
      </div>
      {!quick && <div className={styles.picker} style={{ ...focusStyle(frame, "wheel"), height: 180 * frame.picker, opacity: frame.picker * (frame.focus === "wheel" || !frame.focus ? 1 : 1 - .7 * frame.focusAmount), borderWidth: frame.picker > 0 ? 1 : 0 }}>
        <div className={styles.wheels}><div className={styles.selectedLine} /><Wheel value={hours} maximum={24} /><Wheel value={minutes} maximum={60} /></div>
      </div>}
    </div>
    {<div className={styles.modalBottom}><div className={styles.action} style={focusStyle(frame, "submit")}>
      {quick ? text("quick", "I2799:49143;387:4040;1:636;1:632") : text("add", "I2759:31229;387:4040;1:636;1:632")}
    </div></div>}
  </div>;
}

export function ModeConfirmation({ frame }: { frame: ContentDemoFrame }) {
  return <div className={styles.modal} data-figma-node={copy.confirm.sourceNode}>
    <div className={styles.header} style={focusStyle(frame, "header")}><strong>Быстрый режим</strong><span className={styles.close}>×</span></div>
    <div className={styles.confirmModes} style={focusStyle(frame, "summary")}>
      <div><span>Текущий режим:<small>До 18:30 · Остался 1 час</small></span><strong style={{ color: modes[1].color }}><Icon index={1} />Учеба</strong></div>
      <span className={styles.changeArrow}>⌄</span>
      <div><span>Новый режим:<small>До 18:00 · На 30 мин</small></span><strong style={{ color: modes[3].color }}><Icon index={3} />Игры</strong></div>
    </div>
    <details className={styles.schedule} style={focusStyle(frame, "schedule")}><summary>Изменения в расписании</summary>
      {[[3, "17:30 – 18:00"], [1, "18:00 – 18:30"]].map(([mode, time]) => <div key={mode}>
        <span style={{ color: modes[Number(mode)].color }}><Icon index={Number(mode)} />{modes[Number(mode)].name}</span><span>{time}</span>
      </div>)}
    </details>
    <div className={styles.modalBottom}>
      <div className={styles.action} style={focusStyle(frame, "submit")}>Подтвердить</div>
    </div>
  </div>;
}

export function MinecraftCard({ frame }: { frame: ContentDemoFrame }) {
  return <div className={styles.appCard} data-figma-node={copy.app.sourceNode}>
    <div className={styles.appHeader}><span className={styles.back} style={focusStyle(frame, "back")} data-demo-target="back"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="m14 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span><strong style={focusStyle(frame, "header")}>{text("app", "I3736:81881;1:636;1:632")}</strong></div>
    <div className={styles.appSummary}>
      <div className={styles.appIdentity} style={focusStyle(frame, "identity")}><img src={asset("92ed7e45760bf2c1.svg")} alt="" /><div>Minecraft<small>Игры</small></div></div>
      <div className={styles.stats} style={focusStyle(frame, "usage")}>
        <div className={styles.date}><span>Сегодня</span><span><DemoSkeleton width={72} /></span></div>
        <div className={styles.total}><strong>{frame.minutes} мин</strong><span>из 60 мин</span></div>
        <div className={styles.progress}><span style={{ width: `${(30 + frame.consumption * 5) / 60 * 100}%` }} /><span style={{ width: `${5 / 60 * 100}%` }} /></div>
        <div className={styles.categories}>
          <div style={{ color: modes[3].color }}><Icon index={3} /><div>Игры</div></div>
          <div style={{ color: modes[0].color }}><Icon index={0} /><div>Мой режим</div></div>
        </div>
      </div>
    </div>
    <div className={styles.permissions} style={focusStyle(frame, "permissions")}>
      <strong>Доступы и лимиты</strong>
      <div className={styles.permissionList}>{[1, 2, 4, 3, 5, 0].map(i => <div key={i}>
        <span style={{ color: modes[i].color }}><Icon index={i} /></span><div>{modes[i].name}</div>
        <span className={styles.toggle} data-on={i === 0 || i === 3} />
      </div>)}</div>

    </div>
  </div>;
}
