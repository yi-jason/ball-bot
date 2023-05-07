import { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionData, Colors, CommandInteractionOption } from "discord.js";
import { Command } from "../Command";
import { NBAGetGameId, NBAGetTeamStats } from "../lib/NBAUtils";
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

export interface teamStatistics {
    points: number;
    assists: number;
    reboundsTotal: number;
    blocks: number;
    turnovers: number;
    fieldGoalsPercentage: number;
    trueShootingPercentage: number;
    freeThrowsAttempted: number;
    threePointersAttempted: number;
    threePointersPercentage: number;
    benchPoints: number;
}

const statKeys: string[] = ['points', 'assists', 'reboundsTotal', 'blocks', 'turnovers', 'fieldGoalsPercentage', 'trueShootingPercentage', 'freeThrowsAttempted', 'threePointersAttempted', 'threePointersPercentage', 'benchPoints'];

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

        if (team === undefined) return;

        const gameId: string | null = await NBAGetGameId(team.toLowerCase());

        if (gameId === null) {
            interaction.followUp({
                content: "`Unrecognized team or not playing...`",
            });

            return;
        }

        const teamStatData: teamStatistics = await NBAGetTeamStats(gameId, team);

        const teamEmbed = new EmbedBuilder()
            .setTitle(`${getTeamInfo(team, Team.tricode, Team.name)}`)
            .setThumbnail(getTeamLogo(team, Team.tricode))
        
        for (const stat in teamStatData) {
            if (statKeys.includes(stat)) {
                let statValue: number | string = teamStatData[stat as keyof teamStatistics];
                let statValueDisplay: string = `${statValue}`;

                if (statValue % 1 !== 0) {
                    statValue = (statValue * 100).toFixed(2).toString();
                    statValueDisplay = `${statValue}%`;
                }

                teamEmbed.addFields({
                    name: stat,
                    value: statValueDisplay,
                });
            }
                
        }
        
        interaction.followUp({
            embeds: [teamEmbed]
        });
    }
}