const client = require("../index");
const { prefix } = require("../config.json");
const {banEmbed} = require('../utils/messageEmbeds');
const accessCheck = require('../permissions');

client.on("message", async (message) => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        let adminCheck = accessCheck(message)

        if (command === "ban") {
            if (adminCheck) {
                let person = message.guild.member(message.mentions.users.first())
                let classGuild = message.guild.member(message.mentions.members.first())
                let adminPermissionsCheck = classGuild.hasPermission("ADMINISTRATOR");

                let reason = args[2]
                let days = parseInt(args[1])

                // checking to see if tagged user has adminstrator permissions
                if (adminPermissionsCheck) {
                    return message.reply("you can't ban an adminstrator!")
                }

                if (!reason || !days) {
                    message.author.send(`If you're trying to ban ${person.user.tag}, you have to provide a reason for the ban or the amount of days. [!ban @user days reason] [!ban @user 1 rude] where 1 = 1 day`)
                    message.delete()
                }

                // checking if the person is in our discord
                if (!person) {
                    return message.reply("sorry, can't find that user!")
                } else {
                    let msg = banEmbed('Ban', '#9A0191', person.user.tag, reason, days)
                    message.guild.member(person).ban({ days: days, reason: `Reason: ${reason} | Days ${days}` })
                    message.channel.send(msg)
                }
            } else {
                return message.reply("you don't have permission!")
            }

        }
    }
    catch (err) {
        console.log(err)
    }
});
