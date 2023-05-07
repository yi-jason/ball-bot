 import axios, { AxiosResponse } from 'axios';

const baseURL: string = "https://cdn.nba.com/static/json/liveData/";

const NBALiveRequest = async (url: string): Promise<void> => {
    try {
        const res: AxiosResponse = await axios.get(url);
        return res.data;

    } catch (e) {
        console.log(e);
    }

    return undefined;
}

/*
export const NBARosterHTTP = async (endpointURL: string, teamId: number): Promise<void> => {
    const res: AxiosResponse = await axios.get('https://stats.nba.com/stats/commonteamroster', {
        params: {
            TeamID: 1610612747,
            Season: '2023-24',
            LeagueID: '00'
        }
    })

    console.log(res.data);
} */

export const NBALiveHTTP = async (endpointURL: string): Promise<void> => {
    const requestURL = baseURL.concat(endpointURL);
    const data: any = await NBALiveRequest(requestURL);

    console.log(requestURL);

    return data;
}