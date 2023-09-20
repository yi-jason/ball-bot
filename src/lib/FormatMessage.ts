const MD_STD_PREFIX: string = "```\n";
const MD_ERROR_PREFIX: string = "```diff\n"

export const standardOutputFormat = (text: string): string => {
    return MD_STD_PREFIX.concat(text).concat(MD_ERROR_PREFIX);
}