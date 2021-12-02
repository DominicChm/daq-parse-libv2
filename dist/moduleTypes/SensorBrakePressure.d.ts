import { ModuleTypeDefinition } from "../ModuleType";
interface SBPRaw {
    analogValue: number;
}
interface SBPConverted {
    pressurePsi: number;
}
interface SBPConfig {
}
export declare const SensorBrakePressure: ModuleTypeDefinition<SBPConfig, SBPConverted, SBPRaw>;
export {};
