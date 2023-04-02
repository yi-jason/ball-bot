import { Client } from "discord.js";

/*
    Bot default on-ready listener
*/

export default (BOT: Client): void => {
    BOT.on("ready", async () => {
        if (!BOT.user || !BOT.application) {
            return;
        }

        console.log(`${BOT.user.username} is balling`);
    });
}
