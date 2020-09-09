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

    if (command == 'giveaway') {
      if (adminCheck) {

        let item = args[0].split('"').join('')
        let time = args[1]

        if (!item) {
          await message.author.send("You need to specifiy what the raffle is for. Check !rick for commands.")
          message.delete().catch(e => console.log(e))
        }

        if (!time) {
          await message.author.send("You need to specify a time. Check !rick for commands.")
          message.delete().catch(e => console.log(e))
        }

        if (item && time) {
          const endTime = moment(new Date().getTime() + Number(time))

          const giveawayMessage = await message.channel.send(
            `@everyone, ${message.author} has started a giveaway! If you want to participate hit the 🥭 \n\n This raffle is for **${item}** \n\n Giveaway will end on **${endTime.format("MMMM Do YYYY, h:mm:ss a")}** `
          ).catch(e => console.log(e))

          // Add reaction to message
          let startTime;
          await giveawayMessage.react('🥭').then(reacted => {
            startTime = moment(new Date().getTime());
            return reacted
          })

          const timeDifference = endTime.diff(startTime)

          setTimeout(function () {
            const [users] = giveawayMessage.reactions.cache.map(item => {
              const userTags = item.users.cache.map(user => {
                return user.tag
              })
              return userTags
            })

            const [, ...rest] = users
            const winner = rest[Math.floor(Math.random() * rest.length)]

            console.log(rest, 'length of array')
            console.log(winner, 'winner')

            if (rest.length == 0) {
              return message.channel.send('Nobody played.')
            } else {
              giveawayMessage.reactions.cache.map(item => {
                const userWinningTag = item.users.cache.map(user => {
                  if (winner === user.tag) {
                    return message.channel.send(user.toString() + ` has won the giveaway!`)
                  }
                })
                return userWinningTag
              })
            }
          }, timeDifference)

        }
      } else {
        message.channel.send('you do not have permission!')
      }
      message.delete().catch(e => console.log(e))
    }

  } catch (err) {
    console.log(err)
  }
})