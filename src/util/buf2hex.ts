//https://blog.xaymar.com/2020/12/08/fastest-uint8array-to-hex-string-conversion-in-javascript/
const LUT_HEX_4b = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
// End Pre-Init
const LUT_HEX_8b = new Array(0x100);
for (let n = 0; n < 0x100; n++) {
    LUT_HEX_8b[n] = `${LUT_HEX_4b[(n >>> 4) & 0xF]}${LUT_HEX_4b[n & 0xF]}`;
}

export function buf2mac(buffer: ArrayBuffer | number[]): string {
    let out = '';
    for (let idx = 0, edx = (buffer as any).length; idx < edx; idx++) {
        out += LUT_HEX_8b[(buffer as any)[idx]];

        if (idx < edx - 1)
            out += ':'

    }
    return out;
}
