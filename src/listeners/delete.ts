import { PartialMessage } from "discord.js";
import { Client, Message, Events, Snowflake, Attachment, Collection } from "discord.js";
import { Database, DatabaseReference, getDatabase, ref, set } from "firebase/database";

export default (BOT: Client): void => {
    BOT.on(Events.MessageDelete, async (message: Message | PartialMessage) => {
        const content: string | null = message.content;
        const channelId: string = message.channelId;
        const messageAttachments: Collection<Snowflake, Attachment> = message.attachments;
        let messageAttachmentURL: string;

        if (content == null) {
            return;
        }

        if (messageAttachments == undefined || messageAttachments.size === 0) {
            return;
        } else {
            const attachments: Attachment | undefined = messageAttachments.at(0);
    
            if (attachments != undefined) {
                messageAttachmentURL = attachments.url;
            }
        }

        const db: Database = getDatabase();
        const reference: DatabaseReference = ref(db, "channel-snipe/" + channelId);
        set(reference, {
            recent: content
        })

        console.log("BOT: [DELETION]");
    });
}

