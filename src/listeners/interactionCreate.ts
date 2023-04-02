import { Client, CommandInteraction, Interaction } from "discord.js";

export default (BOT: Client): void => {
    BOT.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(BOT, interaction);
        }
    })
}

const handleSlashCommand = async (BOT: Client, interaction: CommandInteraction): Promise<void> => {
    // slash command handle
}
