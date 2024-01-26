const { loadFiles } = require("../Functions/fileLoader");
var tynt = require("tynt");

async function loadEvents(client) {
  console.time("Events loaded");

  client.events = new Map();
  const events = new Array();

  const files = await loadFiles("Events");

  for (const file of files) {
    try {
      const event = require(file);
      const execute = (...args) => event.execute(...args, client);
      const target = event.rest ? client.rest : client;

      target[event.once ? "once" : "on"](event.name, execute);
      client.events.set(event.name, execute);

      events.push({
        Event: event.name,
        Status: "YES",
      });
    } catch (error) {
      events.push({
        Event: file.split("/").pop().slice(0, -3),
        Status: "NO",
      });
    }
  }

  console.table(events, ["Event", "Status"]);
  console.timeEnd("Events loaded");
}

module.exports = { loadEvents };
