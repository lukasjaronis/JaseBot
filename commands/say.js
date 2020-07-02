const client = require('../index')
const { prefix } = require('../config.json')
const { kickEmbed } = require('../utils/messageEmbeds')
const accessCheck = require('../permissions')
const { MessageReaction } = require('discord.js')
const messageEmbeds = require('../utils/messageEmbeds')
const user = require('../user')

client.on('message', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return
    let adminCheck = accessCheck(message)
    const args = message.content.slice(prefix.length).split(/ "|" | “|” /g)

    const command = args.shift().toLowerCase()

    if (command === 'say') {
      message.delete()
      if (adminCheck) {
        let item = args[0].split('"').join('')

        if (!item) {
          message.author.send('You need to specifiy a messege!')
          message.delete()
        } else {
          message.channel.send(item)
        }
      } else {
        return message.reply("you don't have permission!")
      }
    }
  } catch (err) {
    console.log(err)
  }
})
