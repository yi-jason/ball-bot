import { Client, CommandInteraction, ApplicationCommandType, AttachmentBuilder, EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandOptionData, OAuth2Guild } from "discord.js";
import { Command } from "../Command";
import { Database, DatabaseReference, getDatabase, onValue, ref } from "firebase/database";
import { spawn } from "child_process";
import fs, { unlink } from "fs";
import { stdout } from "process";

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

const NONE_OUT: string = " ".repeat(20);
const PYTHON_ID: number = 0;

const STDOUT_ID: number = 0;
const STDERR_ID: number = 1;

const PROCESS_MAX_RUNTIME: number = 5000;

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
                

                try {
                    const out: string[] | undefined = await executeSourceCode(code, lang, channelId);

                    if (out != undefined) {
                        interaction.followUp({
                            content: "`stdout:` ```"
                                        .concat(lang)
                                        .concat('\n')
                                        .concat(out[STDOUT_ID].slice(0, 1999))
                                        .concat("\n```\n") +
                                        
                                     "`stderr:` ```"
                                        .concat(lang)
                                        .concat('\n')
                                        .concat(out[STDERR_ID].slice(0, 1999))
                                        .concat("\n```")
                        });
                    }

                } catch (err) {
                    if (err !== null && err != undefined) {
                        interaction.followUp({
                            content: err.toString(),
                        });
                    }
                }
            }
            return;
          }, {
            onlyOnce: true
        });
    }
}

const executeSourceCode = (text: string, language: string, id: string): Promise<string[]> => {
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

            if (text.includes("import sys")) {
                rej("```Error: Unauthorized code detected ;)```")
            }
        }

        if (!filePath) return undefined;
        fs.writeFile(filePath, text, err => {
            if (err) console.error("BOT: User write to user-src-cache failed");
        });

        let childStandardOutput: string = NONE_OUT;
        let childStandardError: string = NONE_OUT;

        switch(executionRoutineIdentifier) {
            case PYTHON_ID:                
                const child = spawn("python3", [filePath]);
                
                setTimeout(() => {
                    child.kill();
                    rej("```Error: Runtime exceeded :(```")
                }, PROCESS_MAX_RUNTIME);

                child.stdout.on("data", (data: Buffer) => {
                    childStandardOutput = data.toString('utf-8');
                })

                child.stderr.on("data", (data: Buffer) => {
                    childStandardError = data.toString('utf-8');
                })

                child.on("close", (status) => {
                    res([childStandardOutput, childStandardError]);
                })

            break;
        }
    })
}