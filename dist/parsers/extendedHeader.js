"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendedHeaderParser = exports.headerBlock = void 0;
var binary_parser_1 = require("binary-parser");
exports.headerBlock = new binary_parser_1.Parser()
    .endianess("little")
    .array("id", {
    type: "uint8",
    length: 6
})
    .uint8("version")
    .string("moduleTypename", { length: 64 })
    .string("moduleName", { length: 64 })
    .string("moduleDescription", { length: 128 });
exports.extendedHeaderParser = new binary_parser_1.Parser()
    .endianess("little")
    .uint16("length")
    .array("modules", {
    type: exports.headerBlock,
    length: "length"
});
//# sourceMappingURL=extendedHeader.js.map