import { Client, Events } from "discord.js";
import { Commands } from "../Commands";

/*
    Bot default on-ready listener
*/

export default (BOT: Client): void => {
    BOT.on(Events.ClientReady, async () => {
        if (!BOT.user || !BOT.application) {
            return;
        }

        await BOT.application.commands.set(Commands);

        console.log(`BOT: [${BOT.user.username}] IS READY`);
    });
}
