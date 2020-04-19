const client = require("../index");
const { prefix } = require("../config.json");
const ms = require('ms');

client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let adminRole = await message.guild.roles.fetch("700888529000988683").catch(error => console.log(`adminRole error: ${error}`));
    let getID = adminRole.id;

    if (command === "prune") {
        if (message.member.roles.cache.has(getID)) {
            let person = message.guild.member(message.mentions.users.first())

            // checking if the person is in our discord
            if (!person) {
                return message.reply("sorry, I couldn't find that user")
            } else {
                let messageCount = args[1]
                if (!messageCount) {
                    return message.reply('You need to provide a message count!')
                }
                console.log(person.lastMessageChannelID)

            }
        } else {
            message.reply('You do not have this permission!')
        }
    }
}).catch(error => console.log(`prune command ${error}`));