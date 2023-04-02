import { Client, CommandInteraction, Interaction } from "discord.js";
import { Commands } from "../Commands";

export default (BOT: Client): void => {
    BOT.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(BOT, interaction);
        }
    })
}

const handleSlashCommand = async (BOT: Client, interaction: CommandInteraction): Promise<void> => {
    /* search for command */
    const slashCommand = Commands.find(
        (command) => {
            return command.name == interaction.commandName;
    });

    /* undefine check */
    if (!slashCommand) {
        interaction.followUp({ content: "`An error has occured`"});
        return;
    }

    await interaction.deferReply();

    slashCommand.run(BOT, interaction);
}
