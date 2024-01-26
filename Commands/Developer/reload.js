const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { loadEvents } = require("../../Handlers/eventHandler");
const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload your commands / events.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) =>
      options.setName("events").setDescription("Reload your events.")
    )
    .addSubcommand((options) =>
      options.setName("commands").setDescription("Reload your commands.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {*Client} client
   */
  execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "events":
        {
          for (const [key, value] of client.events)
            client.removeListener(`${key}`, value, true);
          loadEvents(client);
          interaction.reply({
            content: "Reloaded events",
            ephemeral: true,
          });
        }
        break;
      case "commands":
        {
          loadCommands(client);
          interaction.reply({
            content: "Reloaded commands",
            ephemeral: true,
          });
        }
        break;
    }
  },
};
