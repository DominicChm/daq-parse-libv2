import {SchemaManager} from "./SchemaManager";
import {DaqEncoderConfig} from "./interfaces/DaqEncoderConfig";
import {ResolvedModuleDefinition} from "./interfaces/DaqSchema";
import {sliceU8, createDv} from "./util/ArrayUtils";
import {mac2buf} from "./util/MACUtil";
import {crc16} from "./util/crc16";

export class DaqEncoder<S> {
    private schemaManager: SchemaManager;
    private activeModuleIds: string[] = [];
    private activeModuleDefinitions: ResolvedModuleDefinition[] = [];

    constructor(sm: SchemaManager, options: DaqEncoderConfig) {
        this.schemaManager = sm;
    }

    setActiveModules(moduleIds: string[]): this {
        this.activeModuleIds = moduleIds;
        this.activeModuleDefinitions = this.activeModuleIds.map(this.schemaManager.findById.bind(this.schemaManager));
        return this;
    }

    encode(data: S): Uint8Array {
        const buf = new Uint8Array(8192);
        const dv = createDv(buf);

        if (this.activeModuleIds.length <= 0)
            throw new Error("Set active modules by calling \`setActiveModules()\`before encoding data!");

        buf[0] = 0x69;
        let offset = 1;

        for (const def of this.activeModuleDefinitions) {
            const def_data = (data as any)[def.name];

            if (def_data == null)
                throw new Error(`Expected data for ${def.name} but nothing found!`);

            offset += def.type.encode(def_data, def.config, dv, offset);
        }

        dv.setUint16(offset, crc16(sliceU8(buf, 1, offset)));
        offset += 2;

        return sliceU8(buf, 0, offset);
    }

    encodeHeader(): Uint8Array {
        if (this.activeModuleIds.length <= 0)
            throw new Error("Set active modules by calling \`setActiveModules()\`before encoding header!");

        const h: Partial<HeaderData> = {modules: []};
        h.id = 0xAA;
        //Write header +
        for (const def of this.activeModuleDefinitions)
            h.modules?.push({id: def.id, ver: def.version ?? 0})

        return DaqEncoder._writeHeader(h as HeaderData);
    }

    private static _writeHeader(h: HeaderData): Uint8Array {
        const bufLen = 1 + 2 + h.modules.length * 7 + 2;
        const buf = new Uint8Array(bufLen);
        const dv = createDv(buf);

        dv.setUint8(0, h.id);
        dv.setUint16(1, h.modules.length, true);

        for (let i = 0; i < h.modules.length; i++) {
            buf.set(mac2buf(h.modules[i].id), 3 + i * 7);
            dv.setUint8(3 + i * 7 + 6, h.modules[i].ver);
        }
        dv.setUint16(bufLen - 2, crc16(sliceU8(buf, 1, bufLen - 2)), true);

        return buf;
    }

    encodeExtendedHeader() {
        throw new Error("UNIMPLEMENTED");
    }

}

interface HeaderData {
    id: number,
    modules: { id: string, ver: number }[]
}
