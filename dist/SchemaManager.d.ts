import { DaqSchema, ResolvedModuleDefinition } from "./interfaces/DaqSchema";
import { ModuleTypeDefinition } from "./ModuleType";
export declare class SchemaManager {
    private moduleTypes;
    private daqSchema;
    private resolvedModules;
    private resolvedIdMap;
    constructor(daqSchema: DaqSchema, moduleTypes: ModuleTypeDefinition<any, any, any>[]);
    private loadDaqSchema;
    findById(id: string | Uint8Array): ResolvedModuleDefinition | undefined;
}
