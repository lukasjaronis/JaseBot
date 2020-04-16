const { Client } = require("discord.js");
require("dotenv").config();

const client = new Client({});

client.on("Ready", () => {
  console.log(`Creating chemicals... ${bot.user.username}`);
});

client.login(process.env.TOKEN);
