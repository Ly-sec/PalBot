
# PalBot - Your Palworld Server Companion
PalBot is a discord bot written in NodeJS.

It's aimed towards people who are hosting their own Palworld servers.

# Features
Newest feature: Whitelist
The bot will check every 3 minutes (changable in the config.json) if every user in the server is whitelisted.
The whitelist is disabled by default so if you want to change that, use the `/whitelist` command.

# Commands
`/server` - Gives you basic informations about your Palworld server. Be aware though that the "current Players" is not always correct.

`/players` - Let's you fetch a list of online players (including steamId and userId).

`/rcon-edit` - A simple way of managing the people that should be allowed to use the RCON commands. This is made possible through discords role system.

`/broadcast` - Let's you send messages to the server through rcon.

`/save` - Let's you save the server through rcon.

`/shutdown` - Let's you shut the server down with specified time and message.

`/whitelist` - Ability to enable/disable the whitelist.

`/whitelist-edit` - Gives you the option to add/remove users (steamId) from the whitelist.

More commands are planned as soon as we get more informations on how the servers exactly work!


__Warning__

If you don't have an automatic startup script for your server, please be aware that there is no way to restart the server via the bot (for now)!

## How to use

Head over to https://discord.com/developers/ and create a new application then click on said application.

Now click on the "Bot" tab and scroll down until you see "Privileged Gateway Intents".

Turn on all of the 3 intents (Presence, Server Members and Message Content) and don't forget to save :).

Now scroll up again and copy your token and put it into the `config.json`.

After that go to "General Information" and copy the "Application ID", go to this website https://discordapi.com/permissions.html and put in your client ID and for the Permissions I'd recommend selecting Administrator (please don't do this if you're inviting random bots that you don't host, it's not the greatest idea security wise).

At the bottom you should see a link, click on it and select the server that you want to invite the bot to.


Download: https://github.com/Ly-sec/PalBot/releases/

Or just clone the repo

Open the folder in your favorite code editor and then follow these quick steps:

`npm install` - this will install all dependencies.

Now open the `config.json` file and enter ALL the informations.

After that, you're basically good to go.

Just run the bot with `node .`

# Informations
Config explanation:

```
{
  "token": "BOT_TOKEN",
  "host": "SERVER_IP",
  "port": 8211,
  "rcon_port": 25575,
  "rcon_password": "RCON_PASSWORD",
  "rcon_role": "RCON_ROLE",
  "whitelist_role": "WHITELIST_ROLE",
  "whitelist_enabled": false,
  "whitelist_time": 3
}
```

token = Your bot token

host = Your PUBLIC server IP

port = Your server port

rcon_port = Your rcon port

rcon_password = Your AdminPassword (set in your server config)

rcon_role = The role (name) that should be allowed to use rcon commands

whitelist_role = The role name that should be allowed to add people to the whitelist. If you don't specify any role for that, it will use the rcon_role instead.

whitelist_enabled = If true: checks for peoples steam id and kicks if they arent in whitelist.txt.

whitelist_time = How often the bot should check for whitelist entries (in minutes)


## Authors

- [@Ly-sec](https://github.com/Ly-sec)


[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/gbraad)
