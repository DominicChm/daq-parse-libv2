export interface DaqDecoderOptions {
    onData: CallBack<any>;
    onHeader: CallBack<any>;
    onError: CallBack<any>;
    ids: string[];
}

type CallBack<T> = (data: T) => void;
