const TempCard = require('../models/TempCard')
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const cron = require('cron')
const discordBot = require('../../discord')()
const printToPaper = require('../../printer')()
module.exports = function () {
    let createTemp, checkUser, checkCard, addCardToUser, getDebt, payProdu, sendMsgToUsers, getTransactions, getCards
    let deleteCards, sendMsgNow, getDebts, getDebts2, updateUser, getData
    sendMsgToUsers = function () {
        const sendMsgToUsersCron = cron.job('0 0 0 1 * *', function () {
            User.find({}, (err, docs) => {
                docs.map(user => {
                    discordBot.sendMsg(user.discordID, user.debtAmount)
                })
            })
        })
        sendMsgToUsersCron.start();
    }

    updateUser = function(data) {
        User.findOneAndUpdate({_id:data._id}, data,(err, doc) => {if(err) console.log(err)})
    }


    createTemp = function (hash, rndNumber) {


        TempCard.deleteMany({ "cardHash": hash }, (err, doc) => {
            console.log(doc)
        })
        tmp = new TempCard()

        tmp.cardHash = hash
        tmp.rndNumber = rndNumber
        tmp.timestamp = Date.now();
        tmp.save().then(() => console.log("Card save")).catch((err) => console.log("Err occurred: " + err))
    }

    checkCard = function (rndNumber) {

        return new Promise((resolve, reject) => {
            TempCard.findOne({ "rndNumber": rndNumber }, (err, doc) => {
                if (doc === null || doc === undefined)
                    return reject("No card found")
                else
                    resolve(doc.cardHash)
            })
        })
    }

    deleteCards = function () {
        TempCard.deleteMany({}, (err, doc) => {if(err) console.log(err)})
    }


    getCards = function () {

        return new Promise((resolve, reject) => {
            TempCard.find({}, (err, doc) => {
                if (doc === null || doc === undefined || doc.length <= 0)
                    return reject("No card found")
                else
                    resolve(doc)
            })
        })
    }

    checkUser = function (userIDNick) {
        return new Promise((resolve, reject) => {
            User.findOne({ "name": userIDNick }, (err, doc) => {
                if (doc === null)
                    reject("No User found")
                else
                    resolve("User found")
            })
        })
    }

    addCardToUser = function (cardHash, UserNick, UserID) {
        return new Promise((resolve, reject) => {
            checkUser(UserNick).then(() => {
                User.findOneAndUpdate({ "name": UserNick }, { "cardHash": cardHash }, (err, doc) => {
                    if (err) reject(err)
                    TempCard.findOneAndDelete({ "cardHash": cardHash }, (err, doc) => {
                        if (err) console.log(err)
                    })
                    resolve("Added card")
                })
            }).catch(() => {
                tmp = new User
                tmp.name = UserNick
                tmp.showName = true
                tmp.debtAmount = 0
                tmp.cardHash = cardHash
                tmp.discordID = UserID
                TempCard.findOneAndDelete({ "cardHash": cardHash }, (err, doc) => {
                    if (err) console.log(err)
                })
                tmp.save().then(() => resolve("Card added")).catch((err) => reject("Error"))
            })
        })
    }

    getDebt = function (hash) {
        return new Promise((resolve, reject) => {
            User.findOne({ "cardHash": hash }, (err, doc) => {
                if (doc === null)
                    return reject("No user found")
                if (err)
                    return reject(err)
                resolve(doc.debtAmount)
            })
        })
    }

    getDebts = function () {
        return new Promise((resolve, reject) => {
            User.find({}, (err, docs) => {
                if (docs === null)
                    return reject("No user found")
                if (err)
                    return reject(err)
                printToPaper.printDebts(docs)
                resolve('ok')
            })
        })
    }
    getDebts2 = function () {
        return new Promise((resolve, reject) => {
            User.find({}, (err, docs) => {
                if (docs === null)
                    return reject("No user found")
                if (err)
                    return reject(err)
                resolve(docs)
            })
        })
    }

    getData = function () {
        return new Promise((resolve, reject) => {
            User.find({},{"name":1, "debtAmount":1, "showName":1, "_id":0}, (err, docs) => {
                if (docs === null)
                    return reject("No user found")
                if (err)
                    return reject(err)
                resolve(docs)
            })
        })
    }

    payProdu = function (hash, amount, transActAmo) {
        return new Promise((resolve, reject) => {
            tmp = new Transaction
            User.findOneAndUpdate({ "cardHash": hash }, { "debtAmount": amount }, (err, doc) => {
                if (doc === null)
                    return reject("No user found")
                if (err)
                    return reject(err)
                timeS = new Date()
                //timeS = timeS.toLocaleString('fi', { timeZone: 'Europe/Helsinki' })
                tmp.userID = doc._id
                tmp.amount = transActAmo
                tmp.timestamp = timeS
                tmp.save().then(() => console.log("Save occured")).catch((err) => console.log(err))
                resolve(doc.debtAmount)
            })
        })
    }

    getTransactions = function (hash) {
        return new Promise((resolve, reject) => {
            checkIfUserHasCard(hash).then((val) => {
                Transaction.find({ "userID": val._id }, (err, docs) => {
                    if (docs.length > 0) {
                        User.findOne({ _id: val._id }, (err, doc) => {
                            printToPaper.print(docs, val.debtAmount, doc.name)
                            resolve('ok')
                        })

                    }
                })
            }).catch((err) => {
                reject(err)
            })
        })
    }

    checkIfUserHasCard = function (hash) {
        return new Promise((resolve, reject) => {
            User.findOne({ "cardHash": hash }, (err, docs) => {
                if (docs === null || docs === undefined || err)
                    reject("Error in check user card")
                else
                    resolve(docs)
            })
        })
    }

    sendMsgNow = function () {
        User.find({}, (err, docs) => {
            docs.map(user => {
                discordBot.sendMsg(user.discordID, user.debtAmount)
            })
        })
    }

    return {
        createTemp: createTemp,
        checkCard: checkCard,
        checkUser: checkUser,
        addCardToUser: addCardToUser,
        getDebt: getDebt,
        payProdu: payProdu,
        sendMsgToUsers: sendMsgToUsers,
        getTransactions: getTransactions,
        getCards: getCards,
        deleteCards: deleteCards,
        sendMsgNow: sendMsgNow,
        getDebts:getDebts,
        getDebts2:getDebts2,
        updateUser:updateUser,
        getData:getData

    }
}