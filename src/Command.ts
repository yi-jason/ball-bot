import { Client, CommandInteraction, ChatInputApplicationCommandData } from "discord.js";

/*
    Defining (Slash) Command type: subtype of ChatInputApplicationCommandData.

    ChatInputApplicationCommandData: interface that entails details about command.

    This interface will be served as a basic structure of a typical slash command.
    run: 
         the method that will be called when the command is executed.
         accepts the bot object and the interaction.

    Reminder: any command declared in "commands" directory must implement the relevant properties of ChatInputApplicationCommandData and its parent interface
*/

/*
    export interface BaseApplicationCommandData {
        name: string;
        nameLocalizations?: LocalizationMap;
        dmPermission?: boolean;
        defaultMemberPermissions?: PermissionResolvable | null;
        nsfw?: boolean;
    }

    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }

    Command implementation must contain the following (minimum):
        name: string
        description: string
        run: (BOT: Client, interaction: CommandInteraction) => implementation
*/

export interface Command extends ChatInputApplicationCommandData {
    run: (BOT: Client, interaction: CommandInteraction) => void;
}