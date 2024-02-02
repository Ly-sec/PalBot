const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const rconHandler = require("../../../Functions/rconHandler");
const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Fetches the current players on the server..'),

  async execute(interaction) {
    try {
      await rconHandler.connect();

      const response = await rconHandler.sendCommand("ShowPlayers");
      const playerList = response.split("\n").slice(1);

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
      rconHandler.disconnect();
    }
  }
};
