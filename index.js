const fs = require('fs')
const Discord = require('discord.js')
const { config } = require('dotenv')
const client = new Discord.Client()

const { ApiClient } = require('twitch')
const { ClientCredentialsAuthProvider } = require('twitch-auth')
const { SimpleAdapter, WebHookListener } = require('twitch-webhooks')
const axios = require('axios')

module.exports = client

config({
  path: __dirname + '/.env',
})

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

const userId = twitch_user_id
const clientId = process.env.TWITCH_CLIENT_ID
const clientSecret = process.env.TWITCH_CLIENT_SECRET

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(__dirname + `/commands/${file}`)
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

// Twitch Listener

async function checkStream() {
  const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
  const apiClient = new ApiClient({ authProvider });
  
  const listener = new WebHookListener(apiClient, new SimpleAdapter({
    hostName: hostname,
    listenerPort: 8090
  }));
  
  await listener.listen()
  
  let prevStream = await apiClient.helix.streams.getStreamByUserId(userId)
  
  const subscription = await listener.subscribeToStreamChanges(userId, async (stream) => {
    if (stream) {
      const { gameId } = stream
  
      if (!prevStream) {
        // Live
        const token = await getToken()
        const { access_token } = token
  
        let findChannel = client.channels.cache.find(({ name }) => name == post_channel)
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
      }
    } else {
      // NO STREAM
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
  
      const user = await apiClient.helix.users.getUserById(userId)
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
    prevStream = stream;
  })
  return subscription
}

checkStream()


client.login(process.env.TOKEN)
