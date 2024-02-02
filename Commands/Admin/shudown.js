const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const rconHandler = require("../../Functions/rconHandler");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Saves the server.")
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

  async execute(interaction) {
    const { member, options } = interaction;

    try {
      await rconHandler.connect();

      if (member.roles.cache.some(r => r.name === config.rcon_role)) {
        const time = options.getString("time");
        const text = options.getString("text") || ""; // Default to an empty string if no text provided

        const response = await rconHandler.sendCommand(`ShutDown ${time} ${text.replace(/ /g, "_")}`);
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
    } finally {
      rconHandler.disconnect();
    }
  },
};
