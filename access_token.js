const { config } = require('dotenv')

// ENV
config({
  path: __dirname + '/.env',
})

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

module.exports = { access_token }
