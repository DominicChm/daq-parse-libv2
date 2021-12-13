import {SchemaManager} from "./SchemaManager";
import {Parser} from "binary-parser";
import {headerParser} from "./parsers/header";
import {crc16} from "./util/crc16";
import {ModuleTypeDefinition} from "./ModuleType";
import {ResolvedModuleDefinition} from "./interfaces/DaqSchema";
import {extendedHeaderParser} from "./parsers/extendedHeader";
import {sliceU8} from "./util/ArrayUtils";
import {buf2mac} from "./util/MACUtil";

interface headerData {
    id: Uint8Array,
    ver: number
}

interface DaqDecoderOptions {
    onData: CallBack<any>;
    onHeader: CallBack<any>;
    onError: CallBack<any>;
    ids: string[];
}

type CallBack<T> = (data: T) => void;

export class DaqDecoder {
    private readonly daqSchema: SchemaManager;
    private buf: Uint8Array = new Uint8Array(8192);
    private idx: number = 0;
    private max_packet_len = 4096;

    private dataParser: Parser = new Parser();
    private parser: Parser;

    private dataConverters: [string, ResolvedModuleDefinition][] = [];
    //Used to interrupt the async parse loop
    private is_running: boolean = true;

    private options: DaqDecoderOptions = {
        onData() {
        },
        onError() {
        },
        onHeader() {
        },
        ids: [],
    }

    constructor(daqSchema: SchemaManager, options: Partial<DaqDecoderOptions>) {
        this.daqSchema = daqSchema;
        this.options = {...this.options, ...options};
        this.parser = new Parser();

        this.generateParser(new Parser());
    }

    /**
     * Generates the Decoder's parser
     * @param dataParser {Parser} The data-specific parser. Usually generated from a packet header
     * @private
     */
    private generateParser(dataParser: Parser) {
        this.parser = new Parser()
            .endianess("little")
            .uint8("packetType")
            .saveOffset("dataBegin")
            .choice({
                tag: "packetType",
                choices: {
                    0xAA: headerParser,
                    0xBB: extendedHeaderParser,
                    0x69: dataParser,
                }
            })
            .saveOffset("dataEnd")
            .uint16("checksum")
            .saveOffset("len");
    }

    private pushError(message: string) {
        this.options.onError(new Error(message)); //setTimeout(() => this.options.onError(new Error(message)), 0);
    }

    feed(b: number): any | undefined {
        this.buf[this.idx++] = b
        return this.tryParse();
    }

    tryParse(): any {
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

            //Shift this packet out of the buffer
            this.buf.copyWithin(0, res.len);
            this.idx -= res.len;

            //Checksum OK - pass data to the handler
            return this.handleValidPacket(res);

        } catch (e: any) {
            //shift front off of buffer.
            if (this.idx > this.max_packet_len) {
                this.buf.copyWithin(0, 1);
                this.idx--;
                this.pushError("Max packet length reached!!! Searching for new start.");

            } else if (e.name === "RangeError")
                return //These are expected, and just mean there isn't enough data in buf to satisfy parser.
            else
                this.pushError(e);
        }
    }

    private handleValidPacket(packet: any): any {
        return ({
            0xAA: this.handleHeaderPacket.bind(this),
            0xBB: this.handleExtendedHeaderPacket.bind(this),
            0x69: this.handleDataPacket.bind(this)
        } as any)[packet.packetType](packet);
    }

    private handleExtendedHeaderPacket(packet: any) {
        console.log("EXTENDED PACKET");
        //TODO: Do something with this extra info...
        this.handleHeaderPacket(packet);
    }

    private handleDataPacket(packet: any) {
        //Convert "raw" input object by applying converter.
        const convertedPacket: any = {};
        this.dataConverters.forEach(([name, typeDef]) =>
            convertedPacket[name] = typeDef.type.convert(packet[name], typeDef.config)
        );

        this.options.onData(convertedPacket); //setTimeout(() => , 0);

        packet.type = "data"
        return packet
    }

    private handleHeaderPacket(packet: any) {
        const hd = packet.modules as headerData[];

        //Map each buffer ID into a MAC string
        const present_modules = hd.map(mDef => ({...mDef, id: buf2mac(mDef.id)}));

        //Convert found IDs into definitions, from the DAQ schema.
        const module_definitions = present_modules.map(module => this.daqSchema.findById(module.id));

        this.options.onHeader(module_definitions) //setTimeout(() => , 0);

        //Create the new parser using the parsers defined by each module.
        const p = new Parser();
        this.dataConverters = [];

        module_definitions.forEach(d => {
            p.nest(d.name, {type: d.type.parser});
            this.dataConverters.push([d.name, d]);
        });

        this.generateParser(p);

        packet.type = "header"
        return packet
    }
}
