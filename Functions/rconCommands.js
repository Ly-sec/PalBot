const { ActivityType, EmbedBuilder } = require("discord.js");
const fs = require('fs').promises;
const { connect, disconnect, sendCommand } = require("../Handlers/rconHandler");
const config = require("../config.json");

const cleanId = (str) => str.replace(/\D/g, '').trim();

// Utility Functions
const readConfigFile = async () => {
  const configFilePath = require.resolve("../config.json");
  return JSON.parse(await fs.readFile(configFilePath, 'utf-8'));
};

const getSteamIdsFromResponse = (response) => {
  const steamIdRegex = /\b(\d{17})\b/g;
  return (response.match(steamIdRegex) || []).map(cleanId).map(String);
};

const showPlayers = async (client) => {
  try {
    const rconClient = await connect();
    try {
      const response = await sendCommand(rconClient, "ShowPlayers");
      const steamIds = getSteamIdsFromResponse(response);

      const activityText = steamIds.length === 0 ? `0 Players` : `${steamIds.length} Players`;
      client.user.setActivity(activityText, { type: ActivityType.Watching });
    } catch (err) {
      console.log(`Error: ${err}`);
    } finally {
      disconnect(rconClient);
    }
  } catch (err) {
    console.log(`Error reading config file: ${err}`);
  }
};

const whitelistCheck = async (client) => {
  try {
    const config = await readConfigFile();
    if (config.whitelist_enabled === true) {
      const rconClient = await connect();
      try {
        const response = await sendCommand(rconClient, "ShowPlayers");
        const steamIds = getSteamIdsFromResponse(response);
        const whitelistArray = (await fs.readFile('whitelist.txt', 'utf-8'))
          .split("\n")
          .map(cleanId)
          .filter(Boolean)
          .map(String);

        const nonMatchingIds = steamIds.filter(obj => !whitelistArray.includes(obj.trim()));

        if (nonMatchingIds.length > 0) {
          console.log("Not all steamIds from steamIds match with whitelistArray.");
          console.log("Non-matching steamIds:", nonMatchingIds);
          for (const nonMatchingNumber of nonMatchingIds) {
            await sendCommand(rconClient, `KickPlayer ${nonMatchingNumber}`);
            console.log(`Kicking player with non-matching steamId: ${nonMatchingNumber}`);
          }
        }
      } catch (err) {
        console.log(`Error: ${err}`);
      } finally {
        disconnect(rconClient);
      }
    } else {
      console.log("Whitelist is not enabled. Skipping whitelist check.");
    }
  } catch (err) {
    console.log(`Error reading config file: ${err}`);
  }
};

const rconSave = async (member, interaction) => {
  let rconClient;
  try {
    rconClient = await connect();
    if (member.roles.cache.some(role => role.name === config.rcon_role)) {
      const response = await sendCommand(rconClient, `Save`);
      console.log(response);

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Saved the server.")
        .addFields(
          { name: "Response", value: "```" + response + "```" }
        );

      interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply("No permission!");
    }
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    await interaction.reply(`Error executing command: ${error.message}`);
  } finally {
    if (rconClient) {
      disconnect(rconClient);
    }
  }
};

const rconBroadcast = async (member, interaction, text) => {
  let rconClient;
  try {
    rconClient = await connect();
    if (member.roles.cache.some(role => role.name === config.rcon_role)) {
      const response = await sendCommand(rconClient, `Broadcast ${text.replace(/ /g, "_")}`);
      console.log(response);

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Broadcast Successful")
        .addFields(
          { name: "Response", value: "```" + response + "```" }
        );

      interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply("No permission!");
    }
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    await interaction.reply(`Error executing command: ${error.message}`);
  } finally {
    if (rconClient) {
      disconnect(rconClient);
    }
  }
};

const rconShutdown = async (member, interaction, time, text) => {
  let rconClient;
  try {
    rconClient = await connect();
    if (member.roles.cache.some(role => role.name === config.rcon_role)) {
      const response = await sendCommand(rconClient, `ShutDown ${time} ${text.replace(/ /g, "_")}`);
      console.log(response);

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Server shutdown initiated.")
        .addFields(
          { name: "Response", value: "```" + response + "```" }
        );

      interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply("No permission!");
    }
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    await interaction.reply(`Error executing command: ${error.message}`);
  } finally {
    if (rconClient) {
      disconnect(rconClient);
    }
  }
};

const rconPlayers = async (interaction) => {
  let rconClient;
  try {
    rconClient = await connect();

    const response = await sendCommand(rconClient, `ShowPlayers`);

    const playersDataWithoutHeaders = response.replace(/^name,playeruid,steamid\s+/i, '');
    const sanitizedResponse = playersDataWithoutHeaders.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200F\uFEFF]|[^\x20-\x7E\u{4E00}-\u{9FFF}\u{3040}-\u{309F}\u{30A0}-\u{30FF}\u{AC00}-\u{D7AF}\u{0400}-\u{04FF}\u{0E00}-\u{0E7F}]/ug, '')
    const playerList = sanitizedResponse.split("\n");

    console.log(playerList)
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Current Players on the Server');

    let names = "";
    let playerIDs = "";
    let steamIDs = "";
    let hasPlayers = false;

    for (const playerData of playerList) {
      if (playerData && playerData.trim() !== "" && playerData.includes(',')) {
        const [name, playerID, steamID] = playerData.split(',');
        if (name && playerID && steamID) {
          names += `${name.trim()}\n`;
          playerIDs += `${playerID.trim()}\n`;
          steamIDs += `${steamID.trim()}\n`;
          hasPlayers = true;
        }
      }
    }

    if (hasPlayers) {
      embed.addFields(
        { name: 'Names', value: "```" + names + "```", inline: true },
        { name: 'Player IDs', value: "```" + playerIDs + "```", inline: true },
        { name: 'Steam IDs', value: "```" + steamIDs + "```", inline: true }
      );
    } else {
      embed.setDescription("No players online.");
    }

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    await interaction.reply(`Error executing command: ${error.message}`);
  } finally {
    if (rconClient) {
      disconnect(rconClient);
    }
  }
}


module.exports = {
  showPlayers,
  whitelistCheck,
  rconSave,
  rconBroadcast,
  rconShutdown,
  rconPlayers
};
