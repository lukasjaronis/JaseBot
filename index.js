const TwitchClient = require('twitch').default
const WebHookListener = require('twitch-webhooks').default

const fs = require('fs')
const Discord = require('discord.js')
const { config } = require('dotenv')
const client = new Discord.Client()
module.exports = client

// ENV
config({
  path: __dirname + '/.env',
})

async function streamSubscribe() {
  // testing
  const userId = '238273761'

  // const userId = 61050409
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET
  const twitchClient = TwitchClient.withClientCredentials(
    clientId,
    clientSecret
  )

  const listener = await WebHookListener.create(twitchClient, {
    hostName: '7b1819fd546a.ngrok.io',
    port: 8090,
    reverseProxy: { port: 443, ssl: true },
  })
  listener.listen()

  let prevStream = null
  const subscription = await listener.subscribeToStreamChanges(
    userId,
    async (stream) => {
      if (stream) {
        console.log(stream, 'stream')
        if (!prevStream) {
          console.log(
            `${stream.userDisplayName} just went live with title: ${stream.title}`
          )
        }
      } else {
        // no stream, no display name
        const user = await twitchClient.helix.users.getUserById(userId)
        console.log(user, 'user')
        console.log(`${user.displayName} just went offline`)
      }
      prevStream = stream
    }
  )
  return subscription
}

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

streamSubscribe()

client.login(process.env.TOKEN)
