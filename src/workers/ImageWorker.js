//require('ts-node').register();
const { parentPort } = require("worker_threads");


let n = 0;
for (let i = 0; i < 10000000000; ++i) {
    n++;
}

parentPort?.postMessage(n);