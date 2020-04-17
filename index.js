const { Client } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
  disableEveryone: true,
});

config({
  path: __dirname + "/.env",
});

client.on("ready", () => {
  client.user.setActivity("my code", {
    type: "STREAMING",
    url: "https://www.twitch.tv/tastejase",
  });
});

client.on("message", async (message) => {
  console.log(`${message.author.username} said ${message.content}`);
});

client.login(process.env.TOKEN);
