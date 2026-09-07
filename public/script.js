// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ COOKIES ---
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, days = 7) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
}

// --- БЛОК 1: СТАТИСТИКА ВИЗИТОВ ---
function updateVisitStats() {
    const infoSpan = document.getElementById('visit-info');
    if (!infoSpan) return; // Если элемента нет на странице, выходим без ошибки

    try {
        const lastVisit = getCookie('lastVisit');
        let pageViews = parseInt(getCookie('pageViews') || '0');

        pageViews++;
        setCookie('pageViews', pageViews);

        let infoText = `Вы посмотрели страниц: ${pageViews}. `;
        if (lastVisit) {
            infoText += `Ваш прошлый визит: ${lastVisit}`;
        } else {
            infoText += "Это ваш первый визит за последнее время!";
        }
        infoSpan.textContent = infoText;

        const now = new Date().toLocaleString('ru-RU');
        setCookie('lastVisit', now);
    } catch (e) {
        console.error("Ошибка в блоке кук:", e);
    }
}

// Навешиваем событие на кнопку сброса кук
const clearBtn = document.getElementById('clear-cookie-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        deleteCookie('lastVisit');
        deleteCookie('pageViews');
        alert('История посещений очищена. Страница будет перезагружена.');
        location.reload();
    });
}

// --- БЛОК 2: МОДАЛЬНОЕ ОКНО ДЛЯ КАРТИНОК ---
function initModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');
    const zoomImages = document.querySelectorAll('.zoomable-img');

    if (!modal || !modalImg || !closeBtn || zoomImages.length === 0) return;

    zoomImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// --- БЛОК 3: РАБОТА С СЕРВЕРОМ И БД (ОТЗЫВЫ) ---
async function loadComments() {
    const commentsContainer = document.getElementById('comments-container');
    const filterAlbum = document.getElementById('filter-album');
    
    if (!commentsContainer) return; // Нет контейнера (например, на about.html) — ничего не делаем

    try {
        const albumFilter = filterAlbum ? filterAlbum.value : 'All';
        const response = await fetch(`/api/comments?album=${albumFilter}`);
        
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        
        const comments = await response.json();
        commentsContainer.innerHTML = '';
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p style="color: #777;">Отзывов пока нет.</p>';
            return;
        }

        comments.forEach(c => {
            const card = document.createElement('div');
            card.style = "background: #242424; padding: 15px; border-left: 4px solid #ff4500; margin-bottom: 15px; border-radius: 0 4px 4px 0;";
            const header = document.createElement('div');
            header.style = "display: flex; justify-content: space-between; font-size: 0.85rem; color: #ff4500; margin-bottom: 5px;";

            const author = document.createElement('strong');
            author.textContent = c.username;

            const albumLabel = document.createElement('span');
            albumLabel.style.color = '#aaa';
            albumLabel.textContent = ` об альбоме ${c.album_name}`;

            author.appendChild(albumLabel);

            const date = document.createElement('span');
            date.textContent = new Date(c.created_at).toLocaleString('ru-RU');

            header.append(author, date);

            const paragraph = document.createElement('p');
            paragraph.id = `text-${c.id}`;
            paragraph.style = "margin-bottom: 10px; color: #fff;";
            paragraph.textContent = c.comment_text;

            const buttons = document.createElement('div');
            buttons.style = "display: flex; gap: 10px;";

            const editButton = document.createElement('button');
            editButton.className = 'btn-sm';
            editButton.textContent = 'Редактировать';
            editButton.addEventListener('click', () => editComment(c.id));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-sm';
            deleteButton.style = "border-color: #777; color: #777;";
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => deleteComment(c.id));

            buttons.append(editButton, deleteButton);
            card.append(header, paragraph, buttons);
            commentsContainer.appendChild(card);
        });
    } catch (e) {
        console.error("Не удалось загрузить комментарии:", e);
        commentsContainer.innerHTML = '<p style="color: #ff4500;">Ошибка загрузки отзывов. Сервер отвечает некорректно.</p>';
    }
}

// Инициализация формы отправки
const commentForm = document.getElementById('comment-form');
if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const album_name = document.getElementById('form-album').value;
            const username = document.getElementById('form-username').value;
            const comment_text = document.getElementById('form-text').value;

            await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ album_name, username, comment_text })
            });

            document.getElementById('form-username').value = '';
            document.getElementById('form-text').value = '';
            loadComments();
        } catch (e) {
            console.error("Ошибка при отправке комментария:", e);
        }
    });
}

// Функции редактирования и удаления (глобальные, чтобы вызывались из onclick)
async function editComment(id) {
    const p = document.getElementById(`text-${id}`);
    if (!p) return;
    const oldText = p.textContent;
    const newText = prompt("Отредактируйте ваш отзыв:", oldText);
    
    if (newText && newText.trim() !== "" && newText !== oldText) {
        await fetch(`/api/comments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment_text: newText })
        });
        loadComments();
    }
}

async function deleteComment(id) {
    if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
        await fetch(`/api/comments/${id}`, { method: 'DELETE' });
        loadComments();
    }
}

// Привязка фильтра
const filterAlbum = document.getElementById('filter-album');
if (filterAlbum) {
    filterAlbum.addEventListener('change', loadComments);
}

// БЕЗОПАСНЫЙ ЗАПУСК ВСЕХ БЛОКОВ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', () => {
    updateVisitStats();
    initModal();
    loadComments();
});Ы