import { DiscordjsError } from "discord.js";

const MD_STD_PREFIX: string = "```\n";
const MD_ERROR_PREFIX: string = "```diff\n"

const MD_STD_SUFFIX: string = "\n```";

export const standardOutputFormat = (text: string): string => {
    return MD_STD_PREFIX.concat(text).concat(MD_ERROR_PREFIX);
}

// export const standardErrorFormat = (text: string): string => {
//     return MD_ERROR_PREFIX.concat(text).concat(MD_ERROR_PREFIX);
// }

// export const standardErrorFormat = (text: string): string => {
//     return MD_ERROR_PREFIX.concat(text).concat(MD_ERROR_PREFIX);
// }