const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    flag: { type: String, require: true, unique: true },
    date: { type: String }
})


const model = mongoose.model("Race", raceSchema);

module.exports = model;