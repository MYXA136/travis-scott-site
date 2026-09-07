<?php

declare(strict_types=1);

function getDatabaseConnection(): PDO
{
    $url = getenv('DATABASE_URL');

    try {
        if ($url) {
            $parts = parse_url($url);
            if ($parts === false) {
                throw new RuntimeException('Некорректный DATABASE_URL');
            }

            $host = $parts['host'] ?? 'localhost';
            $port = $parts['port'] ?? 5432;
            $db   = isset($parts['path']) ? ltrim($parts['path'], '/') : '';
            $user = $parts['user'] ?? '';
            $pass = $parts['pass'] ?? '';

            $dsn = "pgsql:host={$host};port={$port};dbname={$db}";
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } else {
            $host = getenv('PGHOST') ?: 'localhost';
            $port = getenv('PGPORT') ?: '5432';
            $db   = getenv('PGDATABASE') ?: 'postgres';
            $user = getenv('PGUSER') ?: 'postgres';
            $pass = getenv('PGPASSWORD') ?: '';

            $dsn = "pgsql:host={$host};port={$port};dbname={$db}";
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }

        // Автоматически создаём таблицу, если её ещё нет.
        $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    album_name TEXT NOT NULL,
    username TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
SQL);

        return $pdo;
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Ошибка подключения к базе данных'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
