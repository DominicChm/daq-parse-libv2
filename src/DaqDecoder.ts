import {cStruct, CType, StructMembers, uint16, uint8} from "c-type-util";
import {DaqSchema} from "./interfaces/DaqSchema";
import {calcChecksum} from "./calcChecksum";
import {PacketParseHelper} from "./PacketParseHelper";
import * as timers from "timers";

const regular_header_block_ctype = cStruct({
    id: uint16,
    ver: uint8,
})

export class DaqDecoder {
    private ph: PacketParseHelper = new PacketParseHelper();
    private readonly daqSchema: DaqSchema;
    private is_running: boolean = true;

    constructor(daqSchema: DaqSchema, onParse: (data: any) => void) {
        this.daqSchema = daqSchema;
        this.parse_runner().then(r => console.log("RUNNER STOPPED!!!!!!"));
    }

    feed(b: number) {
        this.ph.feed(b);
    }

    async parse_runner() {
        while (this.is_running) {
            try {
                await this.parse_logic();
            } catch (e) {
                console.log(e);
            }
        }
    }

    async parse_logic() {
        const cmd = await this.ph.cType(uint8);
        switch (cmd) {
            case 0xAA:
                await this.parse_regular_header();
                break
            default:
                throw new Error(`Unknown Command byte ${cmd}`);
        }
    }

    async parse_regular_header() {
        const len = await this.ph.cType(uint16);
        const data = await this.ph.bytes(len);
        const checksum = await this.ph.cType(uint8);

        const dataBuf = new Uint8Array(data).buffer;
        const calculatedChecksum = calcChecksum(dataBuf);

        if (calculatedChecksum !== checksum)
            throw new Error(`Corrupt packet - checksums don't match. Actual: >${checksum}<, expected: >${calculatedChecksum}<`)

        let ids = [];
        for (let i = 0; i < dataBuf.byteLength; i += regular_header_block_ctype.size)
            ids.push(regular_header_block_ctype.readLE(dataBuf, i));


        console.log(len, data, checksum, ids);
    }
}
