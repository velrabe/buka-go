"use client";

import type { CSSProperties } from "react";
import copy from "@/content/app-demo.json";
import type { ContentDemoFrame } from "@/lib/content-demo-timeline";
import styles from "@/styles/content-demo-scenes.module.scss";

const asset = (name: string) => `/assets/app-content/${name}`;
const modes = [
  { name: "Мой режим", icon: "433123a6c53ccade.svg", color: "#9279e8" },
  { name: "Учеба", icon: "6b4d5c7803e11793.svg", color: "#559be6" },
  { name: "Уроки", icon: "a357b3331b8b7c1f.svg", color: "#f37178" },
  { name: "Игры", icon: "91eeac1c863bf070.svg", color: "#e7883f" },
  { name: "Отдых", icon: "98165725ea0b8728.svg", color: "#69c46d" },
  { name: "Сон", icon: "07a95523a0ec277d.svg", color: "#9279e8" },
];
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
  const index = (quick ? 2 : 1) + frame.selection * 2;
  const selected = Math.round(index);
  const hours = quick ? 5 + frame.wheel : 0;
  const minutes = quick ? 10 + frame.wheel * 10 : 5 + frame.wheel * 10;
  const title = text(section, quick ? "I3736:81799;1:636;1:632" : "I3736:81730;1:636;1:632");
  return <div className={styles.modal} data-figma-node={copy[section].sourceNode}>
    <div className={styles.header}><strong>{title}</strong><span className={styles.close}>×</span></div>
    <div className={styles.modeSection}>
      <div className={styles.prompt}>Выберите режим:</div>
      <div className={styles.carousel}>
        <div className={styles.modeTrack} style={{ transform: `translateX(${135.5 - index * 80}px)` }}>
          {modes.map((mode, i) => <div key={mode.name} className={styles.mode} data-selected={i === selected}
            style={{ "--mode-color": mode.color } as CSSProperties}><Icon index={i} /><span>{mode.name}</span></div>)}
        </div>
      </div>
    </div>
    <div className={styles.timeSection}>
      <div className={styles.prompt}>{quick ? "На сколько активировать режим?" : "Сколько времени добавить?"}</div>
      <div className={styles.presets}>
        {(quick ? ["на 15 мин", "на 30 мин", "на 1 час", "До завтра", "Указать свое"] :
          ["15 мин", "30 мин", "1 час", "До завтра", "Указать свое"]).map((label, i) =>
          <span key={label} data-selected={i === 4}>{label}</span>)}
      </div>
      <div className={styles.picker}>
        <div className={styles.pickerHeading}><span>Укажите время</span><strong>{Math.round(hours)}ч {Math.round(minutes)}мин</strong><span className={styles.check}>✓</span></div>
        <div className={styles.wheels}><div className={styles.selectedLine} /><Wheel value={hours} maximum={24} /><Wheel value={minutes} maximum={60} /></div>
      </div>
    </div>
    <div className={styles.modalBottom}><div className={styles.action} style={{ transform: `scale(${1 - Math.sin(frame.confirmPress * Math.PI) * 0.035})`, opacity: 0.65 + frame.wheel * 0.35 }}>
      {quick ? text("quick", "I2799:49143;387:4040;1:636;1:632") : text("add", "I2759:31229;387:4040;1:636;1:632")}
    </div></div>
  </div>;
}

export function ModeConfirmation({ frame }: { frame: ContentDemoFrame }) {
  return <div className={styles.modal} data-figma-node={copy.confirm.sourceNode}>
    <div className={styles.header}><strong>Быстрый режим</strong><span className={styles.close}>×</span></div>
    <div className={styles.confirmModes}>
      <div><span>Текущий режим:</span><strong style={{ color: modes[3].color }}><Icon index={3} />Игры</strong><small>До 18:00 · Осталось 20 мин</small></div>
      <span className={styles.changeArrow}>↓</span>
      <div><span>Новый режим:</span><strong style={{ color: modes[4].color }}><Icon index={4} />Отдых</strong><small>До 23:00 · На 6ч 20мин</small></div>
    </div>
    <div className={styles.schedule}>
      <strong>Изменения в расписании</strong>
      {[[3, "19:00 – 20:00"], [4, "20:00 – 23:00"], [5, "23:00 – 7:00"]].map(([mode, time]) => <div key={mode}>
        <span style={{ color: modes[Number(mode)].color }}><Icon index={Number(mode)} />{modes[Number(mode)].name}</span><span>{time}</span>
      </div>)}
      <p>Подтвердите обновления в расписании. Изменения вступят в силу немедленно</p>
    </div>
    <div className={styles.modalBottom}>
      <div className={styles.action} style={{ transform: `scale(${1 - Math.sin(frame.confirmPress * Math.PI) * 0.035})` }}>Подтвердить</div>
      <div className={styles.secondary}>Изменить</div>
    </div>
  </div>;
}

export function MinecraftCard({ frame }: { frame: ContentDemoFrame }) {
  return <div className={styles.appCard} data-figma-node={copy.app.sourceNode}>
    <div className={styles.appHeader}><span className={styles.back} data-demo-target="back">‹</span><strong>{text("app", "I3736:81881;1:636;1:632")}</strong><span>⋮</span></div>
    <div className={styles.children}><span><img src={asset("49eff8393f5baae9.svg")} alt="" />Миша</span><span><i>Л</i>Лёша</span></div>
    <div className={styles.appSummary}>
      <div className={styles.appIdentity}><img src={asset("92ed7e45760bf2c1.svg")} alt="" /><div>Minecraft<small>Игры</small></div><span>⋮</span></div>
      <div className={styles.stats}>
        <div className={styles.date}><span>СЕГОДНЯ, 9 ИЮЛЯ</span><span>Аналитика ›</span></div>
        <div className={styles.total}><strong>{frame.minutes}мин</strong><span>из 60мин</span></div>
        <div className={styles.progress}><span style={{ width: `${(30 + frame.consumption * 5) / 60 * 100}%` }} /><span style={{ width: `${5 / 60 * 100}%` }} /></div>
        <div className={styles.categories}>
          <div style={{ color: modes[3].color }}><Icon index={3} /><div>Игры<small>{frame.gamesMinutes} мин</small></div></div>
          <div style={{ color: modes[0].color }}><Icon index={0} /><div>Мой режим<small>5 мин</small></div></div>
        </div>
      </div>
    </div>
    <div className={styles.permissions}>
      <strong>Доступы и лимиты</strong>
      <p>{text("app", "I2757:32650;1:636;1:632")}</p>
      <div className={styles.permissionList}>{[1, 2, 4, 3, 5, 0].map(i => <div key={i}>
        <span style={{ color: modes[i].color }}><Icon index={i} /></span><div>{modes[i].name}{(i === 3 || i === 0) && <small>{i === 3 ? "30" : "10"} мин <em>Изменить</em></small>}</div>
        <span className={styles.toggle} data-on={i === 0 || i === 3} />
      </div>)}</div>
      <strong>Дневной лимит</strong><p>{text("app", "I2758:24995;1:636;1:632")}</p>
      <div className={styles.secondary}>＋ Добавить дневной лимит</div>
      <div className={styles.settingsRow}>Расписание <span>›</span></div><div className={styles.settingsRow}>Режимы <span>›</span></div>
    </div>
  </div>;
}
