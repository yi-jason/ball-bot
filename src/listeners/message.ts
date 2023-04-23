import { Client, Message, Events, Snowflake, Attachment, Collection } from "discord.js";
import { Database, DatabaseReference, getDatabase, ref, set } from "firebase/database";

const GIF_PREFIX: string = "https:\/\/tenor.com\/view";
const IMAGE_SUFFIX: string = "\.(jpg|jpeg|png|tiff|tif|webp)";

const GIF_REGEX: RegExp = new RegExp(GIF_PREFIX);
const IMAGE_REGEX: RegExp = new RegExp(IMAGE_SUFFIX);

export default (BOT: Client): void => {
    BOT.on(Events.MessageCreate, async (message: Message) => {
        const content: string = message.content;
        const channelId: string = message.channelId;

        handleMessageGif(content, channelId);
        handleMessageImage(message, channelId);
    });
}

const handleMessageGif = (content: string, id: string): void => {
    if (!GIF_REGEX.test(content)) {
        console.log(content)
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