const client = require("../index");
const { prefix } = require("../config.json");
const ms = require('ms');

client.on("message", async (message) => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        let adminRole = await message.guild.roles.fetch("700888529000988683").catch(error => console.log(`adminRole error: ${error}`));
        let getID = adminRole.id;

        // Fetching the role and awaiting the promise
        let mainRole = await message.guild.roles.fetch('700888461380550656').catch(error => console.log(`mainRole error: ${error}`));
        let muteRole = await message.guild.roles.fetch("700888264575418378").catch(error => console.log(`muteRole error: ${error}`));

        if (command === "mute") {
            if (message.member.roles.cache.has(getID)) {
                let person = message.guild.member(message.mentions.users.first())
                let classGuild = message.guild.member(message.mentions.members.first())
                let adminPermissionsCheck = classGuild.hasPermission("ADMINISTRATOR");

                // checking to see if tagged user has adminstrator permissions
                if (adminPermissionsCheck) {
                    return message.reply("You can't mute an adminstrator!")
                }

                // checking if the person is in our discord
                if (!person) {
                    return message.reply("sorry, I couldn't find that user")
                } else {
                    let time = args[1];

                    if (!time) {
                        return message.reply("You didn't specify a time!")
                    }

                    // removing the main role
                    person.roles.remove(mainRole)
                    // adding the mute role    
                    person.roles.add(muteRole)
                    message.channel.send("<@" + person.user.id + ">" + ` has been muted for. ${ms(ms(time))}`)


                    setTimeout(function () {
                        person.roles.add(mainRole);
                        person.roles.remove(muteRole);
                        message.channel.send("<@" + person.user.id + ">" + " has been unmuted.")
                    }, ms(time))
                }
            } else {
                message.reply('You do not have this permission!')
            }
        }
    }
    catch (err) {
        console.log(err)
    }
});