const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000

// Установка EJS как шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Маршрут для получения новостей
app.get('/:count/news/for/:category', async (req, res) => {
    const count = parseInt(req.params.count);
    const category = req.params.category;
    
    // Проверка валидности параметров
    if (isNaN(count) || count <= 0 || !['business', 'economic', 'finances', 'politics'].includes(category)) {
        return res.status(400).send('Не верные параметры');
    }

    // URL для запроса rss2json
    const rssUrl = `https://www.vedomosti.ru/rss/rubric/${category}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        // Отправка запроса к rss2json
        const response = await axios.get(apiUrl);
        
        // Получение данных новостей
        const newsItems = response.data.items.slice(0, count);
        
        // Отправка ответа пользователю с использованием EJS-шаблона
        res.render('news', { category: category.charAt(0).toUpperCase() + category.slice(1), newsItems });
    } catch (error) {
        console.error('Ошибка в получении новостей:', error);
        res.status(500).send('Ошибка в получении новостей');
    }
});

app.get('/', (req, res) => {
    res.render('index');
  })

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});