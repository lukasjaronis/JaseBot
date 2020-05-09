const client = require("../index");
const { prefix } = require("../config.json");
const accessCheck = require("../permissions");

client.on("message", async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Slices off prefix length
    const args = message.content.slice(prefix.length).split(/ "|" | “|” /g);
    const command = args.shift().toLowerCase();
    let adminCheck = accessCheck(message);
    // first argument
    let activityName = args[0];
    // second argument
    let activityType = args[1];

    let toUpperCaseType;
    if (activityType) {
      toUpperCaseType = activityType.toUpperCase();
    } else {
      console.log("ActivityType was not present most likely for activity.js");
    }

    if (command === "activity") {
      if (adminCheck) {
        client.user
          .setActivity(`${activityName}`, { type: `${toUpperCaseType}` })
          .then((presence) =>
            console.log(`Activity set to ${presence.activities[0].name}`)
          )
          .catch(console.error);

        if (!activityName || !activityType) {
          message.delete();
          message.author.send(
            'You need to include the activity or the type with the !activity command! [!activity activity type] [!activity playing nextflix] where the bots activity would be "Playing netflix". https://discord.js.org/#/docs/main/stable/typedef/ActivityType'
          );
        }

        // deletes the command right after
        message.delete();
      } else {
        message.author.send("Sorry, you don't have permissions for that!");
        message.delete();
      }
    }
  } catch (err) {
    console.log(err);
  }
});
