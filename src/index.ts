import { Client, InteractionCollector } from "discord.js";
import config from "./config/config";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import { IntentOptions } from "./config/IntentOptions";


const BOT = new Client({ intents: IntentOptions });

ready(BOT);
interactionCreate(BOT);

BOT.login(config.BOT_TOKEN);
