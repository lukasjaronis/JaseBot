const client = require('../index')
const { prefix } = require('../config.json')
const accessCheck = require('../permissions')
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
