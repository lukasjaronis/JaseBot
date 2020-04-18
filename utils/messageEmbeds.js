const Discord = require("discord.js");

const kickEmbed = (description, setColor, user, reason) => {
     return new Discord.MessageEmbed()
    .setDescription(description)
    .setColor(setColor)
    .addField(`Kicked User`, user)
    .addField(`Reason`, reason)
    .setThumbnail('https://media1.giphy.com/media/3o7WTpglMq3tlsJb9K/giphy.gif?cid=ecf05e47adb36e11e3c94d0454cac2b0cb98cceb6ed76d35&rid=giphy.gif')
    .setTimestamp()
}

  module.exports = kickEmbed