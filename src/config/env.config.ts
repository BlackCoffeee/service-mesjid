/**
 * Konfigurasi Environment Variables
 *
 * @description
 * File ini berisi konfigurasi variabel lingkungan (environment variables) untuk aplikasi.
 * Menyediakan nilai default jika variabel lingkungan tidak tersedia.
 *
 * Konfigurasi JWT:
 * - secret: Secret key untuk signing dan verifikasi JWT token
 * - expirationTime: Waktu kadaluarsa token (default: 1 hari)
 * - ignoreExpiration: Flag untuk mengabaikan expired token (default: false)
 *
 * @author Muhammad Arif <https://github.com/BlackCoffeee>
 * @created 2024-01-01
 */
export const envConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'rahasia123',
        expirationTime: process.env.JWT_EXPIRATION_TIME || '1d',
        ignoreExpiration: process.env.JWT_IGNORE_EXPIRATION === 'true' || false,
    },
};
