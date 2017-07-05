const mongoose = require('mongoose');
const gpuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true},
    averageHashRateMhz: { type: Number, default: 1},
    peakHashRateMhz: { type: Number, default: 1},
    cost: { type: Number, required: true},
    alternates: [{
        nvidia: {type: String},
        amd: {type: String},
        other: {type: String}
    }]

});
const Gpu = mongoose.model('Gpu', gpuSchema)

module.exports = Gpu;