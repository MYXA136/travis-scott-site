<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travis Scott — Дискография</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container header-flex">
            <div class="logo">DISCOGRAPHY</div>
            <nav>
                <a href="index.php" class="active">Главная</a>
                <a href="about.html">Об авторе</a>
            </nav>
        </div>
    </header>

    <div class="cookie-bar">
        <div class="container cookie-flex">
            <span id="visit-info">Загрузка статистики визитов...</span>
            <button id="clear-cookie-btn" class="btn-sm">Сбросить историю</button>
        </div>
    </div>

    <main class="container shadow-box">
        <section class="hero author-profile">
            <div class="author-info">
                <h1>Travis Scott (Жак Берман Уэбстер II)</h1>
                <p class="subtitle">Американский рэпер, певец, автор песен и музыкальный продюсер.</p>
                <p>Трэвис Скотт известен своим культовым звучанием с обилием автотюна, атмосферными битами и невероятной энергетикой на живых выступлениях. Он перевернул представление о современном трэпе.</p>
            </div>
            
            <img src="travis.jpg" alt="Travis Scott" class="author-photo zoomable-img" style="border-radius: 8px; width: 220px; height: 220px; cursor: pointer;">
        </section>

        <section class="albums">
            <h2>Студийные альбомы</h2>
            <div class="album-grid" style="margin-bottom: 30px;">
                <div class="album-card">
                    <h3>Rodeo</h3>
                    <span class="year">2015</span>
                    <p>Дебютный студийный альбом, закрепивший за Трэвисом статус главного новатора индустрии.</p>
                </div>
                <div class="album-card">
                    <h3>Birds in the Trap Sing McKnight</h3>
                    <span class="year">2016</span>
                    <p>Пластинка, подарившая миру хит «Goosebumps» и возглавившая престижный чарт Billboard 200.</p>
                </div>
                <div class="album-card">
                    <h3>Astroworld</h3>
                    <span class="year">2018</span>
                    <p>Грандиозный трибьют закрытому парку развлечений в Хьюстоне. Номинация на Грэмми и статус платины.</p>
                </div>
                <div class="album-card">
                    <h3>Utopia</h3>
                    <span class="year">2023</span>
                    <p>Долгожданный масштабный концептуальный альбом с экспериментальным и мрачным звучанием.</p>
                </div>
            </div>

            <h2>Совместные альбомы и компиляции</h2>
            <div class="album-grid" style="margin-bottom: 30px;">
                <div class="album-card">
                    <h3>Huncho Jack, Jack Huncho</h3>
                    <span class="year">2017</span>
                    <p>Коллаборационный альбом со свирепым вайбом, записанный совместно с Quavo из группы Migos.</p>
                </div>
                <div class="album-card">
                    <h3>JACKBOYS</h3>
                    <span class="year">2019</span>
                    <p>Проект-компиляция от участников лейбла Cactus Jack Records с мощнейшим ремиксом на «Highest in the Room».</p>
                </div>
                <div class="album-card">
                    <h3>JACKBOYS 2</h3>
                    <span class="year">2025</span>
                    <p>Продолжение культового командного релиза со свежим клубным и трэп-звучанием от кактусовой банды.</p>
                </div>
            </div>

            <h2>Микстейпы</h2>
            <div class="album-grid">
                <div class="album-card">
                    <h3>Owl Pharaoh</h3>
                    <span class="year">2013</span>
                    <p>Самый первый официальный микстейп Трэвиса, заложивший основы его фирменного сырого стиля.</p>
                </div>
                <div class="album-card">
                    <h3>Days Before Rodeo</h3>
                    <span class="year">2014</span>
                    <p>Легендарный андеграунд-релиз, ставший прелюдией к Rodeo и ставший классикой жанра.</p>
                </div>
            </div>
        </section>

        <section class="comments-section" style="margin-top: 50px; border-top: 1px solid #333; padding-top: 30px;">
            <h2>Отзывы слушателей</h2>
            
            <form id="comment-form" style="background: #242424; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                <div style="margin-bottom: 15px;">
                    <label>Релиз: </label>
                    <select id="form-album" style="background: #121212; color: #fff; padding: 5px; border: 1px solid #ff4500;">
                        <option value="Rodeo">Rodeo</option>
                        <option value="Birds in the Trap">Birds in the Trap Sing McKnight</option>
                        <option value="Astroworld">Astroworld</option>
                        <option value="Utopia">Utopia</option>
                        <option value="Huncho Jack, Jack Huncho">Huncho Jack, Jack Huncho</option>
                        <option value="JACKBOYS">JACKBOYS</option>
                        <option value="JACKBOYS 2">JACKBOYS 2</option>
                        <option value="Owl Pharaoh">Owl Pharaoh</option>
                        <option value="Days Before Rodeo">Days Before Rodeo</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <input type="text" id="form-username" placeholder="Ваше имя" required style="width: 100%; max-width: 300px; background: #121212; color: #fff; padding: 8px; border: 1px solid #333; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <textarea id="form-text" placeholder="Ваш отзыв о релизе..." required style="width: 100%; height: 80px; background: #121212; color: #fff; padding: 8px; border: 1px solid #333; border-radius: 4px; resize: none;"></textarea>
                </div>
                <button type="submit" class="btn">Оставить отзыв</button>
            </form>

            <div style="margin-bottom: 20px;">
                <label>Фильтр по релизам: </label>
                <select id="filter-album" style="background: #242424; color: #fff; padding: 8px; border: 1px solid #333;">
                    <option value="All">Все релизы</option>
                    <option value="Rodeo">Rodeo</option>
                    <option value="Birds in the Trap">Birds in the Trap Sing McKnight</option>
                    <option value="Astroworld">Astroworld</option>
                    <option value="Utopia">Utopia</option>
                    <option value="Huncho Jack, Jack Huncho">Huncho Jack, Jack Huncho</option>
                    <option value="JACKBOYS">JACKBOYS</option>
                    <option value="JACKBOYS 2">JACKBOYS 2</option>
                    <option value="Owl Pharaoh">Owl Pharaoh</option>
                    <option value="Days Before Rodeo">Days Before Rodeo</option>
                </select>
            </div>

            <div id="comments-container"></div>
        </section>
    </main>

    <div id="image-modal" class="modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.9); padding-top: 60px;">
        <span class="modal-close" style="position: absolute; top: 15px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer;">&times;</span>
        <img class="modal-content" id="modal-img" style="margin: auto; display: block; max-width: 80%; max-height: 80%;">
    </div>

    <script src="script.js"></script>
</body>
</html