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

const snipeOptionDefault: string = "snipe";

export const Snipe: Command = {
    name: "snipe",
    description: "Get the most recently deleted message",
    type: ApplicationCommandType.ChatInput,
    run: async (BOT: Client, interaction: CommandInteraction) => {

        await interaction.followUp({
            ephemeral: true,
            embeds: [
                {
                    title: "Deleted Message",
                    color: 0xff0000
                }
            ]
        });
    }
}