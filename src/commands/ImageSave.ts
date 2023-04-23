import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData } from "discord.js";
import { Database, DatabaseReference, get, getDatabase, ref, set } from "firebase/database";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const imgSaveOptionDefault: string = "name";

const imgSaveCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: imgSaveOptionDefault,
        description: "Name of the image",
        type: ApplicationCommandOptionType.String,
        required: true,
    }
]

export const ImageSave: Command = {
    name: "is",
    description: "Saves the image with the given name",
    type: ApplicationCommandType.ChatInput,
    options: imgSaveCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {

        if (!interaction.options.get(imgSaveOptionDefault, true).value) return;

        const imgName = formateImgName(interaction.options.get(imgSaveOptionDefault, true).value?.toString()!);

        const channelId: string = interaction.channelId;
        
        const db: Database = getDatabase();
        const recentImgPath: string = "channel-img/".concat(channelId).concat("/recent");
        const imgListPath: string = "img-list/".concat(imgName);
        const imgRecentRef: DatabaseReference = ref(db, recentImgPath);
        const imgListRef: DatabaseReference = ref(db, imgListPath);

        const imgURL: string = await (await get(imgRecentRef)).val();

        set(imgListRef, {
            url: imgURL
        });

        await interaction.followUp({
            ephemeral: false,
            content: "**Image saved!**"
        });
    }
}

function formateImgName(name: string): string {
    return name.replace(/'/g, "").toLowerCase();
}