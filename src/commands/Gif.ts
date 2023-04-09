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

const gifOptionDefault: string = "name";

const gifCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: gifOptionDefault,
        description: "Name of the gif",
        type: ApplicationCommandOptionType.String,
        required: true,
    }
]

export const Gif: Command = {
    name: "g",
    description: "Sends a gif with the saved name",
    type: ApplicationCommandType.ChatInput,
    options: gifCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const gif = interaction.options.get(gifOptionDefault, true).value?.toString().toLowerCase();

        const db: Database = getDatabase();
        const reference: DatabaseReference = ref(db, 'gif-list/' + gif);

        onValue(reference, async (snapshot) => {
            if (snapshot.exists()) {
                const url = snapshot.val().url;
                await interaction.followUp({
                    content: url
                });
            } else {
                await interaction.followUp({
                    content: `GIF "${gif}" does not exist!`
                });
            }
          }, {
            onlyOnce: true
        });
    }
}
