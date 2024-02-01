const { SlashCommandBuilder, EmbedBuilder } = require("discord.js"); // Assuming EmbedBuilder is correct for your version
const config = require("../../../config.json");
const { Rcon } = require("minecraft-rcon-client");

const rconClient = new Rcon({
    host: config.host,
    port: config.rcon_port,
    password: config.rcon_password
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players')
        .setDescription('Fetches the current players on the server..'),

    async execute(interaction) {
        try {
            // Connect to the Palworld server
            await rconClient.connect();

            // Send the ShowPlayers command
            const response = await rconClient.send("ShowPlayers");

            // Parse the player list CSV data
            const playerList = response.split("\n").slice(1); // Ignore the header

            // Create an EmbedBuilder
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Current Players on the Server');

            // Extract and add player information to the embed
            for (const playerData of playerList) {
                // Check if playerData is not empty and has enough data
                if (playerData && playerData.trim() !== "" && playerData.includes(',')) {
                    const [name, playerID, steamID] = playerData.split(',');
                    if (name && playerID && steamID) {
                        embed.addFields(
                            { name: 'Name', value: "```" + `${name.trim()}` + "```", inline: true },
                            { name: 'Player ID', value: "```" + `${playerID.trim()}` + "```", inline: true },
                            { name: 'Steam ID', value: "```" + `${steamID.trim()}` + "```", inline: true },
                        );
                    }
                }
            }

            // Send the embed to the Discord channel
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(`Error executing command: ${error.message}`);
            await interaction.reply('An error occurred while fetching player list.');
        } finally {
            // Always close the RCON connection when done
            if (rconClient.socket) {
                rconClient.disconnect();
            }
        }
    }
};
