import dotenv from "dotenv"
dotenv.config();

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) {
    throw new Error("MISSING ENVIRONMENT VARIABLES: TOKEN")
}

const config: Record<string, string> = {
    BOT_TOKEN,
}

export default config;