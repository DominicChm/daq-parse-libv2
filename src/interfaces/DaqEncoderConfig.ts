import {CType} from "c-type-util";

export type DaqEncoderConfig<S> = {
    [k in keyof S]: CType<S[k]>
};
