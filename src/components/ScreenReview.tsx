import { StaticContentScreen } from "./ContentScreen";
import { FloatingTimeCard, ModeConfirmation, MinecraftCard } from "./ContentDemoScenes";
import { sampleContentDemo } from "@/lib/content-demo-timeline";
import styles from "@/styles/screen-review.module.scss";

export function ScreenReview() {
  const add = { ...sampleContentDemo(3.1), selection: 1, wheel: 1, confirmPress: 0 };
  const quick = { ...sampleContentDemo(6.15), selection: 1, presetPress: 1 };
  const confirm = { ...sampleContentDemo(7), confirmPress: 0 };
  const screens = [
    { name: "01 · Контент — полный экран", view: <StaticContentScreen /> },
    { name: "02 · Добавить время", view: <FloatingTimeCard frame={add} /> },
    { name: "03 · Быстрый режим — выбор", view: <FloatingTimeCard frame={quick} /> },
    { name: "04 · Быстрый режим — подтверждение", view: <ModeConfirmation frame={confirm} /> },
    { name: "05 · Minecraft — до расхода", view: <MinecraftCard frame={sampleContentDemo(9.4)} /> },
    { name: "06 · Minecraft — после +5 минут", view: <MinecraftCard frame={sampleContentDemo(12.1)} /> },
  ];
  return <main id="main-content" className={styles.page}>
    <header><a href="/">← На сайт</a><h1>Экраны для сверки</h1><p>Все экраны целиком, без анимации. Прокрутите ряд вправо; номера помогут указать, где нужны правки.</p></header>
    <div className={styles.row} tabIndex={0} role="region" aria-label="Экраны приложения, горизонтальная прокрутка">
      {screens.map(({name, view}) => <section key={name} className={styles.screen}><h2>{name}</h2><div className={styles.canvas}>{view}</div></section>)}
    </div>
  </main>;
}
