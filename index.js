const fs = require('fs')
const Discord = require('discord.js')
const { config } = require('dotenv')
const client = new Discord.Client()
const checkStream = require('./twitch')
const messageMilestones = require('./MessageMilestones')

module.exports = client

// ENV
config({
  path: __dirname + '/.env',
})

// turns commands folder into the command collection
client.commands = new Discord.Collection()
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.once('ready', () => {
  console.log('Bot online')
  client.user
    .setActivity('Morty', { type: 'WATCHING' })
    .then((presence) =>
      console.log(`Activity set to ${presence.activities[0].name}`)
    )
})

checkStream()
messageMilestones()

client.login(process.env.TOKEN)
