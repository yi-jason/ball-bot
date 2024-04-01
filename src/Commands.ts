import { Command } from "./Command";
import { Ask } from "./commands/Ask";
import { Flip } from "./commands/Flip";
import { Gif } from "./commands/Gif";
import { GifSave, RGGSave } from "./commands/GifSave";
import { Image } from "./commands/Image";
import { ImageSave } from "./commands/ImageSave";
import { Nba } from "./commands/Nba";
import { Snipe } from "./commands/Snipe"
import { Stat } from "./commands/NbaStat";
import { GifList } from "./commands/GifList";
import { EthanDelete } from "./commands/EthanDelete";
import { Pixelate } from "./commands/Pixelate";
import { Compile } from "./commands/Compile";

/* Array of Command objects that stores all the Bot's commands */


export const Commands: Command[] = [Ask, Flip, Gif, GifList, GifSave, RGGSave, Image, ImageSave, Snipe, Nba, Stat, EthanDelete, Pixelate, Compile];
