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
    CLERK_WEBHOOK_SIGNING_SECRET: getEnvVar("CLERK_WEBHOOK_SIGNING_SECRET"),
    PUBLISHABLE_KEY: getEnvVar("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
    CLERK_SECRET_KEY: getEnvVar("CLERK_SECRET_KEY"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN"),
    AUTH_REDIRECT_URL: getEnvVar("AUTH_REDIRECT_URL"),
});
export default appConfig;
//# sourceMappingURL=appConfig.js.map