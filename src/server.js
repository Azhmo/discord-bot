const express = require('express');
const path = require('path');
const mongo = require('./mongo');

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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', true);
    next();
})

app.post('/api/addTrack', (req, res) => {
    raceModel.findOneAndUpdate({ name: res.body.name }, {
        name: res.body.name,
        flag: res.body.flag,
        date: res.body.date,
    }, { upsert: true });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

