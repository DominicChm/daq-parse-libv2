import { ObjectSchema } from "joi";
import { StructMembers } from "c-type-util";
export interface ModuleTypeDefinition<TConfig extends Object, TConvertedData extends Object, TRawData extends Object> {
    cfgSchema: ObjectSchema<TConfig>;
    rawDataStruct: StructMembers<TRawData>;
    convert: (rawData: TRawData, config: TConfig) => TConvertedData;
    moduleTypeName: string;
}
