import {Parser} from "binary-parser";

export const headerBlock = new Parser()
    .endianess("little")
    .array("id", {
        type: "uint8",
        length: 6
    })
    .uint8("version")
    .string("moduleTypename", {length: 64})
    .string("moduleName", {length: 64})
    .string("moduleDescription", {length: 128})

export const extendedHeaderParser = new Parser()
    .endianess("little")
    .uint16("length")
    .array("modules", {
        type: headerBlock,
        length: "length"
    });
