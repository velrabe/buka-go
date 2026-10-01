"use client";
import { createContext, useContext, type ReactNode } from "react";
import { sampleContentDemo } from "@/lib/content-demo-timeline";
export const ContentDemoContext = createContext(sampleContentDemo(0));
export function DemoValue({ field }: { field: string }) {
  const frame = useContext(ContentDemoContext);
  const values: Record<string, string> = {
    clock: frame.clock, total: `2ч ${frame.totalMinutes - 120}мин`,
    limit: frame.dailyLimit === 255 ? "из 4ч 15мин" : "из 4 часов",
    study: "85 мин", games: `${frame.categoryGames} мин`, minecraft: `${frame.minutes} мин за сегодня`,
    modeStart: frame.modeStart, modeEnd: frame.modeEnd,
  };
  return field === "limit" ? <span style={{ opacity: frame.limitOpacity }}>{values[field]}</span> : <>{values[field]}</>;
}
export function DemoActiveMode() {
  const frame = useContext(ContentDemoContext);
  return <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, lineHeight: "24px", color: frame.activated ? "#e7883f" : "#559be6", whiteSpace: "nowrap" }}>
    <span style={{ width: 16, height: 16, background: "currentColor", mask: `url(/assets/app-content/${frame.activated ? "game-solid.svg" : "6b4d5c7803e11793.svg"}) center / contain no-repeat` }} />{frame.mode}
  </span>;
}
export function DemoSummaryBar() {
  const frame = useContext(ContentDemoContext);
  return <div style={{ display: "flex", width: 319, height: 10, borderRadius: 99, overflow: "hidden", opacity: frame.limitOpacity, background: "#eeecf7" }}>
    {[ [85, "#3f98e7"], [15, "#e87979"], [frame.categoryGames, "#e7883f"] ].map(([value, color]) =>
      <span key={color} style={{ width: `${Number(value) / frame.dailyLimit * 100}%`, height: "100%", background: String(color), borderRight: "1px solid white" }} />)}
  </div>;
}

export function DemoModeButton({ mode, children }: { mode: string; children: ReactNode }) {
  const frame = useContext(ContentDemoContext);
  return <div data-mode-disabled={frame.mode === mode} aria-disabled={frame.mode === mode} style={{ display: "contents" }}>{children}</div>;
}
