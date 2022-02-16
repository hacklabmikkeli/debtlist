const Discord = require('discord.js');
const { Intents } = require('discord.js');

const client = new Discord.Client({
    intents:
        [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
    partials: [
        'CHANNEL',
    ]
});


module.exports = function () {
    let create, sendMsg

    create = function (config) {
        let token = config.DS_Token

        client.login(token).catch((err) => {
            console.log(err)
        });

        client.once('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });
        client.on('messageCreate', (msg) => {
            const addCardUtils = require('../server/utils/utils')()
            if (msg.author.bot === true)
                return
            client.channels.fetch(msg.channelId)
                .then(channel => {
                    if (channel.type === 'DM') {
                        if (msg.content.indexOf('card') > -1) {
                            rndNumber = parseInt(msg.content.split(" ")[1])
                            userNick = msg.author.username + "#" + msg.author.discriminator
                            userID = msg.author.id
                            addCardUtils.checkCard(rndNumber, userNick).then((val) => {
                                console.log(val)
                                addCardUtils.addCardToUser(val, userNick, userID).then(() => {
                                    msg.reply("Card added to your account")
                                }).catch((err) => {
                                    msg.reply('Vituiks män. Same in english fuck happened')
                                })
                            }).catch((err) => {
                                msg.reply('Vituiks män. Same in english fuck happened')
                            })
                        } else {
                            msg.reply("Please give right command:\n" +
                                'card "random number"'
                            )
                        }
                    }
                })
                .catch(console.error);
        })


    }
    sendMsg = function (discordID, debtamount) {
        client.users.fetch(discordID, true).then((user) => {
            user.send("You are in debt:\n " + debtamount)
        })
    }

    return {
        create: create,
        sendMsg: sendMsg
    }
}