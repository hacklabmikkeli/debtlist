const express = require('express')

const cors = require('cors')
const mongoose = require('mongoose')
const utilsAddCard = require('./utils/utils')()
module.exports = function () {

    let create, start
    app = express()

    create = function (config) {
        app.use(cors())
        app.use(express.json());
        app.set('port', config.port)


        app.post('/pay', (req, res) => {
            console.log("Pay")
            if (req.body.hasOwnProperty('data') && req.body.hasOwnProperty('api_key')) {
                if (req.body.api_key !== config.api_key)
                    return res.status(400).send({ "success": false })
                if (req.body.data.hasOwnProperty('hash') && req.body.data.hasOwnProperty('amount')) {
                    utilsAddCard.getDebt(req.body.data.hash).then((val) => {
                        amountFromReader = req.body.data.amount
                        transActAmo = parseFloat(amountFromReader.replace(',', '.'))
                        amount = parseFloat(val) + transActAmo
                        utilsAddCard.payProdu(req.body.data.hash, amount, transActAmo).then((val) => {
                            res.status(200).send({ "success": true })
                        }).catch((err) => {
                            console.log(err)
                            return res.status(400).send({ "success": false })
                        })
                    }).catch((err) => {
                        console.log(err)
                        return res.status(400).send({ "success": false })
                    })

                }
            }


        })

        app.post('/repay', (req, res) => {
            console.log("Repay")
            if (req.body.hasOwnProperty('data') && req.body.hasOwnProperty('api_key')) {
                if (req.body.api_key !== config.api_key)
                    return res.status(400).send({ "success": false })
                if (req.body.data.hasOwnProperty('hash') && req.body.data.hasOwnProperty('amount')) {
                    utilsAddCard.getDebt(req.body.data.hash).then((val) => {
                        amountFromReader = req.body.data.amount
                        transActAmo = parseFloat(amountFromReader.replace(',', '.'))
                        amount = parseFloat(val) + transActAmo
                        utilsAddCard.payProdu(req.body.data.hash, amount, transActAmo).then((val) => {
                            res.status(200).send({ "success": true })
                        }).catch((err) => {
                            console.log(err)
                            return res.status(400).send({ "success": false })
                        })
                    }).catch((err) => {
                        console.log(err)
                        return res.status(400).send({ "success": false })
                    })

                }
            }

        })

        app.post('/addcard', (req, res) => {
            console.log("Add card")
            if (req.body.hasOwnProperty('data') && req.body.hasOwnProperty('api_key')) {
                if (req.body.api_key !== config.api_key)
                    return res.status(400).send({ "success": false })
                if (req.body.data.hasOwnProperty('hash') && req.body.data.hasOwnProperty('rnd')) {
                    utilsAddCard.createTemp(req.body.data.hash, req.body.data.rnd)
                }
            }
            res.status(200).send({ "success": true })
        })

        app.post('/readcard', (req, res) => {
            console.log("Add card")
            if (req.body.hasOwnProperty('data') && req.body.hasOwnProperty('api_key')) {
                if (req.body.api_key !== config.api_key)
                    return res.status(400).send({ "success": false })
                if (req.body.data.hasOwnProperty('hash') && req.body.data.hasOwnProperty('rnd')) {
                    utilsAddCard.createTemp(req.body.data.hash, req.body.data.rnd)
                }
            }
            res.status(200).send({ "success": true })
        })

        app.get('/gethash', (req, res) => {
            utilsAddCard.getCards().then((val) => {
                res.send(val)
                utilsAddCard.deleteCards();
                return
            }).catch((err) => {
                res.send(err)
                utilsAddCard.deleteCards();
                return
            })
        })


        app.post('/getdebt', (req, res) => {
            console.log("Debt")
            if (req.body.hasOwnProperty('data') && req.body.hasOwnProperty('api_key')) {
                if (req.body.api_key !== config.api_key)
                    return res.status(400).send({ "success": false })
                if (req.body.data.hasOwnProperty('hash')) {
                    /* utilsAddCard.getDebt(req.body.data.hash).then((val) => {
                        return res.status(200).send({ "success": true, "amount": val + "" })
                    }).catch((err) => {
                        return res.status(400).send({ "success": false })
                    }) */
                    utilsAddCard.getTransactions(req.body.data.hash).then(() => {
                        return res.status(200).send({ "success": true })
                    }).catch(() => {
                        return res.status(400).send({ "success": false })
                    })
                } else {
                    return res.status(400).send({ "success": false })
                }
            }

        })
        app.get('/sendmsg', (req, res) => {
            utilsAddCard.sendMsgNow();
            res.send("Ok")
        })

        app.get('/getdebts', (req, res) => {
            utilsAddCard.getDebts()
            res.send("Ok")
        })

        app.get('/getdebts2', (req, res) => {
            if (req.query.api_key === config.api_key) {
                utilsAddCard.getDebts2().then((data) => {
                    res.json(data)
                }).catch((err) => {
                    console.log(err)
                    res.send("Ok")
                })
            } else {
                res.send("no access")
            }
        })

        app.post('/updateuser', (req,res) =>{
            if(req.body.api_key === config.api_key) {
                utilsAddCard.updateUser(req.body)
            }
            res.send('kissa')
        }) 

        app.get('/getdata', (req, res) => {
            if (req.query.api_key === config.api_key) {
                utilsAddCard.getData().then((data) => {
                    res.json(data)
                }).catch((err) => {
                    console.log(err)
                    res.send("Ok")
                })
            } else {
                res.send("no access")
            }
        })

        mongoose.connect(config.mongoUri, {
            user: config.mongoUser,
            pass: config.mongoPwd
        }).catch((err) => {
            console.log('err occured on mongoose')
            return
        })
    }

    start = function () {
        let port = app.get('port')
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    }
    return {
        create: create,
        start: start
    }
}