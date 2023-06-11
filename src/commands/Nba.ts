import { Client, CommandInteraction, ApplicationCommandType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } from "discord.js";
import { NBAGetAllGames } from "../lib/NBAUtils";
import { NBAColors } from "../lib/NBAColors";
import { Command } from "../Command";
import { ActionRowBuilder } from "@discordjs/builders";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/


interface Game {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    gameStatus: string;
    gameTime: string;
    gameClock: string;
    period: number;
    homeLeaderName: string;
    homeLeaderPoints: number;
    awayLeaderName: string;
    awayLeaderPoints: number;
}

const ballThumbnail: string = "https://cdn.discordapp.com/avatars/983839849373114428/c06b523b9ef70c1d56e46ece31d4e4cc?size=1024"

const scoreboardEndPointURL: string = "scoreboard/todaysScoreboard_00.json";

export const Nba: Command = {
    name: "nba",
    description: "Sends real-time NBA game data",
    type: ApplicationCommandType.ChatInput,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const games: any = await NBAGetAllGames();
        const gameList: Game[] = [];
        let gameIndex: number = 0;

        if (games == null || games == undefined || games.length == 0) {
            await interaction.followUp("```No games today :(```");
            return;
        }

        const gamesEmbed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Today's Games")
            .setThumbnail(ballThumbnail)
            .setTimestamp()

        const teamSelection = new StringSelectMenuBuilder()
            .setCustomId('ball-bot')
            .setPlaceholder('Select a team!')
        
        for (const game of games) {
            const homeTeam: string = game.homeTeam.teamTricode;
            const awayTeam: string = game.awayTeam.teamTricode;
            const gameStatus: string = game.gameStatusText;
            const gameTime: string = new Date(game.gameEt.slice(0, -1)).toLocaleTimeString();

            const g: Game = {
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                homeScore: game.homeTeam.score,
                awayScore: game.awayTeam.score,
                gameStatus: gameStatus,
                gameTime: gameTime,
                gameClock: game.gameClock,
                period: game.period,
                homeLeaderName: game.gameLeaders.homeLeaders.name,
                homeLeaderPoints: game.gameLeaders.homeLeaders.points,
                awayLeaderName: game.gameLeaders.awayLeaders.name,
                awayLeaderPoints: game.gameLeaders.awayLeaders.points,
            }

            gameList.push(g);

            const homeColor: string = `:${NBAColors[homeTeam]}_square:`;
            const awayColor: string = `:${NBAColors[awayTeam]}_square:`;

            gamesEmbed.addFields(
                {
                    name: `${homeColor} ${homeTeam} vs. ${awayTeam} ${awayColor}`, 
                    value: `Time: ${gameStatus}`
                }
            )

            teamSelection.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`${homeTeam} | ${awayTeam}`)
                    .setValue(`${gameIndex++}`)
            );
        }

        const row: any = new ActionRowBuilder().addComponents(teamSelection);

        const response: any = await interaction.followUp({
            embeds: [gamesEmbed],
            components: [row],
        });

        const collector: any = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });

        collector.on('collect', async (i: any) => {
            const selection: number = parseInt(i.values[0], 10);
            if (isNaN(selection)) return;

            const g: Game = gameList[selection];
            const homeColor: string = `:${NBAColors[g.homeTeam]}_square:`;
            const awayColor: string = `:${NBAColors[g.awayTeam]}_square:`;
            const gameState: string = g.gameClock === "" ? `${g.gameStatus}` : `Q${g.period} - ${g.gameClock}`

            const gEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle(`${homeColor} ${g.homeTeam} vs. ${g.awayTeam} ${awayColor}`)
                .setDescription(`${g.homeScore} - ${g.awayScore}\n\n${gameState}`)
                .addFields(
                    {
                        name: "Home Leader",
                        value: `${g.homeLeaderName} - ${g.homeLeaderPoints} pts`,
                    },

                    {
                        name: "Away Leader",
                        value: `${g.awayLeaderName} - ${g.awayLeaderPoints} pts`,
                    }
                );

            await response.edit({embeds: [gEmbed]});
            await i.reply({
                content: "updated",
                ephemeral: true,
            });
             
            await i.deleteReply();
        });
    }
}