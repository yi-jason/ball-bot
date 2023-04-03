import { Command } from "./Command";
import { Ask } from "./commands/Ask";
import { Flip } from "./commands/Flip";
import { Gif } from "./commands/Gif";

/*
    Array of Command objects that stores all the Bot's commands
*/

export const Commands: Command[] = [Ask, Flip, Gif];