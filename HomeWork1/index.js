// Урок 1. Введение в Node.js

// Напишите HTTP сервер и реализуйте два обработчика, где:
// — По URL “/” будет возвращаться страница, на которой есть гиперссылка на вторую страницу по ссылке “/about”
// — А по URL “/about” будет возвращаться страница, на которой есть гиперссылка на первую страницу “/”
// — Также реализуйте обработку несуществующих роутов (404).
// — * На каждой странице реализуйте счетчик просмотров. Значение счетчика должно увеличиваться на единицу каждый раз, когда загружается страница.

const http = require('http');
let counterIndex = 0;
let counterAbout = 0;

const server = http.createServer((req, res) => {
    console.log('Запрос получен');
    console.log(req.url, req.method);

    if (req.url === '/') {

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8',
        });
        res.write('<h1>Главная</h1>');
        res.write('<a href="/about">about</a>');
        res.end();
        counterIndex ++;
        console.log(`Просмотров index страницы ${counterIndex} раз`);
        
    } else if(req.url === '/about') {

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8',
        });
        res.write('<h1>Страница About</h1>');
        res.write('<a href="/">index</a>');
        res.end();
        counterAbout ++;
        console.log(`Просмотров About страницы ${counterAbout} раз`);
        
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=UTF-8',
        });
        res.end('<h1>Станица не найдена!(404)</h1>');
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Сервер запущен по порту ${port}`);
});

