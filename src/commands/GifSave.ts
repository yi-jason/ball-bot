import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData } from "discord.js";
import { Database, DatabaseReference, DataSnapshot, get, getDatabase, onValue, ref, set } from "firebase/database";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const gifSaveOptionDefault: string = "name";

const gifSaveCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: gifSaveOptionDefault,
        description: "Name of the gif",
        type: ApplicationCommandOptionType.String,
        required: true,
    }
]

export const GifSave: Command = {
    name: "gs",
    description: "Saves the gif with the given name",
    type: ApplicationCommandType.ChatInput,
    options: gifSaveCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const gifName = interaction.options.get(gifSaveOptionDefault, true).value?.toString();

        if (!gifName) return;

        const channelId: string = interaction.channelId;

        const db: Database = getDatabase();
        const recentGifPath: string = "gif/".concat(channelId).concat("/recent");
        const gifListPath: string = "gif-list/".concat(gifName);
        const gifRecentRef: DatabaseReference = ref(db, recentGifPath);
        const gifListRef: DatabaseReference = ref(db, gifListPath);

        const gifURL: string = await (await get(gifRecentRef)).val();

        set(gifListRef, {
            url: gifURL
        });

        await interaction.followUp({
            ephemeral: false,
            content: "**gif saved!**"
        });
    }
}