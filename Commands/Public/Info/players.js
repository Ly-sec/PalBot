const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { rconPlayers } = require("../../../Functions/rconCommands");
const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Fetches the current players on the server.'),

  async execute(interaction) {
    rconPlayers(interaction);
  }
};
