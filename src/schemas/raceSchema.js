const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    flag: { type: String, required: true },
    date: { type: String },
    tier: { type: String },
})


const model = mongoose.model("Race", raceSchema);

module.exports = model;