import { Client, Message, Events } from "discord.js";
import { Database, DatabaseReference, getDatabase, ref, set } from "firebase/database";

const GIF_STRING: string = "https://tenor.com/view/";

export default (BOT: Client): void => {
    BOT.on(Events.MessageCreate, async (message: Message) => {
        const content: string = message.content;
        const channelId: string = message.channelId;
        console.log(message.content);
        handleMessageGif(content, channelId);
    });
}

const handleMessageGif = (content: string, id: string): void => {
    if (!content.includes(GIF_STRING)) {
        console.log("!GIF DETECTED");
        return;
    }

    const db: Database = getDatabase();
    const reference: DatabaseReference = ref(db, "gif/" + id);
    set(reference, {
        recent: content
    })

    console.log("GIF DETECTED");
}