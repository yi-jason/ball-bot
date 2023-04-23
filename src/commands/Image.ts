import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData } from "discord.js";
import { Database, DatabaseReference, getDatabase, ref, set, onValue } from "firebase/database";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const imgOptionDefault: string = "name";

const imgCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: imgOptionDefault,
        description: "Name of the image",
        type: ApplicationCommandOptionType.String,
        required: true,
    }
]

export const Image: Command = {
    name: "i",
    description: "Sends an image with the saved name",
    type: ApplicationCommandType.ChatInput,
    options: imgCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const img = interaction.options.get(imgOptionDefault, true).value?.toString().toLowerCase();

        const db: Database = getDatabase();
        const reference: DatabaseReference = ref(db, 'img-list/' + img);

        onValue(reference, async (snapshot) => {
            if (snapshot.exists()) {
                const url = snapshot.val().url;
                await interaction.followUp({
                    content: url
                });
            } else {
                await interaction.followUp({
                    content: `**Image "${img}" does not exist!**`
                });
            }
          }, {
            onlyOnce: true
        });
    }
}
