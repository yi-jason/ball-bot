import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData, Colors } from "discord.js";
import { Command } from "../Command";
import { EmbedBuilder } from "@discordjs/builders";

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
    description: "Responds with an agreement or disagreement",
    type: ApplicationCommandType.ChatInput,
    options: askCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const condition: Boolean = Math.random() < 0.5;
        const question = interaction.options.get(askOptionDefault, true).value?.toString();

        const res = new EmbedBuilder(
            {
                description: `Q: ${question}`,
            }
        )

        if (question?.toLowerCase() == "bdl") {
            res.setTitle("ball never lies");
        } else {
            if (condition) {
                res.setTitle("yes");
                res.setColor(0x00ff00);
            } else {
                res.setTitle("no");
                res.setColor(0xff0000);
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [res]
        });
    }
}