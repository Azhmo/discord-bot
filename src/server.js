const express = require('express');
const path = require('path');
const mongo = require('./mongo');
const cors = require('cors');

const port = process.env.PORT || 8080;

const raceModel = require('./schemas/raceSchema');

mongo().then(() => {
    try {
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
})

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', true);
    next();
})

app.get('/', (req, res) => res.send('Welcome to Express'));

app.post('/api/addTrack', async (req, res) => {
    try {
        await raceModel.findOneAndUpdate({ name: req.body.name }, {
            name: req.body.name,
            flag: req.body.flag,
            date: req.body.date,
        }, { upsert: true });
        res.send(req.body)
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/api/tracks', async (req, res) => {
    try {
        await raceModel.find({}, (err, result) => {
            res.send(result);
        });
    } catch (err) {
        res.status(500).send(err);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

