"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buf2hex = void 0;
var byteToHex = [];
for (var n = 0; n <= 0xff; ++n) {
    var hexOctet = n.toString(16).padStart(2, "0");
    byteToHex.push(hexOctet);
}
function buf2hex(arrayBuffer) {
    var buff = new Uint8Array(arrayBuffer);
    var hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()
    for (var i = 0; i < buff.length; ++i)
        hexOctets.push(byteToHex[buff[i]]);
    return hexOctets.join("");
}
exports.buf2hex = buf2hex;
//# sourceMappingURL=buf2hex.js.map