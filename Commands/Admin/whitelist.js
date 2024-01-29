const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } = require("discord.js");
  const fs = require("fs").promises;
  const config = require("../../config.json");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("whitelist")
      .setDescription("Enable/disable the whitelist.")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("enable")
          .setDescription("Enable the whitelist.")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("disable")
          .setDescription("Disable the whitelist.")
      ),
  
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const { member, guild } = interaction;
      const subCommand = interaction.options.getSubcommand();
      const logEmbed = new EmbedBuilder();
  
      switch (subCommand) {
        case "enable": {
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
  
          config.whitelist_enabled = true;
  
          // Update the config file
          await fs.writeFile(
            "./config.json",
            JSON.stringify(config, null, 2),
            "utf-8"
          );
  
          logEmbed
            .setColor("Green")
            .setDescription("**Whitelist is now enabled.**");
  
          return interaction.reply({ embeds: [logEmbed], ephemeral: true });
        }
  
        case "disable": {
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
  
          config.whitelist_enabled = false;
  
          // Update the config file
          await fs.writeFile(
            "./config.json",
            JSON.stringify(config, null, 2),
            "utf-8"
          );
  
          logEmbed
            .setColor("Green")
            .setDescription("**Whitelist is now disabled.**");
  
          return interaction.reply({ embeds: [logEmbed], ephemeral: true });
        }
      }
    },
  };