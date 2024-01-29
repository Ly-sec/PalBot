const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const {
  Guilds,
  GuildMembers,
  GuildMessages,
  GuildVoiceStates,
  MessageContent,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const { Rcon } = require('minecraft-rcon-client');
const fs = require('fs').promises;

const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildVoiceStates,
    MessageContent,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();

module.exports = client;

loadEvents(client);

client.login(client.config.token);

let intervalId;

const connectRcon = async () => {
    try {
        // Read the configuration file to check the whitelist status
        const config = JSON.parse(await fs.readFile('./config.json', 'utf-8'));

        // Check if the whitelist is enabled
        if (config.whitelist_enabled) {
            const client = new Rcon({
              port: config.rcon_port,
              host: config.host,
              password: config.rcon_password
            });

            try {
                await client.connect();

                const response = await client.send("ShowPlayers");
                const editedResponse = response.split(',').slice(3);

                const everyNth = (arr, nth) => arr.filter((_, i) => i % nth === nth - 1);
                const cleanNumber = str => str.replace(/\D/g, ''); // Helper function to remove non-numeric characters

                const steamIds = everyNth(editedResponse, 2)
                    .map(cleanNumber)
                    .filter(Boolean); // Remove empty strings

                console.log("Steam IDs:", steamIds);

                const whitelistArray = (await fs.readFile('whitelist.txt', 'utf-8'))
                    .split("\n")
                    .map(cleanNumber)
                    .filter(Boolean); // Remove empty strings

                const nonMatchingNumbers = steamIds.filter(obj => !whitelistArray.includes(obj.trim()));

                if (nonMatchingNumbers.length === 0) {
                    console.log("All steamIds from steamIds match with whitelistArray.");
                } else {
                    console.log("Not all steanUds from steamIds match with whitelistArray.");
                    console.log("Non-matching numbers:", nonMatchingNumbers);

                    // Kick players with non-matching steamIds
                    for (const nonMatchingNumber of nonMatchingNumbers) {
                        await client.send(`KickPlayer ${nonMatchingNumber}`);
                        console.log(`Kicking player with non-matching steamId: ${nonMatchingNumber}`);
                    }
                }
            } catch (err) {
                console.log(`Error: ${err}`);
            } finally {
                client.disconnect();
            }
        } else {
            //console.log("Whitelist is disabled. Skipping whitelist check.");
        }
    } catch (err) {
        console.log(`Error reading config file: ${err}`);
    }
};

// Run the function every 5 minutes
intervalId = setInterval(connectRcon, 5 * 60 * 1000); // 5 minutes in milliseconds