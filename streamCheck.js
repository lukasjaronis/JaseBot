const TwitchClient = require('twitch').default
const WebHookListener = require('twitch-webhooks').default

async function streamCheck() {
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
    hostName: '64.227.3.188',
    port: 8090,
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

module.exports = { streamCheck }
