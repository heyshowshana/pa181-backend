const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const moment = require("moment");
const cors = require('cors');

/* CREATING EXPRESS OBJECT */
const app = express();

/* SETTING UP MIDDLEWARE */
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
let now = moment()

/* CONNECTING TO DATABASE + CREATING DATABASE OBJECT */
const db = knex(
    {
      client: 'pg',
      connection: {
        host: "**********",
        user: "**********",
        password: "**********",
        database: "**********",
        ssl: {rejectUnauthorized: false},
        port: "5432",
      }
    }
);

/* Serving API Info Page */
app.use(express.static(__dirname + '/views'));

/* HANDLING user REQUESTS */
app.post('/user', async (req, res) => {
    const {email, street, district} = req.body;

    await db.insert({email, street, district})
        .into('user')
        .then(() => res.json({success: true, data: {email, street, district}}))
        .catch(err => res.json({success: false, message: "Uploading the user failed.", stack: err.stack}));
})

app.get('/user', async (req, res) => {
    const result = await db.select().from('user')

    if (result.length !== 0) {
        res.json({success: true, result});
    } else {
        res.json({success: false, message: "No users in the database!"})
    }
})

app.get('/user/:id', async (req, res) => {
    const {id} = req.params;
    const result = await db('user').where('id', id).first();

    if (result) {
        res.json({success: true, result});
    } else {
        res.json({success: false, message: "No user with that id!"})
    }
})

app.delete('/user/:id', async (req, res) => {
    const {id} = req.params;

    await db('user')
        .where('id', id)
        .del()
        .then(() => res.json({success: true, message: "The user was deleted successfully."}))
        .catch(err => res.json({success: false, message: "Deleting the user failed.", stack: err.stack}));
})

/* HANDLING evaluation REQUESTS */
app.post('/evaluation', async (req, res) => {
    const {email, street, district, stars, note} = req.body;
    let timestamp = now.format()

    await db.insert({email, street, district, stars, timestamp, note})
        .into('evaluation')
        .then(() => res.json({success: true, data: {email, street, district, stars, timestamp}}))
        .catch(err => res.json({success: false, message: "Uploading the evaluation failed.", stack: err.stack}));
})

app.get('/evaluation', async (req, res) => {
    const result = await db.select().from('evaluation')

    if (result.length !== 0) {
        res.json({success: true, result});
    } else {
        res.json({success: true, message: "No evaluations in the database!"});
    }
})

app.get('/evaluation/:id', async (req, res) => {
    const {id} = req.params;
    const result = await db('evaluation').where('id', id).first();

    if (result) {
        res.json({success: true, result});
    } else {
        res.json({success: true, message: "No evaluation with that id!"});
    }
})

app.delete('/evaluation/:id', async (req, res) => {
    const {id} = req.params;

    await db('evaluation')
        .where('id', id)
        .del()
        .then(() => res.json({success: true, message: "The evaluation was deleted successfully."}))
        .catch(err => res.json({success: false, message: "Deleting the evaluation failed.", stack: err.stack}));
})


/* HANDLING cleaning REQUESTS */
app.post('/cleaning', async (req, res) => {
    const {street, datetime_from, datetime_to} = req.body;

    await db.insert({street, datetime_from, datetime_to})
        .into('cleaning')
        .then(() => res.json({success: true, data: {street, datetime_from, datetime_to}}))
        .catch(err => res.json({success: false, message: "Uploading the cleaning failed.", stack: err.stack}));
})

app.get('/cleaning', async (req, res) => {
    const result = await db.select().from('cleaning')

    if (result.length !== 0) {
        res.json({success: true, result});
    } else {
        res.json({success: true, message: "No cleanings in the database!"});
    }
})

app.get('/cleaning/:id', async (req, res) => {
    const {id} = req.params;
    const result = await db('cleaning').where('id', id).first();

    if (result) {
        res.json({success: true, result});
    } else {
        res.json({success: true, message: "No cleaning with that id!"});
    }
})

app.get('/cleaning/on_date/:date', async (req, res) => {
    const {date} = req.params;
    let date_from = date + "T00:00:00.000Z"
    let date_to = date + "T23:59:59.000Z"
    const result = await db('cleaning').whereBetween('datetime_from', [date_from, date_to]);

    if (result) {
        res.json({success: true, result});
    } else {
        res.json({success: true, message: "No cleaning with that id!"});
    }
})

app.delete('/cleaning/:id', async (req, res) => {
    const {id} = req.params;

    await db('cleaning')
        .where('id', id)
        .del()
        .then(() => res.json({success: true, message: "The cleaning was deleted successfully."}))
        .catch(err => res.json({success: false, message: "Deleting the cleaning failed.", stack: err.stack}));
})

app.get('/*', async (req, res) => {
        res.json("Sorry, this API has nothing to offer you on this route. :/")
})

app.listen(process.env.PORT || 8080,
    () => console.log(`The server is running on port: ${process.env.PORT || 8080}`)
);
