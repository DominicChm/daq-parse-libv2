import {ModuleTypeDefinition} from "../ModuleType";
import {cStruct, StructMembers, uint16} from "c-type-util";
import Joi, {ObjectSchema} from "joi";

interface SBPRaw {
    analogValue: number;
}

interface SBPConverted {
    pressurePsi: number;
}

interface SBPConfig {

}

export const SensorBrakePressure: ModuleTypeDefinition<SBPConfig, SBPConverted, SBPRaw> = {
    moduleTypeName: "brake_pressure",
    cfgSchema: Joi.object({}),
    rawDataStruct: {
        analogValue: uint16
    },
    convert: (rawData, config) => ({
        pressurePsi: rawData.analogValue
    }),
}
