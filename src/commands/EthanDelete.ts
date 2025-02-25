import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData } from "discord.js";
import { Database, DatabaseReference, getDatabase, ref, set } from "firebase/database";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const ethanDeleteOptionDefault: string = "delete";

const ethanDeleteCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: ethanDeleteOptionDefault,
        description: "Delete Ethan's Messages?",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
    }
]

export const EthanDelete: Command = {
    name: "e-del",
    description: "Toggle Ethan Delete",
    type: ApplicationCommandType.ChatInput,
    options: ethanDeleteCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {

        if (interaction.user.id === '125825809142251520' || interaction.user.id === '630249059096985610') {
            const bool = interaction.options.get(ethanDeleteOptionDefault, true).value;

            const db: Database = getDatabase();
            const reference: DatabaseReference = ref(db, "ethan-del/");
            set(reference, bool);
    
            await interaction.followUp({
                ephemeral: false,
                content: "`Ethan Delete Toggled!`"
            });
        } else {
            await interaction.followUp({
                ephemeral: false,
                content: "`You do not have the permission to use this command!`"
            });
        }

    }
}
