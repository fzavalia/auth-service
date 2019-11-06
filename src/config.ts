const parseIntFromEnv = (env: string | undefined, def: number) => (env ? parseInt(env) : def);

export const accessTokenExpiration = parseIntFromEnv(process.env.ACCESS_TOKEN_EXPIRATION, 30);
export const refreshTokenExpiration = parseIntFromEnv(process.env.REFRESH_TOKEN_EXPIRATION, 10080);
export const activationSecretExpiration = parseIntFromEnv(process.env.ACTIVATION_SECRET_EXPIRATION, 1440);
