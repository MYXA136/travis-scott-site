const express = require('express');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL не задана. Подключите PostgreSQL в настройках проекта.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
        ? { rejectUnauthorized: false }
        : false
});

async function initDatabase() {
    if (!process.env.DATABASE_URL) return;
    const sqlInit = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    await pool.query(sqlInit);
    console.log('PostgreSQL: таблицы успешно проверены.');
}

app.get('/api/comments', async (req, res) => {
    const album = req.query.album;

    try {
        let query = 'SELECT * FROM comments';
        const params = [];

        if (album && album !== 'All') {
            query += ' WHERE album_name = $1';
            params.push(album);
        }

        query += ' ORDER BY created_at DESC';
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка получения комментариев' });
    }
});

app.post('/api/comments', async (req, res) => {
    const { album_name, username, comment_text } = req.body;

    if (!album_name || !username || !comment_text ||
        !album_name.trim() || !username.trim() || !comment_text.trim()) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO comments (album_name, username, comment_text)
             VALUES ($1, $2, $3)
             RETURNING id, album_name, username, comment_text, created_at`,
            [album_name.trim(), username.trim(), comment_text.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка добавления комментария' });
    }
});

app.put('/api/comments/:id', async (req, res) => {
    const { comment_text } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0 || !comment_text || !comment_text.trim()) {
        return res.status(400).json({ error: 'Некорректные данные' });
    }

    try {
        const result = await pool.query(
            'UPDATE comments SET comment_text = $1 WHERE id = $2',
            [comment_text.trim(), id]
        );
        res.json({ message: 'Изменено', changes: result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка обновления комментария' });
    }
});

app.delete('/api/comments/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Некорректный ID' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM comments WHERE id = $1',
            [id]
        );
        res.json({ message: 'Удалено', changes: result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка удаления комментария' });
    }
});

async function start() {
    try {
        await initDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } catch (err) {
        console.error('Ошибка запуска:', err);
        process.exit(1);
    }
}

start();
