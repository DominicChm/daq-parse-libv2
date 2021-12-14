import { SchemaManager } from "./SchemaManager";
import { DaqEncoderOptions } from "./interfaces/DaqEncoderOptions";
export declare class DaqEncoder<S> {
    private schemaManager;
    private activeModuleIds;
    private activeModuleDefinitions;
    constructor(sm: SchemaManager, options: DaqEncoderOptions);
    setActiveModules(moduleIds: string[]): this;
    encode(data: S): Uint8Array;
    encodeHeader(): Uint8Array;
    private static _writeHeader;
    encodeExtendedHeader(): void;
}
