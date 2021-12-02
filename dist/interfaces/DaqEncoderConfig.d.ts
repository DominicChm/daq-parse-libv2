import { CType } from "c-type-util";
export declare type DaqEncoderConfig<S> = {
    [k in keyof S]: CType<S[k]>;
};
