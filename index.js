const { Client } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
  disableEveryone: true,
});

config({
  path: __dirname + "/.env",
});

client.on("ready", () => {
  client.user.setPresence({
    game: { name: "with discord.js" },
    status: "online",
  });
  console.log(`${client.user.username} is up and running!`);
});

client.on("message", async (message) => {
  console.log(`${message.author.username} said ${message.content}`);
});

client.login(process.env.TOKEN);
