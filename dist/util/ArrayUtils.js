"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDv = exports.sliceU8 = void 0;
function sliceU8(buf, start, stop) {
    return new Uint8Array(buf.buffer, buf.byteOffset + start, buf.byteOffset + stop - start);
}
exports.sliceU8 = sliceU8;
function createDv(buf, start, stop) {
    if (start === undefined || stop === undefined)
        return new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    else
        return new DataView(buf.buffer, buf.byteOffset + start, buf.byteOffset + stop - start);
}
exports.createDv = createDv;
//# sourceMappingURL=ArrayUtils.js.map