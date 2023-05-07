import { NBALiveHTTP } from "./NBALiveHTTP"
import { teamStatistics } from "../commands/NbaStat";

const scoreboardEndPointURL: string = "scoreboard/todaysScoreboard_00.json";
const boxScoreEndPointURL = (gameId : string) : string => `boxscore/boxscore_${gameId}.json`;


export const NBAGetAllGames = async (): Promise<any> => {
    const responseData: any = await NBALiveHTTP(scoreboardEndPointURL);
    const games: any = responseData.scoreboard.games;

    return games;
}

export const NBAGetTeamStats = async (gameId: string, teamTriCode: string): Promise<teamStatistics> => {
    const gamesStatData: any = await NBALiveHTTP(boxScoreEndPointURL(gameId));
    const teamStatRaw: any = gamesStatData.game.homeTeam.teamTricode.toLowerCase() === teamTriCode 
                    ? gamesStatData.game.homeTeam.statistics
                    : gamesStatData.game.awayTeam.statistics;

    const teamStatVerbose: teamStatistics = {
        ...teamStatRaw
    } as teamStatistics

    return teamStatVerbose;
}

export const NBAGetGameId = async (teamTriCode: string): Promise<string | null> => {
    const games: any = await NBAGetAllGames();

    for (const game of games) {
        const homeTeam: string = game.homeTeam.teamTricode.toLowerCase();
        const awayTeam: string = game.awayTeam.teamTricode.toLowerCase();

        if (homeTeam === teamTriCode || awayTeam === teamTriCode) {
            return game.gameId;
        }
    }

    return null;
}
