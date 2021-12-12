import {ModuleTypeDefinition} from "../ModuleType";
import {cStruct, StructMembers, uint16} from "c-type-util";
import Joi, {ObjectSchema} from "joi";
import {Parser} from "binary-parser";

interface SBPRaw {
    analogValue: number;
}

interface SBPConverted {
    pressurePsi: number;
}

interface SBPConfig {

}

export const SensorBrakePressure: ModuleTypeDefinition<SBPConfig, SBPConverted, SBPRaw> = {
    encode(raw: any, dv, offset: number): number {
        dv.setUint16(raw.analogValue, offset);
        dv.setUint16(raw.analogValue, offset + 2);
        return 4;
    },
    moduleTypeName: "brake_pressure",
    cfgSchema: Joi.object({}),
    parser: new Parser()
        .endianess("little")
        .uint16("analogValue"),
    convert: (rawData, config) => ({
        pressurePsi: rawData.analogValue
    })
}
