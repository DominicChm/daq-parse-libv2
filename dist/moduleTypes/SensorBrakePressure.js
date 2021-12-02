"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorBrakePressure = void 0;
var c_type_util_1 = require("c-type-util");
var joi_1 = __importDefault(require("joi"));
exports.SensorBrakePressure = {
    moduleTypeName: "brake_pressure",
    cfgSchema: joi_1.default.object({}),
    rawDataStruct: {
        analogValue: c_type_util_1.uint16
    },
    convert: function (rawData, config) { return ({
        pressurePsi: rawData.analogValue
    }); },
};
//# sourceMappingURL=SensorBrakePressure.js.map