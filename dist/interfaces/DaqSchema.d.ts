import { ModuleTypeDefinition } from "../ModuleType";
export interface ModuleDefinition {
    id: string;
    name: string;
    description: string;
    typeName: string;
    config: Object;
    version?: number;
}
export interface ResolvedModuleDefinition extends ModuleDefinition {
    type: ModuleTypeDefinition<any, any, any>;
}
