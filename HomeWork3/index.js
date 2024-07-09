// Урок 3. Модули и фреймворк Express (WIP)

// Напишите HTTP сервер на express и реализуйте два обработчика “/” и “/about”, где:

// — На каждой странице реализован счетчик просмотров
// — Значение счетчика необходимо сохранять в файл каждый раз, когда обновляется страница
// — Также значение счетчика должно загружаться из файла, когда запускается обработчик страницы
// — Таким образом счетчик не должен обнуляться каждый раз, когда перезапускается сервер.

// Подсказка:
// Вы можете сохранять файл в формате JOSN,
// где в объекте ключом будет являться URL страницы, а значением количество просмотров страницы

// Формат сдачи работы:
// — Ссылка на гитхаб/гитлаб
// — Файл с кодом.

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

function readCountFile() {

    try {
        const data = fs.readFileSync(path.join(__dirname, 'count.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }

}

function writeCountFile(obj) {

    try {
        fs.writeFileSync(path.join(__dirname, 'count.json'), JSON.stringify(obj, null, 2));
    } catch (err) {
        console.error(err);
    }

}

// function outCountHTML(url, count) {
//     fs.readFile(url, (err, data) => {

//         if (err) {
//             console.error(err);
//         }
//         else {
//             console.log(data.toString().replace(/{count}/g, count));
//         }  

//     });
// }

// outCountHTML('./static/index.html', 5);

app.use((req, res, next) => {
    console.log('Поступил запрос', req.method, req.url);
    const countObj = readCountFile();
    if (req.url === '/' || req.url === '/index.html') {
        countObj.countRootPage++;
    } else if (req.url === '/about' || req.url === '/about.html') {
        countObj.countAboutPage++;
    }
    writeCountFile(countObj);
    next();
});

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/about.html'));
});

app.get('/count', (req, res) => {
    res.sendFile(path.join(__dirname, 'count.json'));
});

const port = 3000;

app.listen(port, () => {
    console.log(`Сервер запущен, порт: ${port}`);
});