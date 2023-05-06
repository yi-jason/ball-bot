import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData, Colors } from "discord.js";
import { Database, DatabaseReference, getDatabase, ref, set, onValue } from "firebase/database";

import { Command } from "../Command";
import message from "../listeners/message";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

export const Snipe: Command = {
    name: "snipe",
    description: "Get the most recently deleted message",
    type: ApplicationCommandType.ChatInput,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const channelId = interaction.channelId;

        const db: Database = getDatabase();
        const reference: DatabaseReference = ref(db, "channel-snipe/" + channelId);

        onValue(reference, async (snapshot) => {
            if (snapshot.exists()) {
                const msg = snapshot.val().recent;
                await interaction.followUp({
                    ephemeral: true,
                    embeds: [
                        {
                            title: "Deleted message",
                            description: msg,
                            color: 0xff0000
                        }
                    ]
                });
            } else {
                await interaction.followUp({
                    ephemeral: true,
                    embeds: [
                        {
                            title: "Nothing to snipe...",
                            color: 0xff0000
                        }
                    ]
                });
            }
        })
    }
}