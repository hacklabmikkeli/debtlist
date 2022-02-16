const config = require('./config/config')
const server = require('./server')()
const discordBot = require('./discord/')()
const utils = require('./server/utils/utils')()

server.create(config)
server.start()
utils.sendMsgToUsers()
discordBot.create(config);