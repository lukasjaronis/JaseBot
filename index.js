const fs = require("fs");
const Discord = require("discord.js");
const { config } = require("dotenv");
const { prefix } = require("./config.json");

// ENV
config({
  path: __dirname + "/.env",
});

const client = new Discord.Client({
  disableEveryone: false,
});

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

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send(
      `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
    );
  }
});

client.login(process.env.TOKEN);
