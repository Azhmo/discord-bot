const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    team: { type: String, required: true },
    country: { type: String, required: true },
    gain: { type: Number, required: true },
    points: { type: Number, required: true },
    penaltyPoints: { type: Number, required: true },
    nextRacePenalty: { type: String, required: true },
    currentRacePosition: { type: Number },
    hasFastestLap: { type: Boolean },
    hasBonusPoint: { type: Boolean },
    provisionalTeam: { type: String },
    isCleanDriver: { type: Boolean, required: true },
    raceInvolvement: { type: Number, required: true },
    tier: { type: String, required: true },
    hasCleanRace: { type: Boolean, required: true },
    consecutiveCleanRaces: { type: Number, required: true },
    isPotentialCleanDriver: { type: Boolean, required: true },
})


const model = mongoose.model("Driver", driverSchema);

module.exports = model;