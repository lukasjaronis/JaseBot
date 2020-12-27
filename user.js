// Dev vs Production

const hostname = 'ec2-3-14-65-207.us-east-2.compute.amazonaws.com'

// Development
// const twitch_user_id = '238273761'
// const post_channel = 'testing'
// const post_channel_id = '751244442446332054'
// const detect_text = 'lukas'
// const twitch_url = 'https://www.twitch.tv/touchmybitcoin'

// Production
const twitch_user_id = '61050409'
const post_channel = 'stream-info'
const post_channel_id = '700889883056799854'
const detect_text = '@everyone'
const twitch_url = 'https://www.twitch.tv/tastejase'

module.exports = {
  hostname,
  twitch_user_id,
  post_channel,
  detect_text,
  twitch_url,
  post_channel_id,
}