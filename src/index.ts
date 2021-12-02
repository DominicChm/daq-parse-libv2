import Benchmark from "benchmark";


function setup(this: any) {
    const zero = BigInt(0);
    const one = BigInt(1);
    const n256 = BigInt(256);

    this.fromLittleEndian = function (bytes: ArrayBuffer) {
        const byteArr = Array.from(new Uint8Array(bytes));

        let result = zero;
        let base = one;
        byteArr.forEach(function (byte: number) {
            result = result + base * BigInt(byte);
            base = base * n256;
        });
        return result;
    }

    this.buf2hex = function (buffer: ArrayBuffer) { // buffer is an ArrayBuffer
        // create a byte array (Uint8Array) that we can use to read the array buffer
        const byteArray = new Uint8Array(buffer);

        // for each element, we want to get its two-digit hexadecimal representation
        const hexParts = [];
        for (let i = 0; i < byteArray.length; i++) {
            // convert value to hexadecimal
            const hex = byteArray[i].toString(16);

            // pad with zeros to length 2
            const paddedHex = ('00' + hex).slice(-2);

            // push to array
            hexParts.push(paddedHex);
        }

        // join all the hex values of the elements into a single string
        return hexParts.join('');
    }

    this.buf2hexmap = function (buffer: ArrayBuffer) {
        return Array.prototype.map.call(buffer, x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    const LUT_HEX_4b = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
// End Pre-Init
    const LUT_HEX_8b = new Array(0x100);
    for (let n = 0; n < 0x100; n++) {
        LUT_HEX_8b[n] = `${LUT_HEX_4b[(n >>> 4) & 0xF]}${LUT_HEX_4b[n & 0xF]}`;
    }

    this.buf2hexlut = function (buffer: any) {
        let out = '';
        for (let idx = 0, edx = buffer.length; idx < edx; idx++) {
            out += LUT_HEX_8b[buffer[idx]];
        }
        return out;
    }

    const arrMac = new Array(6).fill(0).map(v => Math.random() * 255 | 0);

    this.mac = new Uint8Array(arrMac).buffer;

    this.biMap = new Map();
    this.biMap.set(this.fromLittleEndian(this.mac), {test: 100});

    this.stMap = new Map();
    this.stMap.set(this.buf2hex(this.mac), {test: 100});
}

new Benchmark.Suite()
    .add("bigint", function (this: any) {
        this.biMap.get(this.fromLittleEndian(this.mac))
    }, {setup})

    .add("string", function (this: any) {
        this.stMap.get(this.buf2hex(this.mac))
    }, {setup})

    .add("stringmap", function (this: any) {
        this.stMap.get(this.buf2hexmap(this.mac))
    }, {setup})

    .add("stringlut", function (this: any) {
        this.stMap.get(this.buf2hexlut(this.mac))
    }, {setup})

    .on("error", console.error)
    .on('cycle', function (event: any) {
        console.log(String(event.target));
    })
    .run();
