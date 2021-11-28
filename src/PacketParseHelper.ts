import * as CType from "c-type-util";

export class PacketParseHelper {
    private in_buffer: number[] = [];
    private queued = false;
    private num_waiting = 0;
    private resolve_bytes: (value: number[] | PromiseLike<number[]>) => void = () => {
    };

    bytes(num_bytes: number): Promise<number[]> {
        //There's enough in the inbuffer to immediately resolve the promise..
        if (this.in_buffer.length >= num_bytes) {
            const dat = this.in_buffer.slice(0, num_bytes)
            this.in_buffer = this.in_buffer.slice(num_bytes);
            return Promise.resolve(dat);
        }


        this.num_waiting = num_bytes;
        return new Promise((res) => {
            this.resolve_bytes = res;
        });
    }

    async uint8(): Promise<number> {
        return this.cType(CType.uint8);
    }

    async cType<T>(ct: CType.CType<T>): Promise<T> {
        const bytes = await this.bytes(ct.size);
        const buf = new Uint8Array(bytes).buffer;
        return ct.readLE(buf);
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
