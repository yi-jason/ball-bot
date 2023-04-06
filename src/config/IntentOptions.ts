import { IntentsBitField, GatewayIntentBits } from "discord.js"

export const IntentOptions = [
    IntentsBitField.Flags.Guilds, 
    IntentsBitField.Flags.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
]