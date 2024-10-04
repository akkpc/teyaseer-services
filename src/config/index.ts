import dotenv from "dotenv"
import path from "path";

export function configDotEnv() {
    const pulicEnvPath = path.resolve(__dirname + "/../../.env");
    const originalEnvPath = path.resolve(__dirname + "/../../.env.local");
    dotenv.config({ path: pulicEnvPath })
    dotenv.config({ path: originalEnvPath })
}
