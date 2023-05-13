import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, Message, ComponentType, Events, InteractionCollector } from "discord.js";
import { DataSnapshot, Database, getDatabase, onValue, ref, set } from "firebase/database";
import { Command } from "../Command";
import { EmbedBuilder } from "@discordjs/builders";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/

const gifSearchOptionDefault: string = "name";

const gifSearchCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: gifSearchOptionDefault,
        description: "Search",
        type: ApplicationCommandOptionType.String,
        required: true,
    }
]

const pageLengthMax: number = 10;

const getPageContent = (searchResults: string[], f: number, b: number): string => {
    let index: number = f + 1;
    let content: string = "";

    for (const item of searchResults.slice(f, b)) {
        content = content.concat(`${index}: ${item}\n`)
        index++;
    }

    return content;
}

const listCallBack = async (snapshot: DataSnapshot, interaction: CommandInteraction, item: string): Promise<void> => {
    const searchResults: string[] = [];
    const query: string = item.toLowerCase();

    if (snapshot.exists()) {
        const gifObject: any = snapshot.val();

        for (const gif in gifObject) {
            if (gif.includes(query.toLowerCase()) || query === '$')
                searchResults.push(gif);
        }

        if (searchResults.length !== 0) {
            searchResults.sort();
            const resultFront: number = 0;
            const resultBack: number = Math.min(searchResults.length, pageLengthMax);
            const results: string = getPageContent(searchResults, resultFront, resultBack);

            const resultEmbed: any = new EmbedBuilder()
                .setTitle(`Search results for "${query}"`)
                .setDescription(results)
                .setTimestamp();

            const pageSelection = new StringSelectMenuBuilder()
                .setCustomId('gif-search')
                .setPlaceholder('Select a page')

            for (let p = 0; p <= searchResults.length / pageLengthMax; ++p) {
                const pageNumber: number = p + 1;
                
                pageSelection.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${pageNumber}`)
                        .setValue(`${pageNumber}`)
                );
            }

            const row: any = new ActionRowBuilder().addComponents(pageSelection);

            const response: Message = await interaction.followUp({
                embeds: [resultEmbed],
                components: [row],
            });

            const collector: any = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
            
            collector.on('collect', async (i: any) => {
                const selectedPage: number = parseInt(i.values[0], 10) - 1;
                const newFront: number = selectedPage * pageLengthMax;
                const newBack: number = Math.min(newFront + pageLengthMax, searchResults.length)

                const updatedResultEmbed: any = new EmbedBuilder()
                    .setTitle(`Search results for "${query}"`)
                    .setDescription(getPageContent(searchResults, newFront, newBack))
                    .setTimestamp();
                
                await response.edit({embeds: [updatedResultEmbed]});
                await i.reply('updated');
                await i.deleteReply();
            });
        }
    }
}

export const GifList: Command = {
    name: "glist",
    description: "Search for gifs with the given name",
    type: ApplicationCommandType.ChatInput,
    options: gifSearchCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {

        if (!interaction.options.get(gifSearchOptionDefault, true).value) return;

        const gifName: string | undefined = interaction.options.get(gifSearchOptionDefault, true).value?.toString();

        if (gifName === undefined) return;

        const db: Database = getDatabase();
        const gifPathRef = ref(db, "gif-list/");
        const gifResults: string[] = [];

        onValue(gifPathRef, async (snapshot) => {
            listCallBack(snapshot, interaction, gifName);
          }, {
            onlyOnce: true
        });

    }
}