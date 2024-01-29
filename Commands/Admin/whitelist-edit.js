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
        .setName("whitelist-edit")
        .setDescription("Adds/removes user to/from the whitelist.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Adds user to the whitelist.")
                .addStringOption((option) =>
                    option.setName("steamid").setDescription("The SteamID").setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("Removes user from the whitelist.")
                .addStringOption((option) =>
                    option.setName("steamid").setDescription("The SteamID").setRequired(true)
                )
        ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const { options, member, guild } = interaction;
        const subCommand = interaction.options.getSubcommand();
        const logEmbed = new EmbedBuilder();

        const whitelistFilePath = './whitelist.txt';

        switch (subCommand) {
            case "add":
                {
                    const role = guild.roles.cache.find(role => role.name === config.rcon_role);
                    if (!role) {
                        return interaction.reply('You did not set up your config.json correctly!')
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

                    const steamIdToAdd = options.getString("steamid");

                    // Read the current whitelist
                    const currentWhitelist = (await fs.readFile(whitelistFilePath, 'utf-8')).split("\n");

                    // Check if the SteamID is already in the whitelist
                    if (!currentWhitelist.includes(steamIdToAdd)) {
                        // Add the SteamID to the whitelist
                        currentWhitelist.push(steamIdToAdd);

                        // Write the updated whitelist back to the file
                        await fs.writeFile(whitelistFilePath, currentWhitelist.join("\n"));

                        logEmbed
                            .setColor("Green")
                            .setDescription(
                                `**Added SteamID ${steamIdToAdd} to the whitelist.**`
                            );
                    } else {
                        logEmbed
                            .setColor("Red")
                            .setDescription(
                                `**SteamID ${steamIdToAdd} is already in the whitelist.**`
                            );
                    }

                    return interaction.reply({ embeds: [logEmbed], ephemeral: true });
                }
                break;
            case "remove":
                {
                    const role = guild.roles.cache.find(role => role.name === config.rcon_role);
                    if (!role) {
                        return interaction.reply('You did not set up your config.json correctly!')
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

                    const steamIdToRemove = options.getString("steamid");

                    // Read the current whitelist
                    let currentWhitelist = (await fs.readFile(whitelistFilePath, 'utf-8')).split("\n");

                    // Check if the SteamID is in the whitelist
                    if (currentWhitelist.includes(steamIdToRemove)) {
                        // Remove the SteamID from the whitelist
                        currentWhitelist = currentWhitelist.filter(id => id !== steamIdToRemove);

                        // Write the updated whitelist back to the file
                        await fs.writeFile(whitelistFilePath, currentWhitelist.join("\n"));

                        logEmbed
                            .setColor("Green")
                            .setDescription(
                                `**Removed SteamID ${steamIdToRemove} from the whitelist.**`
                            );
                    } else {
                        logEmbed
                            .setColor("Red")
                            .setDescription(
                                `**SteamID ${steamIdToRemove} is not in the whitelist.**`
                            );
                    }

                    return interaction.reply({ embeds: [logEmbed], ephemeral: true });
                }
        }
    }
};