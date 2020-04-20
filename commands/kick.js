const client = require("../index");
const { prefix } = require("../config.json");
const {kickEmbed} = require('../utils/messageEmbeds');
const accessCheck = require('../permissions');

client.on("message", async (message) => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        let adminCheck = accessCheck(message)
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === "kick") {
            if (adminCheck) {
                // The person who is tagged
                let person = message.guild.member(message.mentions.users.first())
                // The tagged persons information
                let classGuild = message.guild.member(message.mentions.members.first())
                // Checking if the person has admin permissions
                let adminPermissionsCheck = classGuild.hasPermission("ADMINISTRATOR");

                // The second argument, !kick @user reason
                let reason = args[1]

                // checking to see if tagged user has adminstrator permissions
                if (adminPermissionsCheck) {
                    // if true
                    return message.reply("you can't kick an adminstrator!")
                }

                if (!reason) {
                    message.delete()
                    return message.author.send(`If you're trying to kick ${person.user.tag}, you have to provide a reason for the kick! [!kick @user reason]`)
                }

                // checking if the person is in our discord
                if (!person) {
                    return message.reply("sorry, can't find that user!")
                } else {
                    let msg = kickEmbed('Kicked', '#9A0191', person.user.tag, reason)
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