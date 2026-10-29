# Доска+ — доска объявлений

Учебный проект на **React + TypeScript**. Сборка выполняется Vite (esbuild), Babel не используется.

## Запуск

```bash
npm install
npm run dev
```

Проверка production-сборки:

```bash
npm run build
npm run preview
```

## Подключение API

Создайте `.env.local` и задайте `VITE_API_URL`. Клиент использует:

- `GET /announcements`
- `POST /announcements`
- `DELETE /announcements/:id`

Без этой переменной приложение полностью работает в демонстрационном режиме: объявления хранятся в браузерном `localStorage`. Это даёт возможность проверить опубликованный сайт на GitHub Pages.

## GitHub Pages

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) запускается при каждом push в `main`, собирает проект и публикует артефакт через официальный Pages deployment — ветка `gh-pages` не используется.

Перед первым деплоем в репозитории GitHub откройте **Settings → Pages → Build and deployment → Source** и выберите **GitHub Actions**. Если есть бэкенд, добавьте в **Settings → Secrets and variables → Actions → Variables** переменную `VITE_API_URL`.
