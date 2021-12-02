import * as CType from "c-type-util";
export declare class PacketParseHelper {
    private in_buffer;
    private queued;
    private num_waiting;
    private resolve_bytes;
    bytes(num_bytes: number): Promise<number[]>;
    /**
     * Awaits a CType.
     * @param ct {CType} - The ctype to await.
     */
    cType<T>(ct: CType.CType<T>): Promise<T>;
    feed(b: number): void;
    try_resolve_bytes(): void;
}
