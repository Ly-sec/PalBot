const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

const config = require("../../../config.json")

module.exports = {

  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Fetches the palworld server informations.'),

  async execute(interaction) {

    const { GameDig } = await import('gamedig')

    GameDig.query({
      type: 'palworld',
      host: config.host,
      port: config.port,
      givenPortOnly: true
    }).then((state) => {
      const exampleEmbed = new EmbedBuilder()
        .setColor(0xfff200)
        .setTitle(`PalBot`)
        .addFields(
          { name: 'Server Name', value: "```" + `${state.name}` + "```",inline: true},
          { name: 'Server IP', value: "```" + `${config.host}` + "```",inline: true},
          { name: 'Server Port', value: "```" + `${config.port}` + "```",inline: true},
          { name: 'Players', value: "```" + `${state.raw.attributes.PLAYERS_l}/${state.raw.settings.maxPublicPlayers}` + "```", inline: true},
          { name: 'Days', value: "```" + `${state.raw.attributes.DAYS_l}` + "```", inline: true},
          { name: 'Last Restart', value: "```" + `${format_time(state.raw.attributes.CREATE_TIME_l)} (Server Time)` + "```", inline: true},
          { name: 'Password', value: "```" + `${state.raw.attributes.ISPASSWORD_b}` + "```", inline: true},
          { name: 'Version', value: "```" + `${state.raw.attributes.VERSION_s}` + "```", inline: true},
        )
        .setTimestamp()
        .setFooter({ text: 'Made by Lysec' })
        .setURL('https://github.com/Ly-sec/PalBot');

      interaction.reply({ embeds: [exampleEmbed] });
    }).catch((error) => {
      console.log(`Server is offline, error: ${error}`)
    })

  },
};

function format_time(s) {
  return new Date(s * 1e3).toISOString().slice(-13, -5);
}
