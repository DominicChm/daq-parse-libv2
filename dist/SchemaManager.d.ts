import { ModuleDefinition, ResolvedModuleDefinition } from "./interfaces/DaqSchema";
import { ModuleTypeDefinition } from "./ModuleType";
export declare class SchemaManager {
    private moduleTypes;
    private moduleDefinitions;
    private resolvedIdMap;
    private resolvedNameMap;
    constructor(moduleDefinitions: ModuleDefinition[], moduleTypes: ModuleTypeDefinition<any, any, any>[]);
    private loadModuleDefinitions;
    findById(id: string | Uint8Array): ResolvedModuleDefinition;
    findByName(id: string): ResolvedModuleDefinition | undefined;
}
