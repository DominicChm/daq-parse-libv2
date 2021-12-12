import {SchemaManager} from "./SchemaManager";
import {DaqEncoderConfig} from "./interfaces/DaqEncoderConfig";
import {ResolvedModuleDefinition} from "./interfaces/DaqSchema";
import {sliceU8, createDv} from "./ArrayUtils";

export class DaqEncoder<S> {
    private schemaManager: SchemaManager;
    private activeModuleIds: string[] = [];
    private activeModuleDefinitions: ResolvedModuleDefinition[] = [];

    constructor(sm: SchemaManager, options: DaqEncoderConfig) {
        this.schemaManager = sm;


    }

    setActiveModules(moduleIds: string[]) {
        this.activeModuleIds = moduleIds;
        this.activeModuleDefinitions = this.activeModuleIds.map(this.schemaManager.findById);
    }

    encode(data: S): Uint8Array {
        const buf = new Uint8Array(8192);
        const dv = createDv(buf);
        let offset = 0;
        for (const def of this.activeModuleDefinitions)
            offset += def.type.encode(dv, offset);

        return sliceU8(buf, 0, offset);
    }

    encodeHeader() {

    }

    encodeExtendedHeader() {

    }

}
