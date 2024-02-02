const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const rconHandler = require("../../Functions/rconHandler");
const config = require("../../config.json");

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

  async execute(interaction) {
    const { options, member } = interaction;

    try {
      await rconHandler.connect();

      const text = options.getString("text");
      if (member.roles.cache.some(r => r.name === config.rcon_role)) {
        const response = await rconHandler.sendCommand(`Broadcast ${text.replace(/ /g, "_")}`);
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
      rconHandler.disconnect();
    }
  },
};
