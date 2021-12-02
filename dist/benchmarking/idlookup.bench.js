"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var benchmark_1 = require("benchmark");
var buf2hex_1 = require("../util/buf2hex");
console.log("Running some benchmarks");
var benchmark = new benchmark_1.Suite();
benchmark.add('MacLookup#string', {
    setup: function () {
        //console.log(this);
        this.mac = new Array(6).fill(0).map(function (v) { return (Math.random() * 255) | 0; });
        this.macBuf = new Uint8Array(this.mac).buffer;
        this.macMap = new Map();
        //console.log(buf2hex(this.macBuf));
        this.macMap.set((0, buf2hex_1.buf2hex)(this.macBuf), { test: 100 });
        //console.log(buf2hex(this.macBuf));
        //console.log(this.macBuf);
    },
    fn: function () {
        console.log("ASDASFASKGBIASJGBASIGBSIA");
        //console.log(this);
        var mac = (0, buf2hex_1.buf2hex)(this.macBuf);
        console.log(mac);
        this.macMap.get(mac);
    }
})
    .on('cycle', function (event) {
    console.log(String(event.target));
})
    .on('complete', function () {
    console.log('Fastest MAC lookup is ' + benchmark.filter('fastest').map('name'));
})
    .on("error", console.error)
    // run async
    .run({ 'async': false });
//# sourceMappingURL=idlookup.bench.js.map