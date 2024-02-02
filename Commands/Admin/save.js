const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const rconHandler = require("../../Functions/rconHandler");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("save")
    .setDescription("Saves the server."),

  async execute(interaction) {
    const { options, member } = interaction;

    try {
      await rconHandler.connect();
      if (member.roles.cache.some(r => r.name === config.rcon_role)) {
        const response = await rconHandler.sendCommand(`Save`);
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
      rconHandler.disconnect();
    }
  },
};
