import { Command } from "./Command";
import { Ask } from "./commands/Ask";
import { Flip } from "./commands/Flip";
import { Gif } from "./commands/Gif";
import { GifSave } from "./commands/GifSave";
import { Image } from "./commands/Image";
import { ImageSave } from "./commands/ImageSave";

/*
    Array of Command objects that stores all the Bot's commands
*/

export const Commands: Command[] = [Ask, Flip, Gif, GifSave, Image, ImageSave];