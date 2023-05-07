 import axios, { AxiosResponse } from 'axios';

const baseURL: string = "https://cdn.nba.com/static/json/liveData/";

const NBALiveRequest = async (url: string): Promise<void> => {
    const res: AxiosResponse = await axios.get(url);
    return res.data;
}

export const NBALiveHTTP = async (endpointURL: string): Promise<void> => {
    const requestURL = baseURL.concat(endpointURL);
    console.log(requestURL);
    const data: any = await NBALiveRequest(requestURL);

    return data;
}