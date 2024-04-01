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

const writeGifTo = async (gifName: string, channelId: string, to: string): Promise<void> => {
    const db: Database = getDatabase();
    const recentGifPath: string = "channel-gif/".concat(channelId).concat("/recent");
    const gifListPath: string = to.concat(gifName);
    const gifRecentRef: DatabaseReference = ref(db, recentGifPath);
    const gifListRef: DatabaseReference = ref(db, gifListPath);

    const gifURL: string = await (await get(gifRecentRef)).val();


    set(gifListRef, {
        url: gifURL
    });

}

export const RGGSave: Command = {
    name: "rggs",
    description: "Saves the RGG gif with the given name",
    type: ApplicationCommandType.ChatInput,
    options: gifSaveCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        if (!interaction.options.get(gifSaveOptionDefault, true).value) {
            return;
        }

        writeGifTo(
            formatGifName(interaction.options.get(gifSaveOptionDefault, true).value?.toString()!),
            interaction.channelId,
            "rgg-gif-list/"
        )

        await interaction.followUp({
            ephemeral: false,
            content: "振り上げた握り拳が 俺達のJUDGEMENT`",
        });
    }
}

export const GifSave: Command = {
    name: "gs",
    description: "Saves the gif with the given name",
    type: ApplicationCommandType.ChatInput,
    options: gifSaveCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        if (!interaction.options.get(gifSaveOptionDefault, true).value) {
            return;
        }

        const gifName = formatGifName(interaction.options.get(gifSaveOptionDefault, true).value?.toString()!);
        const channelId: string = interaction.channelId;

        writeGifTo(gifName, channelId, "gif-list/");
        await interaction.followUp({
            ephemeral: false,
            content: "`GIF saved! as: " + gifName + "`",
        });
    }
}

const formatGifName = (name: string): string => {
    return name.replace(/'/g, "").toLowerCase();
}
