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
    .setDescription('The assistant has the following commands.')
    .setColor('#87E5FF')
    .addFields([
      {
        name: '**Adminstrator**',
        value:
          '`!forcelive` - Sends a notifcation to everybody in #stream-info, sets the bots activity to streaming with your twitch linked, and deletes the command shortly after.',
        inline: false,
      },
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
        value: '`!cmds` - Brings up available commands',
        inline: false,
      },
    ])
}

const liveEmbed = (data, game) => {
  const unixTime = Math.round(new Date().getTime() / 1000)

  return new Discord.MessageEmbed()
    .setColor('#87E5FF')
    .setTitle('Jason is live!  🚀🚀🚀 ')
    .setDescription(data.title)
    .addField('Playing ', game)
    .setImage(
      `https://static-cdn.jtvnw.net/previews-ttv/live_user_tastejase-600x400.jpg?time=${unixTime}`
    )
    .setTimestamp()
}

module.exports = { kickEmbed, banEmbed, cmdsEmbed, liveEmbed }
