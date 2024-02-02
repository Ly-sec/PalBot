// rconHandler.js
const { Rcon } = require("minecraft-rcon-client");
const config = require("../config.json");

function createRconHandler() {
  const rconClient = new Rcon({
    host: config.host,
    port: config.rcon_port,
    password: config.rcon_password,
  });

  return {
    connect: async () => {
      try {
        await rconClient.connect();
        console.log("RCON Client connected")
      } catch (error) {
        console.error(`Error connecting to RCON: ${error.message}`);
        throw error;
      }
    },

    disconnect: () => {
      try {
        if (rconClient.socket) {
          rconClient.disconnect();
          console.log("RCON Client disconnected")
        }
      } catch (error) {
        console.error(`Error disconnecting from RCON: ${error.message}`);
      }
    },

    sendCommand: async (command) => {
      try {
        return await rconClient.send(command);
      } catch (error) {
        console.error(`Error sending command to RCON: ${error.message}`);
        throw error;
      }
    },
  };
}

module.exports = createRconHandler();
