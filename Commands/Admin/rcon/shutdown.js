const { SlashCommandBuilder } = require("discord.js");
const { rconShutdown } = require("../../../Functions/rconCommands");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Initiates a server shutdown.")
    .addStringOption(option =>
      option
        .setName("time")
        .setDescription("Specify the shutdown delay in seconds.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("Message to the server.")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const { member, options } = interaction;
    const time = options.getString("time");
    const text = options.getString("text") || ""; // Default to an empty string if no text provided

    await rconShutdown(member, interaction, time, text);
  },
};
