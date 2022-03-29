const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Chip1018!',
    database: 'players'
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));

const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jill' },
    { id: 3, name: 'Turalyon' },
]

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/api/insert', (req, res) => {
    const username = req.body.username;
    const passwords = req.body.passwords;
    const sqlInsert = "INSERT INTO test (username, passwords) VALUES (?, ?);";
    db.query(sqlInsert, [username, passwords],function (err, result) {
        if (err) throw err;
        console.log("Success!");
    });
})

/*
app.get('/api/user', (req, res) => {
    const sqlInsert = "INSERT INTO test (username) VALUES ('user call');";
    queryFunction(sqlInsert);
    res.send(users);
});

app.get('/api/user/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.send(user);
});

app.post('/api/user', (req, res) => {
    if (!req.body.name || req.body.name.length < 3) {
        //400 Bad Request
        return res.status(400).send('Name is required and min 3 char');
    }
    const sqlInsert = "INSERT INTO test (username) VALUES ('user call');";
    queryFunction(sqlInsert);

    const user = {
        id: users.length + 1,
        name: req.body.name,
    }
    users.push(user);
    res.send(user);
});

app.put('/api/user/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('User not found');
    }
    if (!req.body.name || req.body.name.length < 3) {
        //400 Bad Request
        return res.status(400).send('Name is required and min 3 char');
    }

    user.name = req.body.name;
    res.send(user);
    //Validate
});

app.delete('/api/user/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('User not found');
    }
    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send(user);
});
*/
// PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on ${port}`));