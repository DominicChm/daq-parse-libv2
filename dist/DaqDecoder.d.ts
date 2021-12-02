import { SchemaManager } from "./SchemaManager";
declare type CallBack<T> = (data: T) => void;
export declare class DaqDecoder {
    private ph;
    private readonly daqSchema;
    private is_running;
    private readonly onHeader;
    private readonly onData;
    private dataCType;
    constructor(daqSchema: SchemaManager, onData: CallBack<any>, onHeader: CallBack<any>);
    feed(b: number): void;
    parse_runner(): Promise<void>;
    parse_logic(): Promise<void>;
    parse_regular_header(): Promise<void>;
}
export {};
