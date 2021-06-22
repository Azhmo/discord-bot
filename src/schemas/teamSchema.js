const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    gain: { type: Number, required: true },
    points: { type: Number, required: true }
})


const model = mongoose.model("Team", teamSchema);

module.exports = model;