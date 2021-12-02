import { ModuleTypeDefinition } from "../ModuleType";
export interface ModuleDefinition {
    id: string;
    name: string;
    description: string;
    typeName: string;
    config: Object;
}
export interface DaqSchema {
    modules: ModuleDefinition[];
}
export interface ResolvedModuleDefinition extends ModuleDefinition {
    type: ModuleTypeDefinition<any, any, any>;
}
