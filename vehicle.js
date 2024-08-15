const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true },
    manufacturer: String,
    model: String,
    year: Number,
    org: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
