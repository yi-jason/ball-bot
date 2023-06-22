import { Client, CommandInteraction, ApplicationCommandType, AttachmentBuilder, EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandOptionData } from "discord.js";
import fs from "fs";
import { Command } from "../Command";
import { Database, DatabaseReference, getDatabase, onValue, ref } from "firebase/database";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const PYTHON_EXT: string = ".py";
const C_EXT: string = ".c";
const CPP_EXT: string = ".cpp";

export const Compile: Command = {
    name: "compile",
    description: "Compiles and runs given code",
    type: ApplicationCommandType.ChatInput,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const channelId: string = interaction.channelId;
        const db: Database = getDatabase();
        const reference: DatabaseReference = ref(db, 'channel-code/'.concat(channelId));

        onValue(reference, async (snapshot) => {
            if (snapshot.exists()) {
                const code: string = snapshot.val().source;
                const lang: string = snapshot.val().language;

                if (!code || !lang) return;
                executeSourceCode(code, lang, channelId);
            }
            return;
          }, {
            onlyOnce: true
        });
    }
}

const executeSourceCode = (text: string, language: string, id: string): string | undefined => {
    const filePathBase = "./user-src-cache/";

    if (!fs.existsSync(filePathBase)) {
        fs.mkdirSync(filePathBase);
    }

    let filePath: string | undefined = undefined;
    if (language === "py" || language === "python") {
        filePath = filePathBase.concat(id).concat(PYTHON_EXT);
    }

    if (!filePath) return undefined;
    fs.writeFile(filePath, text, err => {
        if (err) console.error("BOT: User write to user-src-cache failed");
    });

    

    return "hello";
}
