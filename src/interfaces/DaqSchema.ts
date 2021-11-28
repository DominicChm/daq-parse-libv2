import {ModuleType} from "../ModuleType";

interface ModuleDefinition {
    id: number;
    name: string;
    description: string;

    type: ModuleType<any, any>
}

export interface DaqSchema {
    modules: ModuleDefinition[];
}
