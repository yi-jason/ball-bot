import { parentPort, workerData } from "worker_threads";
import sharp from "sharp";

let tally = 0;

const pixelate = async (channelId: string, factor: number): Promise<string> => {
    const image = sharp(`./img-cache/${channelId}.png`);
    const metadata = await image.metadata();
    const { width, height, channels } = metadata;

    if (!(width && height && channels)) return "hello world";

    let rWidth: number = width + (factor - (width % factor));
    let rHeight: number = height;

    await image.raw().resize({width: rWidth, height: rHeight}).toBuffer((err, data, info) => {
        const blank: Buffer = Buffer.alloc(rWidth * rHeight * channels);

        let blockWidth: number = rWidth / factor;
        let blockImageWidth: number = rWidth / blockWidth;
        let blockImageHeight: number = rHeight / blockWidth;
        let blockPixelCount: number = blockWidth * blockWidth;
        let blockHeightIndex: number = -1;

        for (let i: number = 0; i < blockImageWidth * blockImageHeight; ++i) {

            if (i % blockImageWidth == 0) blockHeightIndex++;
            
            // blockHeightIndex * pixelateImageWidth * blockPixelCount * channels - (blockHeightIndex * width * channels);
            // blockHeightIndex * channels * (pixelateImageWidth * blockPixelCount - width);

            const blockHeightOffset = Math.max(0, blockHeightIndex * channels * (blockImageWidth * blockPixelCount - rWidth));
            const blockIndex: number = i * blockWidth * channels + (blockHeightOffset);

            let redTotal: number = 0;
            let greenTotal: number = 0;
            let blueTotal: number = 0;
            
            let pixelHeightIndex: number = -1;

            for (let j: number = 0; j < blockPixelCount; ++j) {
                if (j % blockWidth == 0) pixelHeightIndex++;
                
                const pixelHeightOffset = pixelHeightIndex * (rWidth) * channels;
                const pixelPosition: number = blockIndex + ((j % blockWidth) * channels) + (pixelHeightOffset);

                redTotal += data[pixelPosition];
                greenTotal += data[pixelPosition + 1];
                blueTotal += data[pixelPosition + 2];
                tally++;
            }

            const averageRed: number = redTotal / blockPixelCount;
            const averageGreen: number = greenTotal / blockPixelCount;
            const averageBlue: number = blueTotal / blockPixelCount;

            pixelHeightIndex = -1;

            for (let j: number = 0; j < blockPixelCount; ++j) {
                if (j % blockWidth == 0) pixelHeightIndex++;
                
                const pixelHeightOffset = pixelHeightIndex * (rWidth) * channels;
                const pixelPosition: number = blockIndex + ((j % blockWidth) * channels) + (pixelHeightOffset);

                blank[pixelPosition] = averageRed;
                blank[pixelPosition + 1] = averageGreen;
                blank[pixelPosition + 2] = averageBlue;
            }


            //     tally++;
            // }

            // blank[blockIndex] = 255;
            // blank[blockIndex + 1] = 255;
            // blank[blockIndex + 2] = 255;
            // const redAverage: number = redTotal / blockPixelCount;
            // const blueAverage: number = blueTotal / blockPixelCount;
            // const greenAverage: number = greenTotal / blockPixelCount;
            
            // for (let j: number = blockIndex; j < blockPixelCount; ++j) {
            //     blank[j * channels] = redAverage;
            //     blank[j * channels + 1] = blueAverage;
            //     blank[j * channels + 2] = greenAverage;

            //     if (channels == 4) blank[j * channels + 3] = 1;
            // } 

            // const r = data[i * channels];
            // blank[i * channels] = r;
        }
        
        sharp(blank, { raw: { width: rWidth, height: rHeight, channels: channels } })
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

pixelate(workerData.id, workerData.factor);

setTimeout(() => {
    parentPort?.postMessage(
        tally.toString()
    );
}, 2000);