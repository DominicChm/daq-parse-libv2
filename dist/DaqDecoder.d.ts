import { SchemaManager } from "./SchemaManager";
import { DaqDecoderOptions } from "./interfaces/DaqDecoderOptions";
export declare class DaqDecoder {
    private readonly daqSchema;
    private buf;
    private idx;
    private max_packet_len;
    private dataParser;
    private parser;
    private dataConverters;
    private is_running;
    private options;
    constructor(daqSchema: SchemaManager, options: Partial<DaqDecoderOptions>);
    /**
     * Generates the Decoder's parser
     * @param dataParser {Parser} The data-specific parser. Usually generated from a packet header
     * @private
     */
    private generateParser;
    private pushError;
    feed(b: number): any | undefined;
    tryParse(): any;
    private handleValidPacket;
    private handleExtendedHeaderPacket;
    private handleDataPacket;
    private handleHeaderPacket;
}
