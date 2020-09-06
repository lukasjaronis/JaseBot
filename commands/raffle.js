const client = require('../index')
const { prefix } = require('../config.json')
const accessCheck = require('../permissions')
const moment = require('moment')

client.on('message', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    let adminCheck = accessCheck(message)
    
    const args = message.content.slice(prefix.length).split(/ "|" | “|” /g)
    const command = args.shift().toLowerCase()

    if (command == 'raffle') {
      if (adminCheck) {
        let item = args[0].split('"').join('')
        let time = args[1]

        const filter = (reaction, user) => {
          return reaction.emoji.name === '🥭' && user.id === message.author.id
        }

        if (!item) {
          await message.author.send("You need to specifiy what the raffle is for. Check !rick for commands.")
          message.delete().catch(e => console.log(e))
        }

        if (!time) {
          await message.author.send("You need to specify a time. Check !rick for commands.")
          message.delete().catch(e => console.log(e))
        }

        if (item && time) {
          let tempTime = moment.duration(time);

          let convertedTime
          if (tempTime.hours() == 0) {
            convertedTime = tempTime.minutes() + " minutes"
          } else if (tempTime.minutes() == 0) {
            convertedTime = tempTime.hours() + " hours"
          } else {
            convertedTime = tempTime.hours() + " hours " + tempTime.minutes() + " minutes"
          }

          const raffleMessageSent = await message.channel.send(
            `@everyone, ${message.author} has started a raffle! It will end in ${convertedTime}. If you want to participate hit the 🥭 \n\n This raffle is for ` +
            item
          ).catch(e => console.log(e))

          await raffleMessageSent.react('🥭').catch(e => console.log(e))

          const collector = raffleMessageSent.createReactionCollector(filter, {
            time: time,
          })

          collector.on('collect', (user) => {
            return user.tag
          })

          collector.on('end', (collected) => {

            if (collected.size == 0) {
              message.channel.send('Wubba Lubba Dub Dub nobody played!').catch(e => console.log(e))
            }

            collected.map((c) => {
              console.log(c, 'c')
              const users = c.users.cache.map((user) => {
                return user.tag
              })
              const [, ...rest] = users
              const winner = rest[Math.floor(Math.random() * rest.length)]

              console.log(winner, 'winner')

              c.users.cache.map((user) => {
                if (winner && user.tag === winner) {
                  message.channel.send(user.toString() + ' has won the raffle!').catch(e => console.log(e))
                }
              })
            })

          })

        }
      } else {
        return message.reply("you don't have permission!").catch(e => console.log(e))
      }
      message.delete().catch(e => console.log(e))
    } 

  } catch (err) {
    console.log(err)
  }
})