import {buf2mac, mac2buf} from "../src/util/MACUtil";

const trivial = {
    buf: Uint8Array.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
    str: "00:00:00:00:00:00"
}

const trivial1 = {
    buf: Uint8Array.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]),
    str: "FF:FF:FF:FF:FF:FF"
}

const trivial2 = {
    buf: Uint8Array.from([0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE]),
    str: "FE:FE:FE:FE:FE:FE"
}


describe("MACUtil", () => {
    it("decodes trivial cases", () => {
        expect(buf2mac(trivial.buf)).toBe(trivial.str);
        expect(buf2mac(trivial1.buf)).toBe(trivial1.str);
        expect(buf2mac(trivial2.buf)).toEqual(trivial2.str);
    });

    it("encodes trivial cases", () => {
        expect(mac2buf(trivial.str)).toEqual(trivial.buf);
        expect(mac2buf(trivial1.str)).toEqual(trivial1.buf);
        expect(mac2buf(trivial2.str)).toEqual(trivial2.buf);
    });
})

