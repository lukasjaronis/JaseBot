const Discord = require("discord.js");

// message embed for kick command
const kickEmbed = (description, setColor, user, reason) => {
     return new Discord.MessageEmbed()
    .setDescription(description)
    .setColor(setColor)
    .addField(`Kicked User`, user)
    .addField(`Reason`, reason)
    .setThumbnail('https://media0.giphy.com/media/gjfbSsz2EnNMLpRyqb/giphy.gif?cid=ecf05e47fbef57d1f1ddc3d684080c0391f8dfb3753a2aad&rid=giphy.gif')
    .setTimestamp()
}

// message embed for ban command
const banEmbed = (description, setColor, user, reason) => {
  return new Discord.MessageEmbed()
 .setDescription(description)
 .setColor(setColor)
 .addField(`Banned User`, user)
 .addField(`Reason`, reason)
 .setThumbnail('https://media1.giphy.com/media/BT4ygwV9vgwAU/giphy.gif?cid=ecf05e47ce1f48adda4cff78d01d1438352cf8c709ccadf6&rid=giphy.gif')
 .setTimestamp()
}




  module.exports = (kickEmbed, banEmbed)