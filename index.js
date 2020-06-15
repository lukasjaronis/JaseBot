const TwitchClient = require('twitch').default
const WebHookListener = require('twitch-webhooks').default
const axios = require('axios')
const fs = require('fs')
const Discord = require('discord.js')
const { config } = require('dotenv')
const client = new Discord.Client()
const { twitch_user_id, post_channel } = require('./user')

const { liveEmbed } = require('./utils/messageEmbeds')

module.exports = client

// ENV
config({
  path: __dirname + '/.env',
})

// The webhook listener needs an initial state, so it has to detect that the streamer is live first.
async function checkStream() {
  const userId = twitch_user_id
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
        if (!prevStream) {
          // Finding the channel
          let findChannel = client.channels.cache.find(
            (ch) => ch.name === post_channel
          )

          let streamInfo = findChannel.id

          client.user
            .setActivity('twitch ❤️', {
              type: 'STREAMING',
              url: 'https://www.twitch.tv/tastejase',
            })
            .then((presence) =>
              console.log(`Activity set to ${presence.activities[0].name}`)
            )
            .catch(console.error)

          const { _data } = stream
          console.log(_data, 'data?')
          console.log(_data.title, 'title')

          let gameName
          if (stream.gameId) {
            gameName = await stream.getGame()
            return gameName
          }

          console.log(gameName, 'game name in index')

          let msg = liveEmbed(stream, gameName)
          return client.channels.cache.get(`${streamInfo}`).send(msg)
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

checkStream()

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

client.login(process.env.TOKEN)
