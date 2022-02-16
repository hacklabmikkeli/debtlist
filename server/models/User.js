const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: String,
    showName: Boolean,
    debtAmount: Number,
    cardHash: String,
    discordID:String
});

module.exports = mongoose.model('User', userSchema);