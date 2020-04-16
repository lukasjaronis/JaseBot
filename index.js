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
    status: "online",
    game: {
      name: "Creating chemicals...",
      type: "WATCHING",
    },
  });
});

console.log(process.env.TOKEN);

client.login(process.env.TOKEN);
