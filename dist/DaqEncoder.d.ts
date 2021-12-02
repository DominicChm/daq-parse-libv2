import { StructMembers } from "c-type-util";
export declare class DaqEncoder<S> {
    private ctype;
    constructor(dataMembers: StructMembers<S>, littleEndian?: boolean);
    encode(data: S): ArrayBuffer;
}
