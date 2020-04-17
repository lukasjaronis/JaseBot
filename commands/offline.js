const client = require("../index");
const { prefix } = require("../config.json");

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  // Fetching the role and awaiting the promise
  let JaseRole = await message.guild.roles.fetch("700754612138934502");
  // Getting the roles id
  let getID = JaseRole.id;

  if (command === "offline") {
    if (message.member.roles.cache.has(getID)) {
      client.user.setActivity(`the den`, {
        type: "WATCHING",
      });
    } else {
      message.author.send("Sorry, you don't have permissions for that!");
    }
  } else {
    message.channel.send("You cant do that");
  }
});
