<?php

declare(strict_types=1);

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDatabaseConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function sendJson(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

switch ($method) {
    case 'GET':
        $album = $_GET['album'] ?? 'All';

        if ($album !== 'All' && trim($album) !== '') {
            $stmt = $pdo->prepare(
                'SELECT id, album_name, username, comment_text, created_at
                 FROM comments
                 WHERE album_name = :album
                 ORDER BY created_at DESC'
            );
            $stmt->execute(['album' => $album]);
        } else {
            $stmt = $pdo->query(
                'SELECT id, album_name, username, comment_text, created_at
                 FROM comments
                 ORDER BY created_at DESC'
            );
        }

        sendJson($stmt->fetchAll());

    case 'POST':
        $data = getJsonBody();
        $album = trim((string)($data['album_name'] ?? ''));
        $username = trim((string)($data['username'] ?? ''));
        $comment = trim((string)($data['comment_text'] ?? ''));

        if ($album === '' || $username === '' || $comment === '') {
            sendJson(['error' => 'Все поля обязательны'], 400);
        }

        $stmt = $pdo->prepare(
            'INSERT INTO comments (album_name, username, comment_text)
             VALUES (:album, :username, :comment)
             RETURNING id, album_name, username, comment_text, created_at'
        );
        $stmt->execute([
            'album' => $album,
            'username' => $username,
            'comment' => $comment,
        ]);

        sendJson($stmt->fetch(), 201);

    case 'PUT':
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        $data = getJsonBody();
        $comment = trim((string)($data['comment_text'] ?? ''));

        if (!$id || $id <= 0 || $comment === '') {
            sendJson(['error' => 'Некорректные данные'], 400);
        }

        $stmt = $pdo->prepare(
            'UPDATE comments
             SET comment_text = :comment
             WHERE id = :id'
        );
        $stmt->execute([
            'comment' => $comment,
            'id' => $id,
        ]);

        if ($stmt->rowCount() === 0) {
            sendJson(['error' => 'Комментарий не найден'], 404);
        }

        sendJson(['message' => 'Комментарий изменён', 'changes' => $stmt->rowCount()]);

    case 'DELETE':
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

        if (!$id || $id <= 0) {
            sendJson(['error' => 'Некорректный ID'], 400);
        }

        $stmt = $pdo->prepare('DELETE FROM comments WHERE id = :id');
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            sendJson(['error' => 'Комментарий не найден'], 404);
        }

        sendJson(['message' => 'Комментарий удалён', 'changes' => $stmt->rowCount()]);

    default:
        header('Allow: GET, POST, PUT, DELETE');
        sendJson(['error' => 'Метод не поддерживается'], 405);
}
