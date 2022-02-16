const mongoose = require('mongoose');


const tempCardSchema = mongoose.Schema({
    rndNumber: Number,
    cardHash: String,
    timestamp: Date
});

module.exports = mongoose.model('TempCArd', tempCardSchema);