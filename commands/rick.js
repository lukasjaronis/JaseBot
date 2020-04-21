const client = require("../index");
const { prefix } = require("../config.json");
const {rickEmbed} = require('../utils/messageEmbeds');
const accessCheck = require('../permissions');

client.on("message", async (message) => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        let adminCheck = accessCheck(message)
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === "rick") {
            if (adminCheck) {
               let msg = rickEmbed();
               message.channel.send(msg)
            } else {
                return message.reply("you don't have permission!")
            }
        }
    }
    catch (err) {
        console.log(err)
    }
});