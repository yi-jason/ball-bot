import color from "ansi-colors";
import { Client, Message, Events, Snowflake, Attachment, Collection, TextChannel, GuildBasedChannel } from "discord.js";
import { Database, DatabaseReference, getDatabase, onValue, ref, set } from "firebase/database";
import { Gif } from "../commands/Gif";

const GIF_PREFIX = "https://tenor.com/view";
const IMAGE_SUFFIX = /\.(jpg|jpeg|png|tiff|tif|webp)/;
const GIF_REGEX = new RegExp(GIF_PREFIX);
const IMAGE_REGEX = new RegExp(IMAGE_SUFFIX);
const CODE_PREFIX = "```";

export default (BOT: Client): void => {
    BOT.on(Events.MessageCreate, async (message: Message) => {
        const { content, channelId, author, guild } = message;
        const userId = author.id;

        handleMessageGif(message, channelId);
        handleMessageImage(message, channelId);
        handleMessageCode(message, channelId);
        handleEthanDelete(message, userId);
        handleLegacyGifCommand(BOT, message, channelId);

        if (guild) {
            const channel = guild.channels.cache.get(channelId) as GuildBasedChannel;
            const channelName = channel ? channel.name : null;

            process.stdout.write(color.red(color.bold(guild.name)));
            process.stdout.write(`: (${color.blue("#" + channelName)} ${color.green("@" + author.username)}): ${content}\n`);
        }
    });
};

const handleMessageGif = (message: Message, id: string): void => {
    const { content } = message;

    if (!GIF_REGEX.test(content)) return;

    const db = getDatabase();
    const reference = ref(db, "channel-gif/" + id);
    set(reference, { recent: content });

    console.log("BOT: [GIF DETECTED]");
};

const handleMessageImage = (message: Message, id: string): void => {
    let { content } = message;
    const { attachments } = message;

    if (!attachments.size) return;

    const attachment = attachments.first();
    if (attachment) content = attachment.url;

    if (!IMAGE_REGEX.test(content.toLowerCase())) return;

    const db = getDatabase();
    const reference = ref(db, "channel-img/" + id);
    set(reference, { recent: content });

    console.log("BOT: [IMAGE DETECTED]");
};

const handleMessageCode = (message: Message, id: string): void => {
    const codeUnparsed = message.content.trim();

    if (!codeUnparsed.startsWith(CODE_PREFIX) || !codeUnparsed.endsWith(CODE_PREFIX)) return;

    const lang = codeUnparsed.split('\n')[0].slice(3);
    const codeParsed = codeUnparsed.slice(lang.length + CODE_PREFIX.length, -CODE_PREFIX.length);

    if (lang === "py" || lang === "python") {
        const db = getDatabase();
        const reference = ref(db, "channel-code/" + id);
        set(reference, { source: codeParsed, language: lang });

        console.log("BOT: [PYTHON CODE DETECTED]");
        console.log(codeParsed);
    }
};

const handleEthanDelete = (message: Message, userId: string): void => {
    if (userId !== '254814476786728960') return;

    const db = getDatabase();
    const reference = ref(db, "ethan-del/");
    onValue(reference, async (snapshot) => {
        if (snapshot.exists() && snapshot.val()) {
            setTimeout(() => message.delete(), 1000);
        }
    }, { onlyOnce: true });
};

const handleLegacyGifCommand = (BOT: Client, message: Message, id: string): void => {
    const messageCommand = message.content.split(" ")[0].toLowerCase();

    const fetchRespondLegacyGif = (prefix: string, fbSection: string): void => {
        const gif = message.content.slice(prefix.length + 1);

        const db = getDatabase();
        const reference = ref(db, fbSection + gif);

        onValue(reference, async (snapshot) => {
            if (snapshot.exists()) {
                const url = snapshot.val().url;
                await message.channel.send(url);
            } else {
                await message.channel.send(`**GIF "${gif}" does not exist!**`);
            }
        }, { onlyOnce: true });
    };

    const genericGifPrefix = ".g";
    const rggGifPrefix = ".rgg";

    if (messageCommand === genericGifPrefix) {
        fetchRespondLegacyGif(genericGifPrefix, "gif-list/");
    } else if (messageCommand === rggGifPrefix) {
        fetchRespondLegacyGif(rggGifPrefix, "rgg-gif-list/");
    }
};