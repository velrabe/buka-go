import type { Locale } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import task from "@/content/parent-task-preview.json";
import styles from "@/styles/picture-task-preview.module.scss";
import { TaskMiniScreen } from "./TaskMiniScreen";

const labels: Record<Locale, { instruction: string; title: string; photo: string; done: string }> = {
  ru: { instruction: "Выполни задание", title: task.title, photo: task.photoLabel, done: task.submitLabel },
  en: { instruction: "Complete the task", title: "Pack your school bag and send a photo", photo: "Take a photo", done: "Done" },
  kk: { instruction: "Тапсырманы орында", title: "Сөмкеңді жинап, фото жібер", photo: "Фото түсіру", done: "Дайын" },
  uz: { instruction: "Topshiriqni bajar", title: "Ryukzagingni yigʻ va surat yubor", photo: "Suratga olish", done: "Tayyor" },
  az: { instruction: "Tapşırığı yerinə yetir", title: "Çantanı hazırla və şəkil göndər", photo: "Şəkil çək", done: "Hazır" },
};

export function ParentTaskPreview({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return <TaskMiniScreen current={2} reward={1} diamond instruction={t.instruction} characterAsset="/assets/task-preview/character-header-2.png" sourceId={task.source.rootId}
    action={<button type="button" className={styles.check} data-figma-node={task.buttonId} disabled>{t.done}</button>}>
    <div className={styles.parentContent}>
    <div className={styles.photo} data-figma-node={task.photo.id}>
      <img src={siteUrl(task.photo.iconAsset)} data-figma-node={task.photo.iconId} width="80" height="80" alt="" />
      <span>{t.photo}</span>
    </div>
    <p className={styles.description}>{t.title}</p>
    </div>
  </TaskMiniScreen>;
}
