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
exports.SchemaManager = void 0;
var MACUtil_1 = require("./util/MACUtil");
var MACRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
var SchemaManager = /** @class */ (function () {
    function SchemaManager(moduleDefinitions, moduleTypes) {
        this.resolvedIdMap = new Map();
        this.resolvedNameMap = new Map();
        this.moduleTypes = moduleTypes;
        this.moduleDefinitions = moduleDefinitions;
        this.loadModuleDefinitions(moduleDefinitions);
    }
    SchemaManager.prototype.loadModuleDefinitions = function (moduleDefinitions) {
        var _this = this;
        //Use sets to detect and error on duplicates.
        var names = new Set();
        var ids = new Set();
        //Generate corrected module definitions (w/ default cfg, etc.) and resolved definitions for internal use.
        var resolvedDefinitions = moduleDefinitions.map(function (moduleDef) {
            //Resolve module type
            var typeDef = _this.moduleTypes.find(function (mt) { return mt.moduleTypeName === moduleDef.typeName; });
            if (!typeDef)
                throw new Error("No type definition found for typename ".concat(moduleDef.typeName));
            //Check for duplicate names and IDs.
            if (names.has(moduleDef.name))
                throw new Error("Duplicate module name >".concat(moduleDef.name, "< encountered in DAQ schema."));
            if (ids.has(moduleDef.id))
                throw new Error("Duplicate module ID >".concat(moduleDef.id, "< encountered in DAQ schema."));
            //Check if ID is valid MAC address.
            if (!MACRegex.test(moduleDef.id))
                throw new Error("Invalid MAC ID >".concat(moduleDef.id, "< encountered in DAQ schema. Make sure the ID is formatted as a MAC address (AA:BB:CC:DD:EE:FF)"));
            names.add(moduleDef.name);
            ids.add(moduleDef.id);
            //Validate config.
            var _a = typeDef.cfgSchema.validate(moduleDef.config), error = _a.error, value = _a.value;
            if (error)
                throw error;
            //Generate standardized MAC id.
            var formattedId = (0, MACUtil_1.standardizeMac)(moduleDef.id);
            //Create corrected and resolved module definitions
            var correctedDef = __assign(__assign({}, moduleDef), { config: value, id: formattedId });
            var resolvedDef = __assign(__assign({}, correctedDef), { type: typeDef });
            return { corrected: correctedDef, resolved: resolvedDef };
        });
        resolvedDefinitions.forEach(function (v) { return _this.resolvedIdMap.set(v.resolved.id, v.resolved); });
        resolvedDefinitions.forEach(function (v) { return _this.resolvedNameMap.set(v.resolved.name, v.resolved); });
        this.moduleDefinitions = resolvedDefinitions.map(function (d) { return d.corrected; });
    };
    SchemaManager.prototype.findById = function (id) {
        if (typeof id !== "string")
            id = (0, MACUtil_1.buf2mac)(id);
        var res = this.resolvedIdMap.get(id);
        if (!res)
            throw new Error("Attempt to resolve module ID >".concat(id, "< which doesn't exist in the schema."));
        return res;
    };
    SchemaManager.prototype.findByName = function (id) {
        return this.resolvedNameMap.get(id);
    };
    return SchemaManager;
}());
exports.SchemaManager = SchemaManager;
//# sourceMappingURL=SchemaManager.js.map