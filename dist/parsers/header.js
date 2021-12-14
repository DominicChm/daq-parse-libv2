"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerParser = exports.headerBlock = void 0;
var binary_parser_1 = require("binary-parser");
exports.headerBlock = new binary_parser_1.Parser()
    .endianess("little")
    .array("id", {
    type: "uint8",
    length: 6
})
    .uint8("version");
exports.headerParser = new binary_parser_1.Parser()
    .endianess("little")
    .uint16("length")
    .array("modules", {
    type: exports.headerBlock,
    length: "length"
});
//# sourceMappingURL=header.js.map