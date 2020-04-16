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

client.on("message", async (message) => {
  console.log(`${message.author.user} said ${message.content}`);
});

client.login("NzAwNDYxNTY4ODkwMjQxMDM1.XpjcDA.snfenoOOvwRxqrn65TejYg0jB2A");
