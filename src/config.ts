const parseIntFromEnv = (env: string, def: number) => (process.env[env] ? parseInt(process.env[env]) : def);

export const accessTokenExpiration = parseIntFromEnv("ACCESS_TOKEN_EXPIRATION", 30);
export const refreshTokenExpiration = parseIntFromEnv("REFRESH_TOKEN_EXPIRATION", 10080);
export const activationSecretExpiration = parseIntFromEnv("ACTIVATION_SECRET_EXPIRATION", 1440);
