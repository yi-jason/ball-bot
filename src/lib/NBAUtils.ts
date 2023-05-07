import { NBALiveHTTP } from "./NBALiveHTTP"

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

export const NBAGetPLayerStats = async (playerName: string, gameId: string, teamTriCode: string): Promise<any | null> => {
    const gamesStatData: any = await NBALiveHTTP(boxScoreEndPointURL(gameId));
    const playersStatRaw: any = gamesStatData.game.homeTeam.teamTricode.toLowerCase() === teamTriCode 
                    ? gamesStatData.game.homeTeam.players
                    : gamesStatData.game.awayTeam.players;
    
    for (const player of playersStatRaw) {
        const playerFirstName: string = player.firstName.toLowerCase();
        const playerLastName: string = player.familyName.toLowerCase();

        if (playerFirstName.includes(playerName) || playerLastName.includes(playerName)) {
            return player;
        }
    }
    return null;
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

export interface playerStatistics {
    points: number;
    assists: number;
    reboundsTotal: number;
    blocks: number;
    turnovers: number;
    fieldGoalsPercentage: number;
    freeThrowsAttempted: number;
    plusMinusPoints: number;
    threePointersPercentage: number;
    threePointersMade: number;
    foulsPersonal: number;
    foulsTechnical: number;
}

export const teamStatKeys: string[] = ['points', 'assists', 'reboundsTotal', 'blocks', 'turnovers', 'fieldGoalsPercentage', 'trueShootingPercentage', 'freeThrowsAttempted', 'threePointersAttempted', 'threePointersPercentage', 'benchPoints'];
export const teamStatKeysVerbose: string[] = ['Points', 'Assists', 'Rebounds', 'Blocks', 'Turnovers', 'FG%', 'TS%', 'FTA', '3PA', '3P%', 'Bench']
export const playerStatKeys: string[] = ["points", "assists", "reboundsTotal", "blocks", "turnovers", "fieldGoalsPercentage", "freeThrowsAttempted", "plusMinusPoints", "threePointersPercentage", "threePointersMade", "foulsPersonal", "foulsTechnical"];
export const playerStatKeysVerbose: string[] = ["Points", "Assists", "Rebounds", "Blocks", "Turnovers", "FG%", "FTA", "+-", "3P%", "3PM", "Fouls", "Techs"]
