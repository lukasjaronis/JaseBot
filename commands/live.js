const client = require("../index");
const { prefix } = require("../config.json");

client.on("message", async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let adminCheck = accessCheck(message)

    // Finding the channel
    let findChannel = client.channels.cache.find((ch) => ch.name === "stream-info");
    let streamInfo = findChannel.id;

    if (command === "live") {
      if (adminCheck) {
        client.user
          .setActivity(`twitch`, {
            type: "STREAMING",
            url: "https://www.twitch.tv/tastejase",
          })
          .then((presence) =>
            console.log(`Activity set to ${presence.activities[0].name}`)
          )
          .catch(console.error);
        client.channels.cache
          .get(`${streamInfo}`)
          .send("@everyone Jason is live! https://www.twitch.tv/tastejase");

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
          }).catch(error => console.log(error => console.log(`live cmd, fetchMSG error`, error)));

        // Mapping it out, slicing it up, and shifting it out of the array
        fetchMsgMap = fetchMsg.map((item) => {
          let sliced = item.content.slice(prefix.length).split(/ +/);
          let shifted = sliced.shift().toLowerCase();
          return shifted;
        });

        // Filter through them
        let filterEM = fetchMsgMap.filter((item) => item === "live");
        console.log(filterEM);

        // Finally delete these messages
        message.delete({ timeout: 800 });

        // Get info of stream-info and handle message deletions
        let getStreamInfo = client.channels.cache.get('700889883056799854')
        await getStreamInfo.messages.fetch({ limit: 30 }).then(collected => {
          collected.forEach(msg => {
            if (msg.content.startsWith('Jason')) {
              msg.delete()
            }
          })
        }).catch(error => console.log(`live cmd, getStreamInfo fetch error:`, error))

      } else {
        message.author.send("Sorry, you don't have permissions for that!");
        message.delete()
      }
    }
  }
  catch (err) {
    console.log(err)
  }
});
