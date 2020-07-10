const Discord = require('discord.js')

// message embed for kick command
const kickEmbed = (description, setColor, user, reason) => {
  return new Discord.MessageEmbed()
    .setDescription(description)
    .setColor(setColor)
    .addField(`Kicked User`, user)
    .addField(`Reason`, reason)
    .setThumbnail(
      'https://media0.giphy.com/media/gjfbSsz2EnNMLpRyqb/giphy.gif?cid=ecf05e47fbef57d1f1ddc3d684080c0391f8dfb3753a2aad&rid=giphy.gif'
    )
    .setTimestamp()
}

// message embed for ban command
const banEmbed = (description, setColor, user, reason, days) => {
  return new Discord.MessageEmbed()
    .setDescription(description)
    .setColor(setColor)
    .addField(`Banned User`, user)
    .addField(`Reason`, reason)
    .addField('Days', days)
    .setThumbnail(
      'https://media1.giphy.com/media/BT4ygwV9vgwAU/giphy.gif?cid=ecf05e47ce1f48adda4cff78d01d1438352cf8c709ccadf6&rid=giphy.gif'
    )
    .setTimestamp()
}

// message embed for rick command
const cmdsEmbed = () => {
  return new Discord.MessageEmbed()
    .setTitle('Bot Commands')
    .setDescription('Rick has the following commands.')
    .setColor('#87E5FF')
    .addFields([
      {
        name: '**Adminstrator**',
        value:
          '`!mute @user time` - Mutes user. ~ Time: 1d, 1h, 10s, etc. (https://www.npmjs.com/package/ms)',
        inline: false,
      },
      {
        name: '**Adminstrator**',
        value: '`!kick @user reason` - Kicks user.',
        inline: false,
      },
      {
        name: '**Adminstrator**',
        value:
          '`!ban @user days reason` - Ban user. Days must be whole numbers and it goes by days. Example: !ban @lukas 3 abuse (This would be a 3 day ban)',
        inline: false,
      },
      {
        name: '**Adminstrator**',
        value:
          '`!activity activityName activityType` - Sets the bots activity. ActivityName MUST be in quotes. Example: !activity "walking the dog" playing ~ For activity you can only do playing, streaming, listening, or watching for the type.',
        inline: false,
      },
      {
        name: '**Adminstrator**',
        value:
          '`!raffle raffleItem` - Creates a raffle with an appended emoji. Emoji is access to the raffle which will loop through users who reacted and pick a winner. You must use quotes for the item. Example: !raffle "discord nitro boost" ',
        inline: false,
      },
      {
        name: '**Adminstrator**',
        value: '`!rick` - Brings up available commands',
        inline: false,
      },
    ])
}

const liveEmbed = (stream, game) => {
  const unixTime = Math.round(new Date().getTime() / 1000)

  return new Discord.MessageEmbed()
    .setColor('#87E5FF')
    .setTitle('🚀 Jason is live! 🚀 ')
    .setDescription(stream.title)
    .addField('Playing ', game ? game : 'something i cannot detect :(')
    .setImage(
      `https://static-cdn.jtvnw.net/previews-ttv/live_user_tastejase-600x400.jpg?time=${unixTime}`
    )
    .setTimestamp()
}

module.exports = { kickEmbed, banEmbed, cmdsEmbed, liveEmbed }
