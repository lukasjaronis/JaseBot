const { Client } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
  disableEveryone: true,
});

config({
  path: __dirname + "/.env",
});

client.on("Ready", () => {
  console.log(`Creating chemicals... ${bot.user.username}`);
});

console.log(process.env.TOKEN);

client.login(process.env.TOKEN);
