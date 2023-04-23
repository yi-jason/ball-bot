import { Client, Message, Events } from "discord.js";
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
        handleMessageImage(content, channelId);
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
        gif_recent: content
    })

    console.log("BOT: [GIF DETECTED]");
}

const handleMessageImage = (content: string, id: string): void => {
    if (!IMAGE_REGEX.test(content.toLowerCase())) {
        return;
    }

    const db: Database = getDatabase();
    const reference: DatabaseReference = ref(db, "channel-img/" + id);
    set(reference, {
        img_recent: content
    })

    console.log("BOT: [IMAGE DETECTED]");
}