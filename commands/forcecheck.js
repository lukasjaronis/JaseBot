const client = require('../index')
const { prefix } = require('../config.json')
const accessCheck = require('../permissions')
const { streamCheck } = require('../index')

client.on('message', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    let adminCheck = accessCheck(message)

    if (command === 'forcecheck') {
      if (adminCheck) {
        return streamCheck()
      } else {
        message.author.send("Sorry, you don't have permissions for that!")
        message.delete()
      }
    }
  } catch (err) {
    console.log(err)
  }
})
