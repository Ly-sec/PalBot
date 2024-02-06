const { SlashCommandBuilder } = require("discord.js");
const { rconSave } = require("../../../Functions/rconCommands");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("save")
    .setDescription("Saves the server."),

  async execute(interaction) {
    const { member } = interaction;

    await rconSave(member, interaction);
  },
};
