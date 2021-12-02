import {cArray, cStruct, CType, StructMembers, uint16, uint8} from "c-type-util";
import {calcChecksum} from "./calcChecksum";
import {PacketParseHelper} from "./PacketParseHelper";
import * as timers from "timers";
import {SchemaManager} from "./SchemaManager";
import {buf2mac} from "./util/buf2hex";

const regular_header_block_ctype = cStruct({
    id: cArray(uint8, 6), //6-byte ID = MAC
    ver: uint8,
})

type CallBack<T> = (data: T) => void;

export class DaqDecoder {
    private ph: PacketParseHelper = new PacketParseHelper();
    private readonly daqSchema: SchemaManager;
    private is_running: boolean = true;

    private readonly onHeader: CallBack<any>;
    private readonly onData: CallBack<any>;
    private dataCType: CType<object> | undefined;


    constructor(daqSchema: SchemaManager, onData: CallBack<any>, onHeader: CallBack<any>) {
        this.daqSchema = daqSchema;
        this.onData = onData;
        this.onHeader = onHeader;

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
                console.error(e);
            }
        }
    }

    async parse_logic() {
        const cmd = await this.ph.cType(uint8);
        switch (cmd) {
            case 0xAA:
                await this.parse_regular_header();
                break;
            case 0x69:
                await this.parse_data();
                break;
            default:
                throw new Error(`Unknown Command byte ${cmd}`);
        }
    }

    async parse_regular_header() {
        this.ph.resetChecksum();

        const len = await this.ph.cType(uint16);
        const data = await this.ph.bytes(len * regular_header_block_ctype.size, true);
        const checksum = await this.ph.uint8_checksum();

        const dataBuf = new Uint8Array(data).buffer;

        let present_modules = [];
        for (let i = 0; i < dataBuf.byteLength; i += regular_header_block_ctype.size) {
            const raw = regular_header_block_ctype.readLE(dataBuf, i);
            present_modules.push({id: buf2mac(raw.id), ver: raw.ver});
        }

        //Convert found IDs into definitions, from the DAQ schema.
        const module_definitions = present_modules.map(module => {
            const m = this.daqSchema.findById(module.id)

            if (!m)
                throw new Error(`Data contains module ID ${module.id} which doesn't exist in the DAQ schema.`);

            return m;
        });

        setImmediate(this.onHeader, module_definitions);

        //Create the new CType to parse future data.
        const structMembers: { [key: string]: CType<any> } = {};

        module_definitions.forEach(d => {
            structMembers[d.name] = cStruct(d.type.rawDataStruct);
        });

        this.dataCType = cStruct(structMembers);
        //console.log(len, data, checksum, module_definitions);
    }

    async parse_data() {
        if (!this.dataCType)
            throw new Error(`Data header received without a loaded CType!`);

        this.ph.resetChecksum();

        const data = await this.ph.cType(this.dataCType);
        const checksum = await this.ph.uint8_checksum();
    }
}
