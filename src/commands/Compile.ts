import { Client, CommandInteraction, ApplicationCommandType, AttachmentBuilder, EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandOptionData, OAuth2Guild } from "discord.js";
import { Command } from "../Command";
import { Database, DatabaseReference, getDatabase, onValue, ref } from "firebase/database";
import { spawn } from "child_process";
import fs, { unlink } from "fs";

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

const PYTHON_ID: number = 0;

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
                const out: string | undefined = await executeSourceCode(code, lang, channelId);

                if (out != undefined) {
                    interaction.followUp({
                        content: "```".concat(lang).concat('\n').concat(out).concat("\n```"),
                    });
                }
            }
            return;
          }, {
            onlyOnce: true
        });
    }
}

const executeSourceCode = (text: string, language: string, id: string): Promise<string | undefined> => {
    return new Promise((res, rej) => {
        const filePathBase: string = "./user-src-cache/";

        if (!fs.existsSync(filePathBase)) {
            fs.mkdirSync(filePathBase);
        }

        let filePath: string | undefined = undefined;
        let executionRoutineIdentifier: number = -1;
        if (language === "py" || language === "python") {
            filePath = filePathBase.concat(id).concat(PYTHON_EXT);
            executionRoutineIdentifier = PYTHON_ID;
        }

        if (!filePath) return undefined;
        fs.writeFile(filePath, text, err => {
            if (err) console.error("BOT: User write to user-src-cache failed");
        });

        let childStandardOutput: string | undefined = undefined;

        switch(executionRoutineIdentifier) {
            case PYTHON_ID:
                const child = spawn("python3", [filePath]);

                child.stdout.on("data", (data: Buffer) => {
                    data.toString('utf-8');
                    res(data.toString('utf-8'));
                })

            break;
        }
    })
}
