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

      for (const playerData of playerList) {
        if (playerData && playerData.trim() !== "" && playerData.includes(',')) {
          const [name, playerID, steamID] = playerData.split(',');
          if (name && playerID && steamID) {
            embed.addFields(
              { name: 'Name', value: "```" + `${name.trim()}` + "```", inline: true },
              { name: 'Player ID', value: "```" + `${playerID.trim()}` + "```", inline: true },
              { name: 'Steam ID', value: "```" + `${steamID.trim()}` + "```", inline: true }
            );
          }
        }
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
