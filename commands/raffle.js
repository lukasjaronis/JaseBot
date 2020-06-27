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

    if (command === 'raffle') {
      if (adminCheck) {
        let item = args[0].split('"').join('')

        const time = 60000

        const filter = (reaction, user) => {
          return reaction.emoji.name === '🥭' && user.id === message.author.id
        }

        if (!item) {
          message.author.send(
            'You need to specifiy what the raffle is for! !raffle item'
          )
          message.delete()
        } else {
          const raffleMessageSent = await message.channel.send(
            `@everyone, ${message.author} has started a raffle! It will end in **1 minute**. If you want to participate hit the 🥭! \n\n This raffle is for ` +
              item
          )

          await raffleMessageSent.react('🥭')

          const collector = raffleMessageSent.createReactionCollector(filter, {
            time: time,
          })

          collector.on('collect', (user) => {
            return user.tag
          })

          collector.on('end', (collected) => {
            if (collected.size == 0) {
              message.channel.send('Wubba Lubba Dub Dub nobody played!')
            }

            collected.map((c) => {
              const users = c.users.cache.map((user) => {
                return user.tag
              })
              const [, ...rest] = users
              const winner = rest[Math.floor(Math.random() * rest.length)]

              c.users.cache.map((user) => {
                if (winner && user.tag === winner) {
                  message.channel.send(user.toString() + ' has won the raffle!')
                }
              })
            })
            message.delete()
          })
        }
      } else {
        return message.reply("you don't have permission!")
      }
    }
  } catch (err) {
    console.log(err)
  }
})
