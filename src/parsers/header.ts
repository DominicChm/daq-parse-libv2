import {Parser} from "binary-parser";

export const headerBlock = new Parser()
    .endianess("little")
    .array("id", {
        type: "uint8",
        length: 6
    })
    .uint8("version");

export const headerParser = new Parser()
    .endianess("little")
    .uint16("length")
    .array("modules", {
        type: headerBlock,
        length: "length"
    });