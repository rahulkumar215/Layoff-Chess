import dotenv from "dotenv";
dotenv.config();
function getEnvVar(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
}
const appConfig = Object.freeze({
    PORT: Number(process.env.PORT) || 3000,
    ALLOWED_HOSTS: getEnvVar("ALLOWED_HOSTS"),
    COOKIE_SECRET: getEnvVar("COOKIE_SECRET"),
    NODE_ENV: getEnvVar("NODE_ENV"),
});
export default appConfig;
//# sourceMappingURL=appConfig.js.map