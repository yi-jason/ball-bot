import { Client, InteractionCollector } from "discord.js";
import config from "./config/config";
import { IntentOptions } from "./config/IntentOptions"

(async () => {
  const BOT = new Client({ intents: IntentOptions });

  BOT.once("ready", () => console.log("Connected to Discord!"));

  BOT.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) {
      return
    }
  })
  
  await BOT.login(config.BOT_TOKEN);
})();