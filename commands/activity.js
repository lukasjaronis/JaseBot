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
    let activityName = args[0];
    let activityType = args[1];
    let toUpperCaseType = activityType.toUpperCase();

    if (command === "activity") {
      if (adminCheck) {
        // First making sure either or is present
        if (!activityName || !activityType) {
          message.delete();
          message.author.send(
            'You need to include the activity or the type with the !activity command! [!activity activity type] [!activity playing nextflix] where the bots activity would be "Playing netflix". https://discord.js.org/#/docs/main/stable/typedef/ActivityType'
          );
        }

        // Check for undefined
        if (toUpperCaseType === typeof undefined) {
          console.log(
            "Nothing has been typed in, which causes the undefined error for activity.js"
          );
        }

        // If they are, then set the bots activity
        client.user
          .setActivity(`${activityName}`, { type: `${toUpperCaseType}` })
          .then((presence) =>
            console.log(`Activity set to ${presence.activities[0].name}`)
          )
          .catch(console.error);

        // deletes the command right after
        message.delete();
      } else {
        message.author.send("Sorry, you don't have permissions for that!");
        message.delete();
      }
    }
  } catch (err) {
    console.log("The error is...", err);
  }
});
