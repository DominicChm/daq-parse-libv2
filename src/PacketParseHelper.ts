import * as CType from "c-type-util";
import {calcChecksum} from "./calcChecksum";

export class PacketParseHelper {
    private in_buffer: number[] = [];
    private queued = false;
    private num_waiting = 0;
    private checksum_buf: number[] = [];
    private resolve_bytes: (value: number[] | PromiseLike<number[]>) => void = () => {
    };

    bytes(num_bytes: number, checksum = false): Promise<number[]> {
        //There's enough in the inbuffer to immediately resolve the promise..
        if (this.in_buffer.length >= num_bytes) {
            const dat = this.in_buffer.slice(0, num_bytes)
            this.in_buffer = this.in_buffer.slice(num_bytes);

            //If this field is part of checksum, add it to the buffer.
            if (checksum)
                this.checksum_buf = this.checksum_buf.concat(dat);

            return Promise.resolve(dat);
        }

        this.num_waiting = num_bytes;
        return new Promise((res) => {
            this.resolve_bytes = res;
        });
    }

    resetChecksum() {
        this.checksum_buf = [];
    }

    async cType<T>(ct: CType.CType<T>, checksum = false): Promise<T> {
        const bytes = await this.bytes(ct.size, checksum);
        const buf = new Uint8Array(bytes).buffer;
        return ct.readLE(buf);
    }

    async uint8_checksum() {
        const b = await this.cType(CType.uint8);
        const expected = calcChecksum(this.checksum_buf);

        if (!(b === expected))
            throw new Error(`Corrupt packet - checksums don't match. Actual: >${b}<, expected: >${expected}<`);

    }

    feed(b: number) {
        this.in_buffer.push(b);
        if (!this.queued) {
            setTimeout(this.try_resolve_bytes.bind(this), 0);
            this.queued = true;
        }
    }

    try_resolve_bytes() {
        this.queued = false;
        if (this.in_buffer.length >= this.num_waiting) {
            const dat = this.in_buffer.slice(0, this.num_waiting)
            this.in_buffer = this.in_buffer.slice(this.num_waiting);
            this.resolve_bytes(dat);
        }
    }
}
