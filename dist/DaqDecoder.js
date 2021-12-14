"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaqDecoder = void 0;
var binary_parser_1 = require("binary-parser");
var header_1 = require("./parsers/header");
var crc16_1 = require("./util/crc16");
var extendedHeader_1 = require("./parsers/extendedHeader");
var ArrayUtils_1 = require("./util/ArrayUtils");
var MACUtil_1 = require("./util/MACUtil");
var DaqDecoder = /** @class */ (function () {
    function DaqDecoder(daqSchema, options) {
        this.buf = new Uint8Array(8192);
        this.idx = 0;
        this.max_packet_len = 4096;
        this.dataParser = new binary_parser_1.Parser();
        this.dataConverters = [];
        //Used to interrupt the async parse loop
        this.is_running = true;
        this.options = {
            onData: function () {
            },
            onError: function () {
            },
            onHeader: function () {
            },
            ids: [],
        };
        this.daqSchema = daqSchema;
        this.options = __assign(__assign({}, this.options), options);
        this.parser = new binary_parser_1.Parser();
        this.generateParser(new binary_parser_1.Parser());
    }
    /**
     * Generates the Decoder's parser
     * @param dataParser {Parser} The data-specific parser. Usually generated from a packet header
     * @private
     */
    DaqDecoder.prototype.generateParser = function (dataParser) {
        this.parser = new binary_parser_1.Parser()
            .endianess("little")
            .uint8("packetType")
            .saveOffset("dataBegin")
            .choice({
            tag: "packetType",
            choices: {
                0xAA: header_1.headerParser,
                0xBB: extendedHeader_1.extendedHeaderParser,
                0x69: dataParser,
            }
        })
            .saveOffset("dataEnd")
            .uint16("checksum")
            .saveOffset("len");
    };
    DaqDecoder.prototype.pushError = function (message) {
        this.options.onError(new Error(message)); //setTimeout(() => this.options.onError(new Error(message)), 0);
    };
    DaqDecoder.prototype.feed = function (b) {
        this.buf[this.idx++] = b;
        return this.tryParse();
    };
    DaqDecoder.prototype.tryParse = function () {
        try {
            //Slice the buffer to only attempt parsing of existing data.
            var buf = (0, ArrayUtils_1.sliceU8)(this.buf, 0, this.idx);
            //Parse - if failure b/c too short, catch.
            var res = this.parser.parse(buf);
            //Something was successfully parsed. Check the checksum
            var checkBuf = (0, ArrayUtils_1.sliceU8)(buf, res.dataBegin, res.dataEnd);
            var checksum = (0, crc16_1.crc16)(checkBuf);
            if (checksum !== res.checksum)
                throw new Error("Checksums don't match! Actual: >".concat(checksum, "<, Expected: >").concat(res.checksum, "<"));
            //Shift this packet out of the buffer
            this.buf.copyWithin(0, res.len);
            this.idx -= res.len;
            //Checksum OK - pass data to the handler
            return this.handleValidPacket(res);
        }
        catch (e) {
            //shift front off of buffer.
            if (this.idx > this.max_packet_len) {
                this.buf.copyWithin(0, 1);
                this.idx--;
                this.pushError("Max packet length reached!!! Searching for new start.");
            }
            else if (e.name === "RangeError")
                return; //These are expected, and just mean there isn't enough data in buf to satisfy parser.
            else
                this.pushError(e);
        }
    };
    DaqDecoder.prototype.handleValidPacket = function (packet) {
        return {
            0xAA: this.handleHeaderPacket.bind(this),
            0xBB: this.handleExtendedHeaderPacket.bind(this),
            0x69: this.handleDataPacket.bind(this)
        }[packet.packetType](packet);
    };
    DaqDecoder.prototype.handleExtendedHeaderPacket = function (packet) {
        console.log("EXTENDED PACKET");
        //TODO: Do something with this extra info...
        this.handleHeaderPacket(packet);
    };
    DaqDecoder.prototype.handleDataPacket = function (packet) {
        //Convert "raw" input object by applying converter.
        var convertedPacket = {};
        this.dataConverters.forEach(function (_a) {
            var name = _a[0], typeDef = _a[1];
            return convertedPacket[name] = typeDef.type.convert(packet[name], typeDef.config);
        });
        this.options.onData(convertedPacket); //setTimeout(() => , 0);
        packet.type = "data";
        return packet;
    };
    DaqDecoder.prototype.handleHeaderPacket = function (packet) {
        var _this = this;
        var hd = packet.modules;
        //Map each buffer ID into a MAC string
        var present_modules = hd.map(function (mDef) { return (__assign(__assign({}, mDef), { id: (0, MACUtil_1.buf2mac)(mDef.id) })); });
        //Convert found IDs into definitions, from the DAQ schema.
        var module_definitions = present_modules.map(function (module) { return _this.daqSchema.findById(module.id); });
        this.options.onHeader(module_definitions); //setTimeout(() => , 0);
        //Create the new parser using the parsers defined by each module.
        var p = new binary_parser_1.Parser();
        this.dataConverters = [];
        module_definitions.forEach(function (d) {
            p.nest(d.name, { type: d.type.parser });
            _this.dataConverters.push([d.name, d]);
        });
        this.generateParser(p);
        packet.type = "header";
        return packet;
    };
    return DaqDecoder;
}());
exports.DaqDecoder = DaqDecoder;
//# sourceMappingURL=DaqDecoder.js.map