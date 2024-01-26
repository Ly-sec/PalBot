const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

const config = require("../../config.json")

var Rcon = require('rcon')
var conn = new Rcon(config.host, config.rcon_port, config.rcon_password);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rcon")
    .setDescription("Send different rcon commands.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("save")
        .setDescription("Saves the server.")
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("shutdown")
      .setDescription("Stops the server.")
      .addStringOption((option) =>
      option
        .setName("shutdowntime")
        .setDescription("How long until restart (in seconds)?")
        .setRequired(true)
    )
    .addStringOption((option) =>
    option
      .setName("shutdownmessage")
      .setDescription("What message do you want to send to the server?")
      .setRequired(true)
  )
  )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("broadcast")
        .setDescription("Sends text to server.")
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("What should it broadcast?")
            .setRequired(true)
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

    const role = guild.roles.cache.find(role => role.name === config.rcon_role);
    if (!role) {
      return interaction.reply('You did not setup your config.json correctly!')
    }
    
    conn.connect();
    switch (subCommand) {
      
      case "save":
        {
          if (member.roles.cache.some(r => r.name === config.rcon_role)){
            conn.on('auth', function() {
              console.log("Authed!");
              conn.send(`Save`);
            }).on('response', function(str) {
            console.log("Got response: " + str);
            }).on('error', function(err) {
              console.log("Error: " + err);
            }).on('end', function() {
              console.log("Connection closed");
              conn.disconnect();
            });
            logEmbed
            .setColor("Green")
            .setDescription(
              "**Saved the server!**"
            );
            return interaction.reply({ embeds: [logEmbed], ephemeral: true });
          } else {
            logEmbed
            .setColor("Red")
            .setDescription(
              "**You do not have the permissions to kick someone!**"
            );

          return interaction.reply({ embeds: [logEmbed], ephemeral: true });
          }
        }
      case "shutdown":
        {
          const sMessage = options.getString("shutdownmessage");
          const sTime = options.getString("shutdowntime");
          if (member.roles.cache.some(r => r.name === config.rcon_role)){
            conn.on('auth', function() {
              console.log("Authed!");
              conn.send(`Shutdown ${sTime} ${sMessage.replace(/ /g,"_")}`);
            }).on('response', function(str) {
            console.log("Got response: " + str);
            }).on('error', function(err) {
              console.log("Error: " + err);
            }).on('end', function() {
              console.log("Connection closed");
              conn.disconnect();
            });

            logEmbed
            .setColor("Green")
            .setDescription(
              `**Shutting off the server in ${sTime} seconds!**`
            );
            return interaction.reply({ embeds: [logEmbed], ephemeral: true });
          } else {
            logEmbed
            .setColor("Red")
            .setDescription(
              "**You do not have the permissions to kick someone!**"
            );

          return interaction.reply({ embeds: [logEmbed], ephemeral: true });
          }
        }
      case "broadcast":
        {
          const text = options.getString("text");
          if (member.roles.cache.some(r => r.name === config.rcon_role)){
            conn.on('auth', function() {
              console.log("Authed!");
              conn.send(`Broadcast ${text.replace(/ /g,"_")}`);
            }).on('response', function(str) {
            console.log("Got response: " + str);
            }).on('error', function(err) {
              console.log("Error: " + err);
            }).on('end', function() {
              console.log("Connection closed");
              conn.disconnect();
            });

            logEmbed
            .setColor("Green")
            .setDescription(
              `**Sent "${text.replace(/ /g,"_")}" to the server!**`
            );
            return interaction.reply({ embeds: [logEmbed], ephemeral: true });
          
          } else {
            logEmbed
            .setColor("Red")
            .setDescription(
              "**You do not have the permissions to kick someone!**"
            );

          return interaction.reply({ embeds: [logEmbed], ephemeral: true });
          }
        }
    }
  },
};
