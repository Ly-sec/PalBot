const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("The client is online");

    loadCommands(client);
  },
};
