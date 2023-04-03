import { Client, CommandInteraction, ApplicationCommandType, AttachmentBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

export const Flip: Command = {
    name: "flip",
    description: "Flips a coin",
    type: ApplicationCommandType.ChatInput,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const condition: Boolean = Math.random() < 0.5;

        const headsImage: AttachmentBuilder = new AttachmentBuilder('./src/assets/images/hub.png');
        const tailsImage: AttachmentBuilder = new AttachmentBuilder('./src/assets/images/terry_schleep.jpeg');

        const embed: EmbedBuilder = new EmbedBuilder().setTitle(condition ? 'Heads' : 'Tails')
            .setImage(condition ? 'attachment://hub.png' : 'attachment://terry_schleep.jpeg');

        await interaction.followUp({
            embeds: [embed],
            files: condition ? [headsImage] : [tailsImage]
        });
    }
}
