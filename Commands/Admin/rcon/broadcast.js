const { SlashCommandBuilder } = require("discord.js");
const { rconBroadcast } = require("../../../Functions/rconCommands");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("Broadcast a message to the server.")
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("What should it broadcast?")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const { options, member } = interaction;
    const text = options.getString("text");

    await rconBroadcast(member, interaction, text);
  },
};