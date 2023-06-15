import { parentPort, workerData } from "worker_threads";
import sharp from "sharp";

const pixelate = async (channelId: string): Promise<string> => {
    const image = sharp(`./img-cache/${channelId}.png`);
    const metadata = await image.metadata();
    const { width, height, channels } = metadata;

    await image.raw().toBuffer((err, data, info) => {
        if (!(width && height && channels)) return;

        const blank: Buffer = Buffer.alloc(width * height * 3);

        for (let i: number = 0; i < width * height; ++i) {
            const r = data[i * channels];
            blank[i * 3] = r;
        }

        sharp(blank, { raw: { width, height, channels: 3 } })
            .toFile("./img-cache/output.jpg", (err) => {
                if (err) {
                    console.error('Error saving image:', err);
                    return;
                }
                console.log(`Image processed and saved successfully. Channels: ${channels}`);
            });
    });

    return "hello world";
}

pixelate(workerData.value)

setTimeout(() => {
    parentPort?.postMessage(
        workerData.value
    );
}, 2000);