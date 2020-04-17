const { Client } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
  disableEveryone: true,
});

config({
  path: __dirname + "/.env",
});

client.on("ready", () => {
  console.log(`${client.user.username} has spawned!`);

  client.user.setPresence({
    game: {
      name: "Developing",
      type: "STREAMING",
      url: "https://www.twitch.tv/tastejase",
    },
    status: "busy",
  });
});

client.on("message", async (message) => {
  console.log(`${message.author.username} said ${message.content}`);
});

client.login(process.env.TOKEN);
