import {ObjectSchema} from "joi";
import {cStruct, CType, StructMembers} from "c-type-util";

export abstract class ModuleType<ConfigIFace extends Object, DataIFace extends Object> {
    protected config: ConfigIFace;
    protected cType: CType<DataIFace>;

    constructor(config: ConfigIFace, structMembers: StructMembers<DataIFace>) {
        this.config = config;
        this.cType = cStruct(structMembers);
    }

    getCType(): CType<DataIFace> {
        return this.cType;
    }
}

export interface ModuleTypeDefinition<ConfigIFace extends Object, DataIFace extends Object> {
    cfgSchema: ObjectSchema<ConfigIFace>;
    dataStruct: StructMembers<DataIFace>;
    moduleTypeName: string;
}

function createModuleType() {

}
