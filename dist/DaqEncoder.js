"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaqEncoder = void 0;
var ArrayUtils_1 = require("./util/ArrayUtils");
var MACUtil_1 = require("./util/MACUtil");
var crc16_1 = require("./util/crc16");
var DaqEncoder = /** @class */ (function () {
    function DaqEncoder(sm, options) {
        this.activeModuleIds = [];
        this.activeModuleDefinitions = [];
        this.schemaManager = sm;
    }
    DaqEncoder.prototype.setActiveModules = function (moduleIds) {
        this.activeModuleIds = moduleIds;
        this.activeModuleDefinitions = this.activeModuleIds.map(this.schemaManager.findById.bind(this.schemaManager));
        return this;
    };
    DaqEncoder.prototype.encode = function (data) {
        var buf = new Uint8Array(8192);
        var dv = (0, ArrayUtils_1.createDv)(buf);
        if (this.activeModuleIds.length <= 0)
            throw new Error("Set active modules by calling \`setActiveModules()\`before encoding data!");
        buf[0] = 0x69;
        var offset = 1;
        for (var _i = 0, _a = this.activeModuleDefinitions; _i < _a.length; _i++) {
            var def = _a[_i];
            var def_data = data[def.name];
            if (def_data == null)
                throw new Error("Expected data for ".concat(def.name, " but nothing found!"));
            offset += def.type.encode(def_data, def.config, dv, offset);
        }
        dv.setUint16(offset, (0, crc16_1.crc16)((0, ArrayUtils_1.sliceU8)(buf, 1, offset)));
        offset += 2;
        return (0, ArrayUtils_1.sliceU8)(buf, 0, offset);
    };
    DaqEncoder.prototype.encodeHeader = function () {
        var _a, _b;
        if (this.activeModuleIds.length <= 0)
            throw new Error("Set active modules by calling \`setActiveModules()\`before encoding header!");
        var h = { modules: [] };
        h.id = 0xAA;
        //Write header +
        for (var _i = 0, _c = this.activeModuleDefinitions; _i < _c.length; _i++) {
            var def = _c[_i];
            (_a = h.modules) === null || _a === void 0 ? void 0 : _a.push({ id: def.id, ver: (_b = def.version) !== null && _b !== void 0 ? _b : 0 });
        }
        return DaqEncoder._writeHeader(h);
    };
    DaqEncoder._writeHeader = function (h) {
        var bufLen = 1 + 2 + h.modules.length * 7 + 2;
        var buf = new Uint8Array(bufLen);
        var dv = (0, ArrayUtils_1.createDv)(buf);
        dv.setUint8(0, h.id);
        dv.setUint16(1, h.modules.length, true);
        for (var i = 0; i < h.modules.length; i++) {
            buf.set((0, MACUtil_1.mac2buf)(h.modules[i].id), 3 + i * 7);
            dv.setUint8(3 + i * 7 + 6, h.modules[i].ver);
        }
        dv.setUint16(bufLen - 2, (0, crc16_1.crc16)((0, ArrayUtils_1.sliceU8)(buf, 1, bufLen - 2)), true);
        return buf;
    };
    DaqEncoder.prototype.encodeExtendedHeader = function () {
        throw new Error("UNIMPLEMENTED");
    };
    return DaqEncoder;
}());
exports.DaqEncoder = DaqEncoder;
//# sourceMappingURL=DaqEncoder.js.map