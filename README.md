
# PalBot - Your Palworld Server Companion
PalBot is a discord bot written in NodeJS.
It is aimed towards people who are hosting their own Palworld servers.

# Features
Newest feature: Whitelist
The bot will check every 5 minutes (changable in the index.js) if every user in the server is whitelisted.
The whitelist is disabled by default so if you want to change that, use the `/whitelist` command.

# Commands
`/server` - Gives you basic informations about your Palworld server. Be aware though that the "current Players" is not always correct. Gamedig maybe fetches that wrong, not sure.

`/rcon-edit` - A simple way of managing the people that should be allowed to use the RCON commands. This is made possible through discords role system.

`/broadcast` - Let's you send messages to the server.

`/save` - Let's you save the server.

`/shutdown` - Lets you turn off the server (with specific delay (seconds) and a text).

`/whitelist` - Ability to enable/disable the whitelist.

`/whitelist-edit` - Gives you the option to add/remove users (steamId) from the whitelist.

`/players` - Displays a list of players, ther userId and their SteamId.

More commands are planned as soon as we get more informations on how the servers exactly work!


__Warning__

If you don't have an automatic startup script for your server, please be aware that there is no way to restart the server via the bot (for now)!

## How to use

Go through the usual steps to create a bot over at https://discord.com/developers/ and copy the token and then invite the bot to your server.

Download: https://github.com/Ly-sec/PalBot/releases/

Or just clone the repo

Open the folder in your favorite code editor and then follow these quick steps:

`npm install` - this will install all dependencies.

Now open the `config.json` file and enter ALL the informations.

After that, you're basically good to go.

Just run the bot with `node .`

## Config Explanation

Example Config:
```js
{
  "token": "BOT_TOKEN",
  "host": "SERVER_IP",
  "port": 8211,
  "rcon_port": 25575,
  "rcon_password": "RCON_PASSWORD",
  "rcon_role": "RCON_ROLE",
  "whitelist_enabled": false
}
```
token: The token of your bot (get it from here https://discord.com/developers/applications)
host: Your server IP
port: Your server port
rcon_port: Your RCON port
rcon_password: Your AdminPassword (check your server settings)
rcon_role: The discord role (name) that should be allowed to use rcon commands
whitelist_enabled: Enables/Disables the whitelist (you can always use /whitelist to change it)

## Authors

- [@Ly-sec](https://github.com/Ly-sec)

