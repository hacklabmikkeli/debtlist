
const axios = require('axios')
const {printerUri} = require('../config/config.json')
module.exports = function () {
    let print


    print = function (data, debt, name) {

        jsonData = { "data": data, "debt": debt, "name": name }

        axios({
            method: 'post',
            url: `${printerUri}/printtopaper`,
            data: jsonData
        }).catch((err) => {
            console.log(err)
        })
    }
    printDebts = function (data) {

        jsonData = { "data": data}

        axios({
            method: 'post',
            url: `${printerUri}/printtopaper2`,
            data: jsonData
        }).catch((err) => {
            console.log(err)
        })
    }



        return {
            print: print,
            printDebts:printDebts
        }

    }



