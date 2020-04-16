const { Client } = require("discord.js");
require("dotenv").config();

const client = new Client({});

client.on("Ready", () => {
  console.log("I'm online");
});

client.login("NzAwNDYxNTY4ODkwMjQxMDM1.XpjcUQ.fSjECf9uR70Gn8ju-cgs_mM9aCY");
