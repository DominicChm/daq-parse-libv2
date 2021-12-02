"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buf2hex_1 = require("./util/buf2hex");
var mac = new Array(6).fill(0).map(function (v) { return (Math.random() * 255) | 0; });
console.log(mac);
var inMac = new Uint8Array(mac).buffer;
console.log(inMac);
var macMap = new Map();
console.log((0, buf2hex_1.buf2hex)(inMac));
macMap.set((0, buf2hex_1.buf2hex)(inMac), { test: 100 });
console.log((0, buf2hex_1.buf2hex)(inMac));
console.log(macMap);
//# sourceMappingURL=index.js.map