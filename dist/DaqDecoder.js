"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaqDecoder = void 0;
var c_type_util_1 = require("c-type-util");
var calcChecksum_1 = require("./calcChecksum");
var PacketParseHelper_1 = require("./PacketParseHelper");
var regular_header_block_ctype = (0, c_type_util_1.cStruct)({
    id: (0, c_type_util_1.cArray)(c_type_util_1.uint8, 6),
    ver: c_type_util_1.uint8,
});
var DaqDecoder = /** @class */ (function () {
    function DaqDecoder(daqSchema, onData, onHeader) {
        this.ph = new PacketParseHelper_1.PacketParseHelper();
        this.is_running = true;
        this.daqSchema = daqSchema;
        this.onData = onData;
        this.onHeader = onHeader;
        this.parse_runner().then(function (r) { return console.log("RUNNER STOPPED!!!!!!"); });
    }
    DaqDecoder.prototype.feed = function (b) {
        this.ph.feed(b);
    };
    DaqDecoder.prototype.parse_runner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.is_running) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.parse_logic()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DaqDecoder.prototype.parse_logic = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ph.cType(c_type_util_1.uint8)];
                    case 1:
                        cmd = _b.sent();
                        _a = cmd;
                        switch (_a) {
                            case 0xAA: return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.parse_regular_header()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new Error("Unknown Command byte ".concat(cmd));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DaqDecoder.prototype.parse_regular_header = function () {
        return __awaiter(this, void 0, void 0, function () {
            var len, data, checksum, dataBuf, calculatedChecksum, present_modules, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ph.cType(c_type_util_1.uint16)];
                    case 1:
                        len = _a.sent();
                        return [4 /*yield*/, this.ph.bytes(len * regular_header_block_ctype.size)];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, this.ph.cType(c_type_util_1.uint8)];
                    case 3:
                        checksum = _a.sent();
                        dataBuf = new Uint8Array(data).buffer;
                        calculatedChecksum = (0, calcChecksum_1.calcChecksum)(dataBuf);
                        if (calculatedChecksum !== checksum)
                            throw new Error("Corrupt packet - checksums don't match. Actual: >".concat(checksum, "<, expected: >").concat(calculatedChecksum, "<"));
                        present_modules = [];
                        for (i = 0; i < dataBuf.byteLength; i += regular_header_block_ctype.size)
                            present_modules.push(regular_header_block_ctype.readLE(dataBuf, i));
                        setImmediate(this.onHeader, present_modules);
                        return [2 /*return*/];
                }
            });
        });
    };
    return DaqDecoder;
}());
exports.DaqDecoder = DaqDecoder;
//# sourceMappingURL=DaqDecoder.js.map