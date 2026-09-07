const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const usePostgres = Boolean(process.env.DATABASE_URL);
let db;
let pool;

if (usePostgres) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost')
            ? false
            : { rejectUnauthorized: false }
    });

    const sqlInit = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');

    pool.query(sqlInit)
        .then(() => console.log('PostgreSQL: таблицы успешно проверены.'))
        .catch(err => console.error('Ошибка инициализации PostgreSQL:', err.message));
} else {
    db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
        if (err) console.error('Ошибка SQLite:', err.message);
        else console.log('Локальный режим: SQLite подключена.');
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_name TEXT NOT NULL,
            username TEXT NOT NULL,
            comment_text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Ошибка создания таблицы SQLite:', err.message);
    });
}

app.get('/api/comments', async (req, res) => {
    const album = req.query.album;

    try {
        if (usePostgres) {
            let query = 'SELECT * FROM comments';
            const params = [];

            if (album && album !== 'All') {
                query += ' WHERE album_name = $1';
                params.push(album);
            }

            query += ' ORDER BY created_at DESC';
            const result = await pool.query(query, params);
            return res.json(result.rows);
        }

        let query = 'SELECT * FROM comments';
        const params = [];

        if (album && album !== 'All') {
            query += ' WHERE album_name = ?';
            params.push(album);
        }

        query += ' ORDER BY created_at DESC';

        db.all(query, params, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/comments', async (req, res) => {
    const { album_name, username, comment_text } = req.body;

    if (!album_name || !username || !comment_text ||
        !album_name.trim() || !username.trim() || !comment_text.trim()) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        if (usePostgres) {
            const result = await pool.query(
                `INSERT INTO comments (album_name, username, comment_text)
                 VALUES ($1, $2, $3)
                 RETURNING id, album_name, username, comment_text, created_at`,
                [album_name.trim(), username.trim(), comment_text.trim()]
            );
            return res.status(201).json(result.rows[0]);
        }

        const query = `
            INSERT INTO comments (album_name, username, comment_text)
            VALUES (?, ?, ?)
        `;

        db.run(
            query,
            [album_name.trim(), username.trim(), comment_text.trim()],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({
                    id: this.lastID,
                    album_name: album_name.trim(),
                    username: username.trim(),
                    comment_text: comment_text.trim()
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/comments/:id', async (req, res) => {
    const { comment_text } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0 || !comment_text || !comment_text.trim()) {
        return res.status(400).json({ error: 'Некорректные данные' });
    }

    try {
        if (usePostgres) {
            const result = await pool.query(
                'UPDATE comments SET comment_text = $1 WHERE id = $2',
                [comment_text.trim(), id]
            );
            return res.json({
                message: 'Изменено',
                changes: result.rowCount
            });
        }

        db.run(
            'UPDATE comments SET comment_text = ? WHERE id = ?',
            [comment_text.trim(), id],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Изменено', changes: this.changes });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/comments/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Некорректный ID' });
    }

    try {
        if (usePostgres) {
            const result = await pool.query(
                'DELETE FROM comments WHERE id = $1',
                [id]
            );
            return res.json({
                message: 'Удалено',
                changes: result.rowCount
            });
        }

        db.run(
            'DELETE FROM comments WHERE id = ?',
            [id],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Удалено', changes: this.changes });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
