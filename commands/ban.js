const client = require("../index");
const { prefix } = require("../config.json");
const banEmbed = require('../utils/messageEmbeds');

client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let adminRole = await message.guild.roles.fetch("700888529000988683");
    let botMechanicRole = await message.guild.roles.fetch("700888657976098847");
    let getBotMechanicID = botMechanicRole.id
    let getID = adminRole.id;

    if (command === "ban") {
        if (message.member.roles.cache.has(getID) || message.member.roles.cache.has(getBotMechanicID)) {
            let person = message.guild.member(message.mentions.users.first())
            let classGuild = message.guild.member(message.mentions.members.first())
            let adminPermissionsCheck = classGuild.hasPermission("ADMINISTRATOR");
    
            let reason = args[2]
            let days = parseInt(args[1])

            // checking to see if tagged user has adminstrator permissions
            if (adminPermissionsCheck) {
                return message.reply("You can't ban an adminstrator!")
            }
    
            if (!reason || !days) {
                message.reply("You have to provide a reason for the kick or the amount of days. [!ban @user days reason]")
                message.delete(msg)
            }
    
            // checking if the person is in our discord
            if (!person) {
                return message.reply("sorry, can't find that user!")
            } else {
               let msg = banEmbed('Ban', '#F2E6A7', person.user.tag, reason, days)
               message.guild.member(person).ban({ days: days, reason: `Reason: ${reason} | Days ${days}` })
               message.channel.send(msg)
            }
        } else {
            return message.reply("You can't do that!")
        }

    } 
  });
