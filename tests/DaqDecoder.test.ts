import {DaqDecoder} from "../src/DaqDecoder";
import {SchemaManager} from "../src/SchemaManager";
import {SensorBrakePressure} from "../src/moduleTypes/SensorBrakePressure";
import {cString} from "c-type-util";
import {testDAQModules} from "./schema";


const test_header = [
    0xAA, // Regular header
    2, 0, // 2 modules present

    //2 MAC address ids.
    0x00, 0x01, 0x02, 0x03, 0x04, 0x00, 0x00, // Version: 0
    0x00, 0x01, 0x02, 0x03, 0x04, 0x01, 0x05, // Version: 5

    0xDB, 0xE8 //CRC-16 data checksum
];

const bad_checksum_header = [
    0xAA, // Regular header
    2, 0, // 2 modules present

    //2 MAC address ids.
    0x00, 0x01, 0x02, 0x03, 0x04, 0x00, 0x00, // Version: 0
    0x00, 0x01, 0x02, 0x03, 0x04, 0x01, 0x05, // Version: 5

    0, 0//CRC-16 data checksum
];

const extended_header = [
    0xBB, // Regular header
    2, 0, // 2 modules present

    //2 MAC address ids.
    0x00, 0x01, 0x02, 0x03, 0x04, 0x00, 0x00, // Version: 0
    ...cstr(64, "brake_pressure"),
    ...cstr(64, "BP1"),
    ...cstr(128, "BP1 - Description"),


    0x00, 0x01, 0x02, 0x03, 0x04, 0x01, 0x05, // Version: 5
    ...cstr(64, "brake_pressure"),
    ...cstr(64, "BP2"),
    ...cstr(128, "BP2 - Description"),

    0x1F, 0x67 //CRC-16 data checksum
];

const test_data = [
    0x69, // Data header
    0x01, 0x00, //BP1
    0x02, 0x00, //BP2
    0xD5, 0xD3 //CRC-16 checksum
];

describe("DaqDecoder", () => {
    test("regular header parse", (done) => {
        const sm = new SchemaManager(testDAQModules, [SensorBrakePressure]);
        const d = new DaqDecoder(sm, {
            onHeader: () => done(),
            onError: throwErr,
            onData: console.log
        });

        for (let b of test_header)
            d.feed(b);

    })

    test("header bad checksum", (done) => {
        const sm = new SchemaManager(testDAQModules, [SensorBrakePressure]);
        const d = new DaqDecoder(sm, {
            onHeader: noop,
            onError: (err) => done(),
            onData: noop
        });

        for (let b of bad_checksum_header)
            d.feed(b);

    })

    test("header with data", (done) => {
        const expected = {
            BP1: {pressurePsi: 1},
            BP2: {pressurePsi: 2},
        }
        const sm = new SchemaManager(testDAQModules, [SensorBrakePressure]);
        const d = new DaqDecoder(sm,
            {
                onHeader: noop,
                onError: throwErr,
                onData: () => done()
            });

        for (let b of test_header)
            d.feed(b);

        for (let b of test_data)
            d.feed(b);

    });

    test("Extended header", (done) => {
        const expected = {
            BP1: {pressurePsi: 1},
            BP2: {pressurePsi: 2},
        }

        console.log(extended_header);
        const sm = new SchemaManager(testDAQModules, [SensorBrakePressure]);
        const d = new DaqDecoder(sm, {
            onHeader: () => done(),
            onError: throwErr,
            onData: noop,
        });

        for (let b of extended_header)
            d.feed(b);

    });
});

//************ HELPERS ************//
function noop() {
}

function throwErr(err: any) {
    throw err;
}

function cstr(length: number, str: string): number[] {
    return Array.from(new Uint8Array(cString(length).allocLE(str)));
}
