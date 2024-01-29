const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { Rcon } = require("minecraft-rcon-client"); // Change import to use minecraft-rcon-client
const config = require("../../config.json");

let rconClient; // Variable to store the Rcon client instance

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
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;
    const subCommand = interaction.options.getSubcommand();
    const role = guild.roles.cache.find((role) => role.name === config.rcon_role);

    if (!role) {
      return interaction.reply('You did not set up your config.json correctly!');
    }

    // Connect to Rcon only if not connected
    if (!rconClient || !rconClient.connected) {
      rconClient = await connectRcon();
    }

    switch (subCommand) {
      case "save": {
        if (member.roles.cache.some((r) => r.name === config.rcon_role)) {
          await rcon_command(`Save`);
          set_and_send_logEmbed(interaction, "**Saved the server!**", "Green");
        } else {
          set_and_send_logEmbed(interaction, "You do not have the permissions to use rcon command!", "Red");
        }
        break;
      }
      case "shutdown": {
        const sMessage = options.getString("shutdownmessage");
        const sTime = options.getString("shutdowntime");

        if (member.roles.cache.some((r) => r.name === config.rcon_role)) {
          await rcon_command(`Shutdown ${sTime} ${sMessage.replace(/ /g, "_")}`);
          set_and_send_logEmbed(interaction, `**Shutting off the server in ${sTime} seconds!**`, "Green");
        } else {
          set_and_send_logEmbed(interaction, "You do not have the permissions to use rcon command!", "Red");
        }
        break;
      }
      case "broadcast": {
        const text = options.getString("text");
        if (member.roles.cache.some((r) => r.name === config.rcon_role)) {
          await rcon_command(`Broadcast ${text.replace(/ /g, "_")}`);
          set_and_send_logEmbed(interaction, `**Sent "${text.replace(/ /g, "_")}" to the server!**`, "Green");
        } else {
          set_and_send_logEmbed(interaction, "You do not have the permissions to use rcon command!", "Red");
        }
        break;
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
function set_and_send_logEmbed(interaction, message, color) {
  const logEmbed = new EmbedBuilder();

  logEmbed.setColor(color).setDescription(message);

  return interaction.reply({ embeds: [logEmbed], ephemeral: true });
}

/**
 * Create a new Rcon connection
 * @returns {Promise<Rcon>}
 */
function connectRcon() {
  return new Promise((resolve, reject) => {
    const rconClient = new Rcon({
      host: config.host,
      port: config.rcon_port,
      password: config.rcon_password
    });

    rconClient
      .connect()
      .then(() => {
        console.log("Connected to Rcon!");
        resolve(rconClient);
      })
      .catch((err) => {
        console.error("Error connecting to Rcon:", err);
        reject(err);
      });
  });
}

/**
 * Send a command through the Rcon connection
 * @param {string} command
 * @returns {Promise<void>}
 */
async function rcon_command(command) {
  try {
    const response = await rconClient.send(command);
    console.log("Rcon command sent:", command);
    console.log("Rcon response:", response);
  } catch (err) {
    console.error("Error sending Rcon command:", err);
  }
}