import { Client, InteractionCollector } from "discord.js";
import { initializeApp } from "firebase/app";
import config from "./config/config";
import configfb from "./config/configFireBase";
import onReadyListener from "./listeners/ready";
import onMessageCreateListener from "./listeners/message";
import onMessageDeleteListener from "./listeners/delete";
import onInteractionCreateListener from "./listeners/interactionCreate";
import { IntentOptions } from "./config/IntentOptions";

const fbApp = initializeApp(configfb);

const BOT = new Client({ intents: IntentOptions });

onReadyListener(BOT);
onInteractionCreateListener(BOT);
onMessageCreateListener(BOT);
onMessageDeleteListener(BOT);

BOT.login(config.BOT_TOKEN);