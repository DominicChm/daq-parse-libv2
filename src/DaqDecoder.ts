import {calcChecksum} from "./calcChecksum";
import {SchemaManager} from "./SchemaManager";
import {buf2mac} from "./util/buf2hex";
import {Parser} from "binary-parser";
import {headerParser} from "./parsers/header";
import {crc16} from "./util/crc16";

interface header_data {
    header_type: "regular" | "extended",
    id: number[],
    ver: number
}

type CallBack<T> = (data: T) => void;

export class DaqDecoder {
    private readonly daqSchema: SchemaManager;
    private buf: Uint8Array = new Uint8Array(8192);
    private idx: number = 0;

    private dataParser: Parser = new Parser();
    private parser: Parser;
    //Used to interrupt the async parse loop
    private is_running: boolean = true;

    //Callbacks for different parse events
    private readonly onHeader: CallBack<any>;
    private readonly onData: CallBack<any>;
    private readonly onError: CallBack<Error>;

    constructor(daqSchema: SchemaManager, onData: CallBack<any>, onHeader: CallBack<any>, onError: CallBack<any>) {
        this.daqSchema = daqSchema;
        this.onData = onData;
        this.onHeader = onHeader;
        this.onError = onError;
        this.parser = new Parser();

        this.generateParser(new Parser());
    }

    private generateParser(dataParser: Parser) {
        this.parser = new Parser()
            .endianess("little")
            .uint8("packetType")
            .saveOffset("dataBegin")
            .choice({
                tag: "packetType",
                choices: {
                    0xAA: headerParser,
                    0xBB: headerParser,
                    0x69: dataParser,
                }
            })
            .saveOffset("dataEnd")
            .uint16("checksum");
    }

    private pushError(message: string) {
        setTimeout(() => this.onError(new Error(message)), 0);
    }

    feed(b: number) {
        this.buf[this.idx++] = b
        this.tryParse();
    }

    tryParse() {
        try {
            //Slice the buffer to only attempt parsing of existing data.
            const buf = sliceU8(this.buf, 0, this.idx);

            //Parse - if failure b/c too short, catch.
            const res = this.parser.parse(buf);

            //Something was successfully parsed. Check the checksum
            const checkBuf = sliceU8(buf, res.dataBegin, res.dataEnd);
            const checksum = crc16(checkBuf);

            if (checksum !== res.checksum)
                throw new Error(`Checksums don't match! Actual: >${checksum}<, Expected: >${res.checksum}<`);

            //Checksum OK - pass data to the handler
        } catch (e: any) {
            if (e.name === "RangeError")
                return //These are expected, and just mean there isn't enough data in buf to satisfy parser.

            this.pushError(e);
        }
    }

    private handleValidPacket(packet: any) {
        packet.packetType;
    }

    private handleHeaderPacket(packet: any) {

    }

    private async load_header_data(hd: header_data[]) {
        // //Map each buffer ID into a MAC string
        // const present_modules = hd.map(mDef => ({...mDef, id: buf2mac(mDef.id)}));
        //
        // //Convert found IDs into definitions, from the DAQ schema.
        // const module_definitions = present_modules.map(module => {
        //     const m = this.daqSchema.findById(module.id)
        //
        //     if (!m)
        //         throw new Error(`Data contains module ID ${module.id} which doesn't exist in the DAQ schema.`);
        //
        //     return m;
        // });
        //
        // setTimeout(() => this.onHeader(module_definitions), 0);
        //
        // //Create the new CType to parse future data.
        // const structMembers: { [key: string]: CType<any> } = {};
        //
        // module_definitions.forEach(d => {
        //     structMembers[d.name] = cStruct(d.type.rawDataStruct);
        // });
        //
        // this.dataCType = cStruct(structMembers);
    }
}


function sliceU8(buf: Uint8Array, start: number, stop: number): Uint8Array {
    return new Uint8Array(buf.buffer, buf.byteOffset + start, buf.byteOffset + stop - start);
}