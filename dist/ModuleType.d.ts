import { ObjectSchema } from "joi";
import { Parser } from "binary-parser";
export interface ModuleTypeDefinition<TConfig extends Object, TConvertedData extends Object, TRawData extends Object> {
    cfgSchema: ObjectSchema<TConfig>;
    parser: Parser;
    encode: (raw: TRawData, config: TConfig, buf: DataView, offset: number) => number;
    convert: (rawData: TRawData, config: TConfig) => TConvertedData;
    moduleTypeName: string;
}
