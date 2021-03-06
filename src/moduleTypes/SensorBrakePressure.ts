import {ModuleTypeDefinition} from "../ModuleType";
import Joi from "joi";
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
    encode(raw: any, cfg, dv, offset: number): number {
        dv.setUint16(offset, raw.analogValue, true);
        return 2;
    },

    moduleTypeName: "brake_pressure",

    cfgSchema: Joi.object({}),

    parser: new Parser()
        .endianess("little")
        .uint16("analogValue"),

    convert: (rawData, config) => ({
        pressurePsi: rawData.analogValue * 2
    })
}
