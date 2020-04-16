const { Client } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({});

config({
  path: __dirname + "/.env",
});

client.on("Ready", () => {
  console.log(`Creating chemicals... ${bot.user.username}`);
});

client.login(process.env.TOKEN);
