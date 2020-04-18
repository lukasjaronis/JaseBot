const Discord = require("discord.js");

const kickEmbed = (description, setColor, user, reason) => {
     return new Discord.MessageEmbed()
    .setDescription(description)
    .setColor(setColor)
    .addField(`Kicked User`, user)
    .addField(`Reason`, reason)
    .setThumbnail('https://media0.giphy.com/media/gjfbSsz2EnNMLpRyqb/giphy.gif?cid=ecf05e47fbef57d1f1ddc3d684080c0391f8dfb3753a2aad&rid=giphy.gif')
    .setTimestamp()
}

  module.exports = kickEmbed