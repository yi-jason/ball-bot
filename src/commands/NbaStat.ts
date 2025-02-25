import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData, Colors, CommandInteractionOption } from "discord.js";
import { Command } from "../Command";
import { NBAGetGameId, NBAGetPLayerStats, NBAGetTeamStats, playerStatKeys, playerStatKeysVerbose, playerStatistics, teamStatKeys, teamStatKeysVerbose, teamStatistics } from "../lib/NBAUtils";
import { Team, getTeamInfo, getTeamLogo } from "../lib/NBATeams";
import { EmbedBuilder } from "@discordjs/builders";

/*
    export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
        description: string;
        descriptionLocalizations?: LocalizationMap;
        type?: ApplicationCommandType.ChatInput;
        options?: ApplicationCommandOptionData[];
    }
*/


const teamOptionDefault: string = "team";
const playerOptionDefault: string = "player";

const statCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: teamOptionDefault,
        description: "team",
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: playerOptionDefault,
        description: "player on that team",
        type: ApplicationCommandOptionType.String,
        required: false,
    }
]

export const Stat: Command = {
    name: "stat",
    description: "Sends team or player statistic",
    type: ApplicationCommandType.ChatInput,
    options: statCommandOptions,
    run: async (BOT: Client, interaction: CommandInteraction) => {
        const team: string | undefined = interaction.options.get(teamOptionDefault, true).value?.toString();
        const player: any | undefined = interaction.options.get(playerOptionDefault, false);



        /* Team Stats */



        if (team === undefined) return;
        
        /* Check for game/team existence */
        const gameId: string | null = await NBAGetGameId(team.toLowerCase());

        if (gameId === null) {
            interaction.followUp({
                content: "`Unrecognized team or not playing...`",
            });

            return;
        }

        /* Boxscore request error if game is not ongoing */
        const teamStatData: teamStatistics | null = await NBAGetTeamStats(gameId, team);

        if (teamStatData === null) {
            interaction.followUp({
                content: "`This team/player is not playing yet...`"
            });
            
            return;
        }

        if (player === null) {
            const timestamp = Date.now();
            const date: any = new Date(timestamp);
            const hours: number = date.getHours();
            const minutes: number = date.getMinutes();

            const t: string = minutes >= 10 ? `Today at ${hours}:${minutes}` : `Today at ${hours}:0${minutes}`

            const teamEmbed = new EmbedBuilder()
                .setTitle(`${getTeamInfo(team, Team.tricode, Team.name)}`)
                .setThumbnail(getTeamLogo(team, Team.tricode))
                .setDescription(t);

            teamStatKeys.forEach((stat, i) => {
                let statValue: number | string = teamStatData[stat as keyof teamStatistics];
                let statValueDisplay: string = `${statValue}`;

                if (statValue % 1 !== 0) {
                    statValue = (statValue * 100).toFixed(2).toString();
                    statValueDisplay = `${statValue}%`;
                }

                teamEmbed.addFields({
                    name: teamStatKeysVerbose[i],
                    value: statValueDisplay,
                    inline: true,
                });
                    
            });
            
            interaction.followUp({
                embeds: [teamEmbed]
            });

            return; /* end here if team stats only */
        }


        /* Check for player existence */
        const playerName = player.value?.toString().toLowerCase();
        const playerStatRaw: any | null = await NBAGetPLayerStats(playerName, gameId, team);

        if (playerStatRaw === null) {
            interaction.followUp({
                content: "`This player does not play for this team or does not exist...`"
            });

            return;
        }

        const playerImageURL = `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerStatRaw.personId}.png`
        if (playerStatRaw.status === "INACTIVE") {  /* Player injured */
            const playerPosition: string = playerStatRaw.position === undefined ? "?" : playerStatRaw.position;
            const injuryEmbed: any = new EmbedBuilder()
                .setTitle(playerStatRaw.name)
                .setDescription(`#${playerStatRaw.jerseyNum} | Position: ${playerPosition}`)
                .setThumbnail(playerImageURL)
                .setTimestamp()
                .addFields(
                    {
                        name: "Status",
                        value: "Injured",
                    },
                    {
                        name: "Reason",
                        value: `${playerStatRaw.notPlayingDescription}`
                    }
                );

            interaction.followUp({
                embeds: [injuryEmbed]
            });

            return;
        }

        const playerStatData: playerStatistics = playerStatRaw.statistics as playerStatistics;
        const playerEmbed: any = new EmbedBuilder()
            .setTitle(playerStatRaw.name)
            .setDescription(`#${playerStatRaw.jerseyNum} | Position: ${playerStatRaw.position}`)
            .setThumbnail(playerImageURL)
            .setTimestamp();

        playerStatKeys.forEach((stat, i) => {
            let statValue: number = playerStatData[stat as keyof playerStatistics];
            let statValueDisplay: string = `${statValue}`;

            if (statValue % 1 !== 0) {
                statValueDisplay = `${(statValue * 100).toFixed(2)}%`;
            }

            if (statValue !== 0) {
                playerEmbed.addFields({
                    name: playerStatKeysVerbose[i],
                    value: statValueDisplay,
                    inline: true,
                });
            }
        });

        interaction.followUp({
            embeds: [playerEmbed]
        });

    }
}