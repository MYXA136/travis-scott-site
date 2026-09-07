CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    album_name TEXT NOT NULL,
    username TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
