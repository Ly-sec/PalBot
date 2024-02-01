const { loadCommands } = require("../../Handlers/commandHandler");
const fs = require('fs').promises;

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("The client is online");

    loadCommands(client);
  },
};
