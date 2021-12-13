import {DaqEncoder} from "../src/DaqEncoder";
import {SchemaManager} from "../src/SchemaManager";
import {testDAQModules} from "./schema";
import {SensorBrakePressure} from "../src/moduleTypes/SensorBrakePressure";

const sm = new SchemaManager(testDAQModules, [SensorBrakePressure]);
const d = new DaqEncoder(sm, {});

describe("DaqEncoder", () => {
    it("errors on encode w/o active modules", () => {
        expect(d.encode).toThrow();
        expect(d.encodeHeader).toThrow();
        expect(d.encodeExtendedHeader).toThrow();
    });

    it("encodes a simple header", () => {
        d.setActiveModules(["00:01:02:03:04:00"]);

        expect(d.encodeHeader()).toEqual(new Uint8Array([
            0xAA,
            0x01, 0x00, //Length in # of blocks
            0x00, 0x01, 0x02, 0x03, 0x04, 0x00, 0x00, //MAC + version
            21, 168
        ]));
    });

    it("encodes a slightly more complex header", () => {
        d.setActiveModules(["00:01:02:03:04:00", "00:01:02:03:04:01"]);

        expect(d.encodeHeader()).toEqual(new Uint8Array([
            0xAA, // Regular header
            2, 0, // 2 modules present

            //2 MAC address ids.
            0x00, 0x01, 0x02, 0x03, 0x04, 0x00, 0x00, // Version: 0
            0x00, 0x01, 0x02, 0x03, 0x04, 0x01, 0x05, // Version: 5

            0xDB, 0xE8 //CRC-16 data checksum
        ]));
    });

    it("encodes some data", () => {
        d.setActiveModules(["00:01:02:03:04:00"]);

        expect(d.encode({BP1: {analogValue: 0x55}})).toEqual(new Uint8Array([
            0x69, // Regular header
            0x55, 0x00, // BP1 Data
            162, 8 //CRC-16 data checksum
        ]));
    });
})
