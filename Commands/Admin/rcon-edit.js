const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } = require("discord.js");

  const config = require("../../config.json")
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("edit-rcon")
      .setDescription("Adds/removes user to/from the rcon role.")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Adds user to the rcon role.")
          .addUserOption((option) =>
            option.setName("target").setDescription("The user").setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Removes user from the rcon role.")
          .addUserOption((option) =>
            option.setName("target").setDescription("The user").setRequired(true)
          )
      ),
  
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
  
    execute(interaction) {
      const { options, member, guild, channel } = interaction;
      const subCommand = interaction.options.getSubcommand();
      const logEmbed = new EmbedBuilder();
  
      switch (subCommand) {
        case "add":
          {
            const role = guild.roles.cache.find(role => role.name === config.rcon_role);
            if (!role) {
              return interaction.reply('You did not setup your config.json correctly!')
            }
            if (
              !member.permissions.has([PermissionsBitField.Flags.Administrator])
            ) {
              logEmbed
                .setColor("Red")
                .setDescription(
                  "**You do not have the permissions to use this command!**"
                );
  
              return interaction.reply({ embeds: [logEmbed], ephemeral: true });
            }
            const target = options.getMember("target");
            logEmbed
            .setColor("Green")
            .setDescription(
              `**Added the user to the rcon role.**`
            );
            target.roles.add(role);
          }
          break;
          case "remove":
            {
                const role = guild.roles.cache.find(role => role.name === config.rcon_role);
                if (!role) {
                  return interaction.reply('You did not setup your config.json correctly!')
                }
                if (
                  !member.permissions.has([PermissionsBitField.Flags.Administrator])
                ) {
                  logEmbed
                    .setColor("Red")
                    .setDescription(
                      "**You do not have the permissions to use this command!**"
                    );
      
                  return interaction.reply({ embeds: [logEmbed], ephemeral: true });
                }
                logEmbed
                .setColor("Green")
                .setDescription(
                  `**Removed the user from the rcon role.**`
                );
                  
              return interaction.reply({ embeds: [logEmbed], ephemeral: true });
          break;
      }
    }
  }
};
  