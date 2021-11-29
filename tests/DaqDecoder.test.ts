import {DaqDecoder} from "../src/DaqDecoder";

describe("DaqDecoder", () => {
    test("bulk data input", async () => {
        const h = [
            0xAA, // Regular header
            10, 0, // Data is 10 bytes long
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, //Data
            182 //CRC-8 checksum
        ]

        const d = new DaqDecoder({modules: []}, console.log)
        h.forEach(v => d.feed(v));
        await new Promise(res => setTimeout(res, 20));
    })

    test("spaced input data", async () => {
        const h = [
            0xAA, // Regular header
            15, 0, // Data is 10 bytes long
            1, 0, 0, 2, 0, 1, 3, 0, 0, 4, 0, 0, 5, 0, 0, //5 16 bit IDs (1,2,3,4,5)
            130 //CRC-8 checksum
        ]

        const d = new DaqDecoder({modules: []}, console.log)
        for (let b of h) {
            d.feed(b);
            await new Promise(res => setTimeout(res, 10));
        }
    })
})
