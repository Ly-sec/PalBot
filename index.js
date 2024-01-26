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

const status = (queue) => `Volume: \`${queue.volume}%\``;

loadEvents(client);

client.login(client.config.token);
