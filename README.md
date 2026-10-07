# BukaGo

Next.js 16 · React 19 · TypeScript · SCSS. Node.js 22.

## Запуск и сборка

```sh
npm ci
npm run dev
```

Локально: http://localhost:3000.

```sh
npm run build
npm run check
npm run preview
```

Результат — `out/`. Предпросмотр сборки: http://localhost:4173.
Для деплоя загрузите содержимое `out/` на статический хостинг. Сервер Next.js не требуется.
Сохраняйте вложенные папки маршрутов; неизвестные адреса должны отдавать `404.html`.

Для размещения в подпапке задайте путь при сборке и проверке:

```sh
NEXT_PUBLIC_BASE_PATH=/project npm run build
NEXT_PUBLIC_BASE_PATH=/project npm run check
```

Без этой переменной сайт собирается для корня домена.
GitHub Pages настроен в `.github/workflows/pages.yml`: при переносе в другой репозиторий
замените значение `NEXT_PUBLIC_BASE_PATH`, включите GitHub Actions в настройках Pages.

## Где менять материалы

| Файл или папка | Содержимое |
| --- | --- |
| `src/components/Landing.tsx` | Разделы главной страницы |
| `src/components/Header.tsx`, `Footer.tsx` | Меню, футер и ссылки на документы |
| `src/lib/settings.ts` | Ссылки магазинов, Telegram, настройки аналитики и рассылки |
| `src/lib/content.ts` | Языки и маршруты блога и документов |
| `src/content/locales/` | Тексты пяти языковых версий |
| `src/content/landing-additions.json` | Тарифы, отзывы, партнёры и FAQ |
| `src/content/pages.json` | Статьи и документы, на которые ведут ссылки сайта |
| `src/content/*screen.json`, `*preview.json`, `app-demo.json` | Данные демонстрационных экранов |
| `public/assets/` | Изображения, видео, иконки и локальные шрифты |
| `src/styles/` | Общие стили, токены и SCSS Modules |

Новые ассеты кладите в `public/assets/`, в коде указывайте `/assets/…` через `siteUrl()`
из `src/lib/site-url.ts`. Для замены картинки можно сохранить существующее имя файла.
Кнопки партнёров пока без ссылок: заполните их в `src/components/LandingAdditions.tsx`.

Аналитика и обработчик рассылки настраиваются переменными из `.env.example`.
Рассылка ожидает JSON `{ email, consent: true }` и ответ `{ success: true, message?: string }`.
Демо приложения работают локально, без его API. Метаданные сейчас содержат `noindex`;
перед публичным запуском настройте индексацию и canonical в `src/app/[[...slug]]/page.tsx`.
