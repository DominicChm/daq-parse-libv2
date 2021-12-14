"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardizeMac = exports.mac2buf = exports.buf2mac = void 0;
//https://blog.xaymar.com/2020/12/08/fastest-uint8array-to-hex-string-conversion-in-javascript/
var LUT_HEX_4b = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
// End Pre-Init
var LUT_HEX_8b = new Array(0x100);
for (var n = 0; n < 0x100; n++) {
    LUT_HEX_8b[n] = "".concat(LUT_HEX_4b[(n >>> 4) & 0xF]).concat(LUT_HEX_4b[n & 0xF]);
}
function buf2mac(buffer) {
    var out = '';
    for (var idx = 0, edx = buffer.length; idx < edx; idx++) {
        out += LUT_HEX_8b[buffer[idx]];
        if (idx < edx - 1)
            out += ':';
    }
    return out;
}
exports.buf2mac = buf2mac;
var MAC_LEN = 6;
// Modified from https://stackoverflow.com/questions/68342525/javascript-what-is-the-fastest-hexadecimal-string-to-arraybuffer-algorithm
function mac2buf(string) {
    if (string.length !== 17)
        throw new Error("Expected MAC in standard form \"XX:XX:XX:XX:XX:XX\", got >".concat(string, "<"));
    string = string.toUpperCase();
    var bytes = new Uint8Array(MAC_LEN);
    for (var i = 0; i < MAC_LEN; i++) {
        var c1 = string.charCodeAt(i * 3);
        var c2 = string.charCodeAt(i * 3 + 1);
        var n1 = c1 - (c1 < 58 ? 48 : 55);
        var n2 = c2 - (c2 < 58 ? 48 : 55);
        bytes[i] = n1 * 16 + n2;
    }
    return bytes;
}
exports.mac2buf = mac2buf;
function standardizeMac(mac) {
    var parts = mac
        .replace(/[\W_]+/g, '')
        .match(/(.{2})/g);
    if (!parts)
        throw new Error("Couldn't generate formatted MAC parts");
    return parts.join(":");
}
exports.standardizeMac = standardizeMac;
//# sourceMappingURL=MACUtil.js.map