import {ModuleTypeDefinition} from "../ModuleType";

export interface ModuleDefinition {
    id: string; //Mac address
    name: string;
    description: string;
    typeName: string;
    config: Object;
    version?: number;
}

//Contains extra, non-serializable information about modules used in other parts of the program.
export interface ResolvedModuleDefinition extends ModuleDefinition {
    type: ModuleTypeDefinition<any, any, any>
}
