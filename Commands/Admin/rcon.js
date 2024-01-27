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

    const role = guild.roles.cache.find(role => role.name === config.rcon_role);
    if (!role) {
      return interaction.reply('You did not setup your config.json correctly!')
    }
    
    conn.connect();
    switch (subCommand) {
      
      case "save":
        {
          if (member.roles.cache.some(r => r.name === config.rcon_role)){
            rcon_command(`Save`);
            set_and_send_logEmbed(interaction, "**Saved the server!**", "Green");
            break;
          } else {
            set_and_send_logEmbed(interaction, "You do not have the permissions to use rcon command!", "Red");
            break;
          }
        }
      case "shutdown":
        {
          const sMessage = options.getString("shutdownmessage");
          const sTime = options.getString("shutdowntime");

          if (member.roles.cache.some(r => r.name === config.rcon_role)){
            rcon_command(`Shutdown ${sTime} ${sMessage.replace(/ /g,"_")}`);
            set_and_send_logEmbed(interaction, `**Shutting off the server in ${sTime} seconds!**`, "Green");
            break;
          } else {
            set_and_send_logEmbed(interaction, "You do not have the permissions to use rcon command!", "Red");
            break;
          }
        }
      case "broadcast":
        {
          const text = options.getString("text");
          if (member.roles.cache.some(r => r.name === config.rcon_role)){
            rcon_command(`Broadcast ${text.replace(/ /g,"_")}`);
            set_and_send_logEmbed(interaction, `**Sent "${text.replace(/ /g,"_")}" to the server!**`, "Green");
            break;
          } else {
            set_and_send_logEmbed(interaction, "You do not have the permissions to use rcon command!", "Red");
            break;
          }
        }
    }
  },
};

/**
 * Make an embed with message and color settings
 * @param message
 * @param color
 * @returns {Promise<Message<BooleanCache<Cached>>> | Promise<InteractionResponse<BooleanCache<Cached>>>}
 */
function set_and_send_logEmbed(interaction, message, color)
{
  const logEmbed = new EmbedBuilder();

  logEmbed
      .setColor(color)
      .setDescription(
          message
      );

  return interaction.reply({ embeds: [logEmbed], ephemeral: true });
}

/**
 * Create a rcon command
 * @param command
 */
function rcon_command(command)
{
  conn.on('auth', function() {
    console.log("Authed!");
    conn.send(command);
  }).on('response', function(str) {
    console.log("Got response: " + str);
  }).on('error', function(err) {
    console.log("Error: " + err);
  }).on('end', function() {
    console.log("Connection closed");
    conn.disconnect();
  });
}