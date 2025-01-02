export const JWT_CONSTANTS = {
    ACCESS_TOKEN_EXPIRATION: process.env.JWT_EXPIRATION_TIME || '1d',
    REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d'
}; 