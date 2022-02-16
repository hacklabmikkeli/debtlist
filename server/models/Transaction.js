const mongoose = require('mongoose');


const transactionSchema = mongoose.Schema({
    userID: String,
    amount: Number,
    timestamp: String
});

module.exports = mongoose.model('Transaction', transactionSchema);