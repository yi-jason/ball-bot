import { Client, CommandInteraction, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

export const Ask: Command = {
    name: "ask",
    description: "Returns a positive or negative affirmation",
    type: ApplicationCommandType.ChatInput,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const condition: Boolean = Math.random() < 0.5;

        await interaction.followUp({
            ephemeral: true,
            content: "Hi"
        });
    }
}