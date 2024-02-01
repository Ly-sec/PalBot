const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ActivityType,
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
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent],
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

                const steamIdRegex = /\b(\d{17})\b/g;
                const steamIds = (response.match(steamIdRegex) || []).map(cleanId).map(String);

                const whitelistArray = (await fs.readFile('whitelist.txt', 'utf-8'))
                    .split("\n")
                    .map(cleanId)
                    .filter(Boolean) // Remove empty strings
                    .map(String); // Convert to strings

                const nonMatchingIds = steamIds.filter(obj => !whitelistArray.includes(obj.trim()));

                if (nonMatchingIds.length === 0) {
                    console.log("All steamIds from steamIds match with whitelistArray.");
                } else {
                    console.log("Not all steamIds from steamIds match with whitelistArray.");
                    console.log("Non-matching steamIds:", nonMatchingIds);

                    // Kick players with non-matching steamIds
                    for (const nonMatchingNumber of nonMatchingIds) {
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

const cleanId = str => str.replace(/\D/g, '').trim(); // Trim whitespaces

  
  const showPlayers = async () => {
    try {
      const { GameDig } = await import('gamedig');
      const config = JSON.parse(await fs.readFile('./config.json', 'utf-8'));
  
      GameDig.query({
        type: 'palworld',
        host: config.host,
        port: config.port,
        givenPortOnly: true
      })
        .then((state) => {
          const statusText = `${state.raw.attributes.PLAYERS_l}/${state.raw.settings.maxPublicPlayers}`;
          client.user.setActivity(`${statusText}`, { type: ActivityType.Watching });
        })
        .catch((error) => {
          console.log(`Server is offline, error: ${error}`);
        });
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };
  
  // Run it once so it doesn't take 2 minutes for the status to appear
  showPlayers();


  // Player count check, every 2 minutes
  intervalId = setInterval(showPlayers, 2 * 60 * 1000);
  
  // Whitelist check, every 5 minutes
  intervalId = setInterval(connectRcon, 5 * 60 * 1000);
  