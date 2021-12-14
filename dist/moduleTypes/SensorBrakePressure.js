"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorBrakePressure = void 0;
var joi_1 = __importDefault(require("joi"));
var binary_parser_1 = require("binary-parser");
exports.SensorBrakePressure = {
    encode: function (raw, cfg, dv, offset) {
        dv.setUint16(offset, raw.analogValue, true);
        return 2;
    },
    moduleTypeName: "brake_pressure",
    cfgSchema: joi_1.default.object({}),
    parser: new binary_parser_1.Parser()
        .endianess("little")
        .uint16("analogValue"),
    convert: function (rawData, config) { return ({
        pressurePsi: rawData.analogValue * 2
    }); }
};
//# sourceMappingURL=SensorBrakePressure.js.map