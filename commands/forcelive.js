const client = require('../index')
const axios = require('axios')
const { prefix } = require('../config.json')
const accessCheck = require('../permissions')
const { liveEmbed } = require('../utils/messageEmbeds')

client.on('message', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    let adminCheck = accessCheck(message)

    // Finding the channel
    let findChannel = client.channels.cache.find((ch) => ch.name === 'testing')

    // stream-info

    let streamInfo = findChannel.id

    if (command === 'forcelive') {
      if (adminCheck) {
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
          const userId = '61050409'

          const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`

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

          if (data.data.length != 0) {
            // Setting the discord bot activity
            client.user
              .setActivity('twitch ❤️', {
                type: 'STREAMING',
                url: 'https://www.twitch.tv/tastejase',
              })
              .then((presence) =>
                console.log(`Activity set to ${presence.activities[0].name}`)
              )
              .catch(console.error)

            let gameName
            dataMap = data.data.map((item) => {
              // checking if game.id exists
              if (item.game_id) {
                async function getGame() {
                  const url = `https://api.twitch.tv/helix/games?id=${item.game_id}`

                  const options = {
                    method: 'get',
                    headers: {
                      'content-type': 'application/json',
                      'Client-Id': process.env.TWITCH_CLIENT_ID,
                      Authorization: `Bearer ${access_token}`,
                    },
                    url,
                  }

                  let gameName
                  axios(options).then((r) => {
                    console.log(r, 'rrrr')
                    const { data } = r
                    data.data.map((item) => {
                      gameName = item.name
                      return gameName
                    })
                  })
                  return gameName
                }
                gameName = getGame()
                return gameName
              }
            })

            let items
            data.data.map((item) => {
              items = item
              return items
            })

            if (items && gameName) {
              console.log(items, 'ITEMS')
              console.log(gameName, 'game name')
              // Setting the embed
              let msg = liveEmbed(items, gameName)
              // Sending message out to the stream info channel
              return client.channels.cache.get(`${streamInfo}`).send(msg)
            }
          } else {
            message.channel.send('Jason is currently not live.')
          }
        }
      } else {
        message.author.send("Sorry, you don't have permissions for that!")
        message.delete()
      }
    }
  } catch (err) {
    console.log(err)
  }
})
