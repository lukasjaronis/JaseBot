const fs = require('fs')
const axios = require('axios')
const Discord = require('discord.js')
const { config } = require('dotenv')
const client = new Discord.Client()
module.exports = client

// ENV
config({
  path: __dirname + '/.env',
})

async function getAccessToken() {
  try {
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

    if (access_token) {
      console.log(access_token, 'acc')
      const url = 'https://api.twitch.tv/helix/users?login=tastejase'

      const options = {
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'Client-Id': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${access_token}`,
        },
        url,
      }

      const { data } = await axios(options)
      const { type } = data

      if (type) {
        console.log('jason is live')
      } else {
        console.log('jason is not live')
      }
    }
  } catch (error) {
    console.log(error)
  }
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

getAccessToken()

client.login(process.env.TOKEN)
