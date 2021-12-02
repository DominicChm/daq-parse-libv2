"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaqEncoder = void 0;
var c_type_util_1 = require("c-type-util");
var DaqEncoder = /** @class */ (function () {
    function DaqEncoder(dataMembers, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        if (Object.values(dataMembers).length <= 0)
            throw new Error("No data members passed!");
        this.ctype = (0, c_type_util_1.end)((0, c_type_util_1.cStruct)(dataMembers), littleEndian ? "little" : "big");
    }
    DaqEncoder.prototype.encode = function (data) {
        return this.ctype.alloc(data);
    };
    return DaqEncoder;
}());
exports.DaqEncoder = DaqEncoder;
//# sourceMappingURL=DaqEncoder.js.map