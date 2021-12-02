import {DaqDecoder} from "../src/DaqDecoder";
import {DaqSchema} from "../src/interfaces/DaqSchema";
import {SchemaManager} from "../src/SchemaManager";
import {SensorBrakePressure} from "../src/moduleTypes/SensorBrakePressure";

const test_daq_schema: DaqSchema = {
    modules: [
        {
            id: "00:01:02:03:04:00",
            description: "test1",
            name: "test1",
            typeName: "brake_pressure",
            config: {}
        },
        {
            id: "00:01:02:03:04:01",
            description: "test2",
            name: "test2",
            typeName: "brake_pressure",
            config: {}
        },
        {
            id: "00:01:02:03:04:02",
            description: "test3",
            name: "test3",
            typeName: "brake_pressure",
            config: {}
        },
        {
            id: "00:01:02:03:04:03",
            description: "test4",
            name: "test4",
            typeName: "brake_pressure",
            config: {}
        },
        {
            id: "00:01:02:03:04:04",
            description: "test5",
            name: "test5",
            typeName: "brake_pressure",
            config: {}
        }
    ]
}


describe("DaqDecoder", () => {
    test("regular header parse", (done) => {
        const h = [
            0xAA, // Regular header
            2, 0, // 2 modules present

            //2 MAC address ids.
            0x00, 0x01, 0x02, 0x03, 0x04, 0x00, 0x00, // Version: 0
            0x00, 0x01, 0x02, 0x03, 0x04, 0x01, 0x05, // Version: 5

            91 //CRC-8 data checksum
        ]

        const sm = new SchemaManager(test_daq_schema, [SensorBrakePressure]);
        const d = new DaqDecoder(sm, (data) => {
            console.log(data);
        }, (header) => {
            done();
        });

        for (let b of h)
            d.feed(b);

    })
})
