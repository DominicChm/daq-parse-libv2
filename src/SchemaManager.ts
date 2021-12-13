import {DaqSchema, ModuleDefinition, ResolvedModuleDefinition} from "./interfaces/DaqSchema";
import {ModuleTypeDefinition} from "./ModuleType";
import {buf2mac} from "./util/MACUtil";

const MACRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export class SchemaManager {
    private moduleTypes: ModuleTypeDefinition<any, any, any>[];
    private daqSchema: DaqSchema;
    private resolvedIdMap: Map<string, ResolvedModuleDefinition> = new Map();
    private resolvedNameMap: Map<string, ResolvedModuleDefinition> = new Map();

    constructor(daqSchema: DaqSchema, moduleTypes: ModuleTypeDefinition<any, any, any>[]) {
        this.moduleTypes = moduleTypes;
        this.daqSchema = daqSchema;

        this.loadDaqSchema(daqSchema);
    }

    private loadDaqSchema(daqSchema: DaqSchema) {
        //Use sets to detect and error on duplicates.
        const names = new Set();
        const ids = new Set();

        //Generate corrected module definitions (w/ default cfg, etc.) and resolved definitions for internal use.
        const resolvedDefinitions: { resolved: ResolvedModuleDefinition, corrected: ModuleDefinition }[] = daqSchema.modules.map(moduleDef => {

            //Resolve module type
            const typeDef = this.moduleTypes.find(mt => mt.moduleTypeName === moduleDef.typeName);

            if (!typeDef)
                throw new Error(`No type definition found for typename ${moduleDef.typeName}`);

            //Check for duplicate names and IDs.
            if (names.has(moduleDef.name))
                throw new Error(`Duplicate module name >${moduleDef.name}< encountered in DAQ schema.`);

            if (ids.has(moduleDef.id))
                throw new Error(`Duplicate module ID >${moduleDef.id}< encountered in DAQ schema.`);

            //Check if ID is valid MAC address.
            if (!MACRegex.test(moduleDef.id))
                throw new Error(`Invalid MAC ID >${moduleDef.id}< encountered in DAQ schema. Make sure the ID is formatted as a MAC address (AA:BB:CC:DD:EE:FF)`);

            names.add(moduleDef.name);
            ids.add(moduleDef.id);

            //Validate config.
            const {error, value} = typeDef.cfgSchema.validate(moduleDef.config);
            if (error) throw error;

            //Generate standardized MAC id.
            const parts = moduleDef.id
                .replace(/[\W_]+/g, '')
                .match(/(.{2})/g)

            if (!parts)
                throw new Error("Couldn't generate formatted MAC parts");

            const formattedId = parts.join(":");

            //Create corrected and resolved module definitions
            const correctedDef: ModuleDefinition = {...moduleDef, config: value, id: formattedId};
            const resolvedDef: ResolvedModuleDefinition = {...correctedDef, type: typeDef};

            return {corrected: correctedDef, resolved: resolvedDef};
        });
        resolvedDefinitions.forEach(v => this.resolvedIdMap.set(v.resolved.id, v.resolved));
        resolvedDefinitions.forEach(v => this.resolvedNameMap.set(v.resolved.name, v.resolved));

        this.daqSchema = {
            ...daqSchema,
            modules: resolvedDefinitions.map(d => d.corrected)
        }
    }

    findById(id: string | Uint8Array): ResolvedModuleDefinition {
        if (typeof id !== "string")
            id = buf2mac(id);

        const res = this.resolvedIdMap.get(id);
        if (!res)
            throw new Error(`Attempt to resolve module ID >${id}< which doesn't exist in the schema.`);

        return res;
    }

    findByName(id: string): ResolvedModuleDefinition | undefined {
        return this.resolvedNameMap.get(id);
    }
}
