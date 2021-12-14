export interface DaqDecoderOptions {
    onData: CallBack<any>;
    onHeader: CallBack<any>;
    onError: CallBack<any>;
    ids: string[];
}
declare type CallBack<T> = (data: T) => void;
export {};
