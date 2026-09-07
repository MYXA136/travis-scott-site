# Travis Scott — PHP + PostgreSQL

Учебный сайт с серверной частью на чистом PHP и базой данных PostgreSQL.

## Структура

- `public/index.php` — главная страница сайта.
- `public/about.html` — страница об авторе.
- `public/script.js` — клиентская логика и запросы к API.
- `api/comments.php` — API для работы с комментариями.
- `db.php` — подключение к PostgreSQL и автоматическое создание таблицы.
- `database.sql` — SQL-скрипт создания таблицы `comments`.

## API

- `GET /api/comments.php` — получение комментариев (`SELECT`).
- `POST /api/comments.php` — добавление комментария (`INSERT`).
- `PUT /api/comments.php?id=1` — изменение комментария (`UPDATE`).
- `DELETE /api/comments.php?id=1` — удаление комментария (`DELETE`).

Для подключения используется переменная окружения `DATABASE_URL` либо стандартные переменные PostgreSQL `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`.
