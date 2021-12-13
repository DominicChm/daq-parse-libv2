import {DaqSchema} from "../src/interfaces/DaqSchema";

export const testDAQSchema: DaqSchema = {
    modules: [
        {
            id: "00:01:02:03:04:00",
            description: "test1",
            name: "BP1",
            typeName: "brake_pressure",
            config: {}
        },
        {
            id: "00:01:02:03:04:01",
            description: "test2",
            name: "BP2",
            typeName: "brake_pressure",
            version: 5,
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
