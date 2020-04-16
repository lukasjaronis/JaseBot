const { Client } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
  disableEveryone: true,
});

config({
  path: __dirname + "/.env",
});

client.off("ready", () => {
  console.log(`${client.user.username} has spawned!`);

  client.user.setPresence({
    status: "online",
    game: {
      name: "Creating chemicals...",
      type: "WATCHING",
    },
  });
});

client.login(process.env.TOKEN);
