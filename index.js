const TwitchClient = require('twitch').default
const WebHookListener = require('twitch-webhooks').default
const axios = require('axios')
const fs = require('fs')
const Discord = require('discord.js')
const { config } = require('dotenv')
const client = new Discord.Client()
const {
  twitch_user_id,
  post_channel,
  detect_text,
  twitch_url,
} = require('./user')

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
          const url = 'https://id.twitch.tv/oauth2/token'

          const requestData = {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: 'client_credentials',
          }

          const options = {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            data: requestData,
            url,
          }

          const { data } = await axios(options)
          const { access_token } = data

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

          const getGame = async (id) => {
            const { data: results } = await axios.get(
              `https://api.twitch.tv/helix/games?id=${id}`,
              {
                headers: {
                  'content-type': 'application/json',
                  'Client-Id': process.env.TWITCH_CLIENT_ID,
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            return results.data
          }

          const [game] = await getGame(_data.game_id).catch(console.error)

          let msg = liveEmbed(_data, game.name)
          let msgEveryone = detect_text
          let msgUrl = twitch_url

          return client.channels.cache
            .get(`${streamInfo}`)
            .send(msgEveryone, msg, msgUrl)
        }
      } else {
        // Finding the channel
        let findChannel = client.channels.cache.find(
          (ch) => ch.name === post_channel
        )

        let streamInfo = findChannel.id
        // no stream, no display name
        const user = await twitchClient.helix.users.getUserById(userId)
        client.channels.cache
          .get(`${streamInfo}`)
          .send(`${user.displayName} just went offline.`)

        // Get info of stream-info and handle message deletions
        let getStreamInfo = client.channels.cache.get('700889883056799854')
        console.log(getStreamInfo, 'get stream info')
        await getStreamInfo.messages
          .fetch({ limit: 30 })
          .then((collected) => {
            collected.forEach((msg) => {
              if (msg.content.startsWith(detect_text)) {
                msg.delete()
              }
            })
          })
          .catch((error) => console.log(error))
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
