module.exports = {
  name: "online",
  description: "Changing bots presence to streaming LIVE.",
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
