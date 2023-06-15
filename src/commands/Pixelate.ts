import { Worker } from "worker_threads";
import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData, Attachment } from "discord.js";
import sharp from "sharp";
import { Command } from "../Command";
import axios from "axios";
import fs from "fs";

const CACHE_PATH: string = "./img-cache/";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const pixelateOptionFactor: string = "factor";
const pixelateOptionSource: string = "image";

const pixelateCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: pixelateOptionSource,
        description: "Source image",
        type: ApplicationCommandOptionType.Attachment,
        required: true,
    },

    {
        name: pixelateOptionFactor,
        description: "Pixelation factor (1 - 100)",
        type: ApplicationCommandOptionType.Number,
        required: true,
    }
]

export const Pixelate: Command = {
    name: "pixelate",
    description: "Pixelate an image",
    type: ApplicationCommandType.ChatInput,
    options: pixelateCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {

        if (!interaction.options.get(pixelateOptionFactor, true).value) return;

        const inputFactor: string | undefined = interaction.options.get(pixelateOptionFactor, true).value?.toString();
        const inputAttachment: Attachment | undefined = interaction.options.get(pixelateOptionSource, true).attachment;
        let factor = 0;

        if (inputFactor != undefined && inputAttachment != undefined) {
            factor = parseInt(inputFactor);
            factor = Math.max(1, Math.min(factor, 100));

            const status: number | undefined = await fetchImageFromURL(inputAttachment.url, interaction.channelId);
            
            if (status == undefined) {
                interaction.followUp("```There has been an issue with writing the file...```");
                return;
            }
            
            /*
                the main reason for creating a worker thread is not to achieve faster output speed

                rather: heavy computational tasks may block other commands
            */

            const iWorker: Worker = new Worker("./src/workers/ImageWorker.js");
            
            if (iWorker != null) {
                iWorker.on("message", data => {
                    interaction.followUp(`${data}`);
                });
            }

        }
    }
}

const fetchImageFromURL = async (url: string, channelId: string): Promise<number | undefined> => {
    try {
        const response = await axios.get(url, { responseType: 'stream' });

        if (!fs.existsSync(CACHE_PATH)) {
            fs.mkdirSync(CACHE_PATH, { recursive: true });
        }
        
        response.data.pipe(fs.createWriteStream(CACHE_PATH.concat(`${channelId}.png`)));
        return 1;

    } catch (e) {
        console.error('Error fetching the image:', e);
        return undefined;
    }
}

