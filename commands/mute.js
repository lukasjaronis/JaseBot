const client = require("../index");
const { prefix } = require("../config.json");
const ms = require('ms');

client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
  
      // Fetching the role and awaiting the promise
    let mainRole = await message.guild.roles.fetch('700888461380550656')
    let muteRole = await message.guild.roles.fetch("700888264575418378");
  

    if (command === "mute") {
        let person = message.guild.member(message.mentions.users.first())

        // checking if the person is in our discord
        if (!person) {
            return message.reply("sorry, I couldn't find that user")
        } else {
        let time = args[1];
        console.log(time)

        // removing the main role
        person.roles.remove(mainRole)
        // adding the mute role    
        person.roles.add(muteRole)
        message.channel.send("<@" + person.user.id + ">" + ` has been muted for. ${ms(ms(time))}`)

        if (!time) {
            return message.reply("You didn't specify a time!")
        }
        
        setTimeout(function() {
            person.roles.add(mainRole);
            person.roles.remove(muteRole);
            message.channel.send("<@" + person.user.id + ">" + " has been unmuted.")
        }, ms(time))

        }
    } 
  });