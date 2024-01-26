const BadWords = require("bad-words");
const shotsList = ["yeet"];
const megaList = ["spliffindor", "crispy"];
const profanityFilter = new BadWords({ list: shotsList });

module.exports = {
  name: "messageCreate",
  execute(message) {
    /*   shotAmount = Math.floor(Math.random() * 20) + 1;
    if (message.author.bot) return;
    if (
      megaList.some((mega) => message.content.toLowerCase().includes(`${mega}`))
    ) {
      return message.reply(`Damn you got balls, take 20 shots!`);
    }
    if (profanityFilter.isProfane(message.content)) {
      message.reply(`You said a bad word, now take ${shotAmount} drinks!`);
    }*/
  },
};
