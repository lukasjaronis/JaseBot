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

async function streamCheck() {
  const userId = '61050409'
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET
  const twitchClient = TwitchClient.withClientCredentials(
    clientId,
    clientSecret
  )

  const listener = await WebHookListener.create(twitchClient, {
    hostName: '64.227.3.188',
    port: 8098,
  })
  listener.listen()

  let prevStream = null
  const subscription = await listener.subscribeToStreamChanges(
    userId,
    async (stream) => {
      if (stream) {
        console.log(stream, 'stream')
        if (!prevStream) {
          // Finding the channel
          let findChannel = client.channels.cache.find(
            (ch) => ch.name === 'stream-info'
          )

          let streamInfo = findChannel.id

          client.user
            .setActivity('twitch', {
              type: 'STREAMING',
              url: 'https://www.twitch.tv/tastejase',
            })
            .then((presence) =>
              console.log(`Activity set to ${presence.activities[0].name}`)
            )
            .catch(console.error)

          client.channels.cache
            .get(`${streamInfo}`)
            .send(
              `@everyone <@&718891169802748014> <@&703360592928309279> ${stream.userDisplayName} is live! https://www.twitch.tv/tastejase 🚀🚀🚀 \n ${stream.title}`
            )
        }
      } else {
        // no stream, no display name
        const user = await twitchClient.helix.users.getUserById(userId)
        client.channels.cache
          .get(`${streamInfo}`)
          .send(`${user.displayName} just went offline.`)
      }
      prevStream = stream
    }
  )
  return subscription
}

streamCheck()

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
  streamCheck()
  client.user
    .setActivity('Morty', { type: 'WATCHING' })
    .then((presence) =>
      console.log(`Activity set to ${presence.activities[0].name}`)
    )
})

client.login(process.env.TOKEN)
