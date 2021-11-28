import {DaqEncoder} from "../src/DaqEncoder";
import {throws} from "assert";
import {cStruct, uint32, uint8} from "c-type-util";

describe("Test DaqEncoder", () => {
    test("Throws on no passed members", () => {
        expect(() => new DaqEncoder({})).toThrow();
    })

    test("basic usage", () => {
        const de = new DaqEncoder({
            field1: uint8,
            field2: cStruct({
                sub1: uint32,
                sub2: uint8
            })
        });

        de.encode({
            field1: 100,
            field2: {
                sub1: 20,
                sub2: 244
            }
        });

    })
})
