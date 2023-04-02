import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData, Colors } from "discord.js";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const askOptionDefault: string = "question";

const askCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: askOptionDefault,
        description: "Yes or no question",
        type: ApplicationCommandOptionType.String,
        required: true,
    }
]

export const Ask: Command = {
    name: "ask",
    description: "Returns a positive or negative affirmation",
    type: ApplicationCommandType.ChatInput,
    options: askCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const condition: Boolean = Math.random() < 0.5;
        const question = interaction.options.get(askOptionDefault, true).value?.toString();

        await interaction.followUp({
            ephemeral: true,
            embeds: [
                {
                    title: (condition ? "Yes!" : "No!"),
                    description: question,
                    color: 0xff0000
                }
            ]
        });
    }
}