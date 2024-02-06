// Your main file (ready.js)
const { loadCommands } = require("../../Handlers/commandHandler");
const { showPlayers, whitelistCheck } = require("../../Functions/rconCommands");
const { whitelist_time } = require ("../../config.json")

module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
    console.log("The client is online");

    loadCommands(client);

    // Run it once so it doesn't take 2 minutes for the status to appear
    showPlayers(client);
    whitelistCheck(client);

    // Player count check, every 2 minutes
    setInterval(() => showPlayers(client), 2 * 60 * 1000);

    // Whitelist check, every 5 minutes
    const whitelist_interval = whitelist_time * 60 * 1000;
    setInterval(() => whitelistCheck(client), whitelist_interval);
  },
};
