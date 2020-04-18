const fs = require("fs");
const Discord = require("discord.js");
const { config } = require("dotenv");
const client = new Discord.Client();
module.exports = client;

// ENV
config({
  path: __dirname + "/.env",
});

// turns commands folder into the command collection
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Bot online");
});

client.on('guildMemberAdd', async (guildMember) => {
  let regularRole = await guildMember.guild.roles.fetch('700888461380550656');
  guildMember.roles.add(regularRole.id, 'New Member')
})

client.login(process.env.TOKEN);
