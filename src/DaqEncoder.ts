import {cStruct, CType, StructMembers, end, CTypeEndian} from "c-type-util";

export class DaqEncoder<S> {
    private ctype: CTypeEndian<S>;

    constructor(dataMembers: StructMembers<S>, littleEndian: boolean = true) {
        if (Object.values(dataMembers).length <= 0)
            throw new Error("No data members passed!");

        this.ctype = end(cStruct(dataMembers), littleEndian ? "little" : "big");
    }

    encode(data: S): ArrayBuffer {
        return this.ctype.alloc(data);
    }

}
