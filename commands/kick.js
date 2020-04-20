const client = require("../index");
const { prefix } = require("../config.json");
const {kickEmbed} = require('../utils/messageEmbeds');
const accessCheck = require('../permissions');

client.on("message", async (message) => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        let adminCheck = accessCheck(message)
        console.log(adminCheck)

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();


        if (command === "kick") {
            if (adminCheck) {
                let person = message.guild.member(message.mentions.users.first())
                let classGuild = message.guild.member(message.mentions.members.first())
                let adminPermissionsCheck = classGuild.hasPermission("ADMINISTRATOR");

                let reason = args[1]

                // checking to see if tagged user has adminstrator permissions
                if (adminPermissionsCheck) {
                    return message.reply("You can't kick an adminstrator!")
                }

                if (!reason) {
                    return message.reply("You have to provide a reason for the kick!")
                }

                // checking if the person is in our discord
                if (!person) {
                    return message.reply("sorry, can't find that user!")
                } else {
                    let msg = kickEmbed('Kicked', '#F2E6A7', person.user.tag, reason)
                    message.guild.member(person).kick(msg)
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