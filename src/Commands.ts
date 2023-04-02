import { Command } from "./Command";
import { Ask } from "./commands/Ask";
import { Flip } from "./commands/Flip";

/*
    Array of Command objects that stores all the Bot's commands
*/

export const Commands: Command[] = [Ask, Flip];