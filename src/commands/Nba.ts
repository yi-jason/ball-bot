import { Client, CommandInteraction, ApplicationCommandType, EmbedBuilder } from "discord.js";
import { NBALiveHTTP } from "../lib/NBALiveHTTP";
import { Colors } from "../lib/NBAColors";
import { Command } from "../Command";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/


/*
interface Game {
    homeTeam: string;
    awayTeam: string;
    gameStatus: string;
    gameTime: string;
} */

const ballThumbnail: string = "https://cdn.discordapp.com/avatars/983839849373114428/c06b523b9ef70c1d56e46ece31d4e4cc?size=1024"

export const Nba: Command = {
    name: "nba",
    description: "Sends real-time NBA game data",
    type: ApplicationCommandType.ChatInput,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const responseData: any = await NBALiveHTTP("scoreboard/todaysScoreboard_00.json");
        const games: any = responseData.scoreboard.games;

        if (games == null || games == undefined) {
            await interaction.channel?.send("`No games today...`");
        }

        const gameEmbed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Today's Games")
            .setThumbnail(ballThumbnail)
            .setTimestamp()
        
        for (const game of games) {
            const homeTeam: string = game.homeTeam.teamTricode;
            const awayTeam: string = game.awayTeam.teamTricode;
            const gameStatus: string = game.gameStatusText;
            const gameTime: string = game.gameEt;

            const homeColor: string = `:${Colors[homeTeam]}_square:`;
            const awayColor: string = `:${Colors[awayTeam]}_square:`;

            gameEmbed.addFields(
                {
                    name: `${homeColor} ${homeTeam} vs. ${awayTeam} ${awayColor}`, 
                    value: `Time: ${gameTime}\nStatus: ${gameStatus}`
                }
            )
        }

        await interaction.followUp({
            embeds: [gameEmbed],
        });
    }
}