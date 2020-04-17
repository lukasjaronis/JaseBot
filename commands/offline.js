const client = require("../index");
const { prefix } = require("../config.json");

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  // Fetching the role and awaiting the promise
  let JaseRole = await message.guild.roles.fetch("700754612138934502");
  let getID = JaseRole.id;

  // Finding the channel
  let findChannel = client.channels.cache.find((ch) => ch.name === "sauti");
  let sauti = findChannel.id;

  if (command === "offline") {
    if (message.member.roles.cache.has(getID)) {
      client.user
        .setActivity("the den", { type: "WATCHING" })
        .then((presence) =>
          console.log(`Activity set to ${presence.activities[0].name}`)
        )
        .catch(console.error);
      client.channels.cache.get(`${sauti}`).send("Jason stopped streaming.");

      // Getting user ID
      getUserID = message.member.user.id;
      // Getting the user object
      getUserObj = client.users.cache.get(getUserID);
      // Getting the channel ID of last message sent of USER
      getUserChannelID = getUserObj.lastMessageChannelID;
      // Getting text channel the message was sent from
      getLastMessageChannel = client.channels.cache.get(getUserChannelID);
      // fetching last 5 messages
      fetchMsg = await getLastMessageChannel.messages
        .fetch({ limit: 5 })
        .then((msg) => {
          return msg;
        });

      // Mapping it out, slicing it up, and shifting it out of the array
      fetchMsgMap = fetchMsg.map((item) => {
        let sliced = item.content.slice(prefix.length).split(/ +/);
        let shifted = sliced.shift().toLowerCase();
        return shifted;
      });

      // Filter through them
      let filterEM = fetchMsgMap.filter((item) => item === "offline");
      console.log(filterEM);

      // Finally delete these messages
      message.delete({ timeout: 800 });
    } else {
      message.channel.send("Sorry, you don't have permissions for that!");
    }
  }
});
