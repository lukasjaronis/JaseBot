const { config } = require('dotenv')
const Discord = require('discord.js')
const client = new Discord.Client()
const TwitchClient = require('twitch').default
const WebHookListener = require('twitch-webhooks').default
const axios = require('axios')

const {
  hostname,
  twitch_user_id,
  post_channel,
  post_channel_id,
  detect_text,
  twitch_url,
} = require('./user')

const { getToken } = require('./access_token')

const { liveEmbed } = require('./utils/messageEmbeds')

// ENV
config({
  path: __dirname + '/.env',
})

// The webhook listener needs an initial state, so it has to detect that the streamer is live first.
async function checkStream() {
  console.log('1')

  const userId = twitch_user_id
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET
  const twitchClient = TwitchClient.withClientCredentials(
    clientId,
    clientSecret
  )

  const listener = await WebHookListener.create(twitchClient, {
    hostName: hostname,
    port: 8098,
  })
  listener.listen()

  let firstCall = true
  let prevGame = null
  let prevStream = null
  const subscription = await listener.subscribeToStreamChanges(
    userId,
    async (stream) => {
      console.log('2')
      if (stream) {
        const { gameId } = stream // deconsutructing game id

        console.log('3')

        // Checking if prevGame exists, if does, continue
        if (prevGame) {
          // if also firstCall is false
          if (prevGame !== gameId && firstCall == false) {
            const { name } = await stream.getGame()

            let msg = liveEmbed(stream, name)

            // Finding the channel
            let findChannel = client.channels.cache.find(
              (ch) => ch.name === post_channel
            )

            let streamInfo = findChannel.id

            client.channels.cache.get(`${streamInfo}`).send(msg)

            await client.channels.cache
              .get(`${streamInfo}`)
              .send(`Come watch! ${twitch_url}`)

            // Get info of stream-info and handle message deletions
            let getStreamInfo = client.channels.cache.get(post_channel_id)
            await getStreamInfo.messages
              .fetch({ limit: 30 })
              .then((collected) => {
                collected.forEach((msg) => {
                  msg.delete()
                })
              })
              .catch((error) => console.log(error))
          }
        }

        prevGame = gameId

        // if prevSteam and first call is true run embed with @everyone
        if (!prevStream && firstCall) {
          const token = await getToken()
          const { access_token } = token

          // Finding the channel
          let findChannel = client.channels.cache.find(
            (ch) => ch.name === post_channel
          )

          let streamInfo = findChannel.id

          // setting activity
          client.user
            .setActivity('twitch ❤️', {
              type: 'STREAMING',
              url: 'https://www.twitch.tv/tastejase',
            })
            .then((presence) =>
              console.log(`Activity set to ${presence.activities[0].name}`)
            )
            .catch(console.error)

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

          const [game] = await getGame(gameId).catch(console.error)

          let msg = liveEmbed(stream, game.name)

          client.channels.cache.get(`${streamInfo}`).send(detect_text, msg)

          client.channels.cache
            .get(`${streamInfo}`)
            .send(`Come watch! ${twitch_url}`)
          firstCall = false
        }
      } else {
        // setting activity
        client.user
          .setActivity('everybody', {
            type: 'WATCHING',
          })
          .then((presence) =>
            console.log(`Activity set to ${presence.activities[0].name}`)
          )
          .catch(console.error)

        // Finding the channel
        let findChannel = client.channels.cache.find(
          (ch) => ch.name === post_channel
        )

        let streamInfo = findChannel.id

        const user = await twitchClient.helix.users.getUserById(userId)
        client.channels.cache
          .get(`${streamInfo}`)
          .send(`${user.displayName} just went offline.`)

        // Get info of stream-info and handle message deletions
        let getStreamInfo = client.channels.cache.get(post_channel_id)
        await getStreamInfo.messages
          .fetch({ limit: 30 })
          .then((collected) => {
            collected.forEach((msg) => {
              msg.delete()
            })
          })
          .catch((error) => console.log(error))
      }
      prevStream = stream
    }
  )
  return subscription
}

module.exports = checkStream
