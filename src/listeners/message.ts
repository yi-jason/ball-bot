import color from "ansi-colors";
import { Client, Message, Events, Snowflake, Attachment, Collection, TextChannel, GuildBasedChannel } from "discord.js";
import { Database, DatabaseReference, getDatabase, onValue, ref, set } from "firebase/database";

const GIF_PREFIX: string = "https:\/\/tenor.com\/view";
const IMAGE_SUFFIX: string = "\.(jpg|jpeg|png|tiff|tif|webp)";

const GIF_REGEX: RegExp = new RegExp(GIF_PREFIX);
const IMAGE_REGEX: RegExp = new RegExp(IMAGE_SUFFIX);

const CODE_PREFIX: string = "```"

export default (BOT: Client): void => {
    BOT.on(Events.MessageCreate, async (message: Message) => {
        const content: string = message.content;
        const channelId: string = message.channelId;
        const userId: string = message.author.id;

        handleMessageGif(message, channelId);
        handleMessageImage(message, channelId);
        handleMessageCode(message, channelId);
        handleEthanDelete(message, userId);

        if (message.guild != null) {
            const c: GuildBasedChannel | undefined | string = message.guild.channels.cache.find(channel => channel.id === channelId);
            let channelName: string | null = null;
            
            if (c != undefined) {
                channelName = c.name;
            }

            process.stdout.write(color.red(color.bold(message.guild.name)));
            process.stdout.write(`: (${color.blue("#" + channelName)} ${color.green("@" + message.author.username)}): ${content}\n`);
        }
    });
}

const handleMessageGif = (message: Message, id: string): void => {
    const content: string = message.content;

    if (!GIF_REGEX.test(content)) {
        return;
    }

    const db: Database = getDatabase();
    const reference: DatabaseReference = ref(db, "channel-gif/" + id);
    set(reference, {
        recent: content
    })

    console.log("BOT: [GIF DETECTED]");
}

const handleMessageImage = (message: Message, id: string): void => {
    let content: string = message.content;
    const messageAttachments: Collection<Snowflake, Attachment> = message.attachments;
    
    if (messageAttachments == undefined || messageAttachments.size === 0) {
        return;
    } else {
        const attachments: Attachment | undefined = messageAttachments.at(0);

        if (attachments != undefined) {
            content = attachments.url;
        }
    }

    if (!IMAGE_REGEX.test(content.toLowerCase())) {
        return;
    }

    const db: Database = getDatabase();
    const reference: DatabaseReference = ref(db, "channel-img/" + id);
    set(reference, {
        recent: content
    })

    console.log("BOT: [IMAGE DETECTED]");
}

const handleMessageCode = (message: Message, id: string): void => {
    const codeUnparsed: string = message.content.trim();

    if (codeUnparsed.slice(0, 3) !== CODE_PREFIX 
        || codeUnparsed.slice(codeUnparsed.length - 3) !== CODE_PREFIX) return;

    const lang: string = codeUnparsed.split('\n')[0].slice(3);
    const codeParsed: string = codeUnparsed.slice(lang.length + CODE_PREFIX.length, codeUnparsed.length - CODE_PREFIX.length);

    if (lang === "py" || lang === "python")  {
        const db: Database = getDatabase();
        const reference: DatabaseReference = ref(db, "channel-code/" + id);
        set(reference, {
            source: codeParsed,
            language: lang,
        })


        console.log("BOT: [PYTHON CODE DETECTED]");
        console.log(codeParsed);
    }

}

const handleEthanDelete = (message: Message, userId: string): void => {
    if (userId == '254814476786728960') {
        const db: Database = getDatabase();
        const reference: DatabaseReference = ref(db, "ethan-del/");
        onValue(reference, async (snapshot) => {
            if (snapshot.exists() && snapshot.val()) {
                setTimeout(() => message.delete(), 1000)
            }
          }, {
            onlyOnce: true
        });
    }
}