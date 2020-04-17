module.exports = {
  name: "online",
  description: "Changing bots presence to streaming offline.",
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
