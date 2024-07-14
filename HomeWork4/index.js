const express = require('express');
const joi = require('joi');
const fs = require('fs');
const path = require('path');

const { captureRejectionSymbol } = require('events');

const app = express();

let users = [];
let uniqueID = 0;

const schema = joi.object({
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    age: joi.number().min(0).max(150).required(),
    city: joi.string().min(1)
});

const idSchema = joi.object({
    id: joi.number().required()
});

function readUsersFile() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
        users = JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
}

function writeUsersFile() {
    fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('user saved');
    });
}

app.use((req, res, next) => {
    console.log('Поступил запрос', req.method, req.url);
    next();
});

app.use(express.json());

app.get('/users', (req, res) => {

    readUsersFile();

    res.send({ users });
});

app.post('/users', (req, res) => {

    const userValidation = schema.validate(req.body);
    if (userValidation.error) {
        return res.status(400).send(userValidation.error.details);
    }

    readUsersFile();

    if (users.length !== 0) {
        uniqueID = users[users.length - 1].id;
    }

    uniqueID += 1;

    users.push({
        id: uniqueID,
        ...req.body
    });

    writeUsersFile();

    res.send({
        id: uniqueID,
    });
});

app.put('/users/:id', (req, res) => {

    const idValidation = idSchema.validate(req.params);
    if (idValidation.error) {
        return res.status(400).send(idValidation.error.details);
    }

    const userValidation = schema.validate(req.body);
    if (userValidation.error) {
        return res.status(400).send(userValidation.error.details);
    }

    readUsersFile();

    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        user.firstName = req.body.firstName;
        user.secondName = req.body.secondName;
        user.age = req.body.age;
        user.city = req.body.city;

        writeUsersFile();

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }

});

app.get('/users/:id', (req, res) => {

    readUsersFile();

    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete('/users/:id', (req, res) => {

    readUsersFile();

    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);

       writeUsersFile();

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.use((req, res) => {
    res.status(404).send({ message: 'URL not found' });
});

const port = 3000;

app.listen(port, () => {
    console.log(`Сервер запущен, порт: ${port}`);
});

