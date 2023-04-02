import { Client, CommandInteraction, ChatInputApplicationCommandData } from "discord.js";

/*
    Defining (Slash) Command type: subtype of ChatInputApplicationCommandData.

    ChatInputApplicationCommandData: interface that represents a command.

    This interface will be served as a basic structure of a typical slash command.
    run: 
         the method that will be called when the command is executed.
         accepts the bot object and the interaction,
*/

export interface Command extends ChatInputApplicationCommandData {
    run: (BOT: Client, interaction: CommandInteraction) => void;
}