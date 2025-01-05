/**
 * @file jwt.strategy.ts
 * @description Implementasi strategi otentikasi menggunakan JSON Web Token (JWT)
 *
 * @class JwtStrategy
 * @extends PassportStrategy
 *
 * Fungsi utama:
 * 1. Mengekstrak token JWT dari header Authorization request
 * 2. Melakukan validasi token JWT dengan secret key yang telah ditentukan
 * 3. Mengambil dan memproses data payload dari token JWT yang valid
 *
 * Alur proses:
 * 1. Kelas mengextend PassportStrategy dengan parameter Strategy JWT
 * 2. Constructor melakukan konfigurasi:
 *    - Mengambil token dari header Authorization dengan skema Bearer
 *    - Mengatur pengecekan waktu kadaluarsa token
 *    - Menetapkan secret key untuk verifikasi
 * 3. Method validate() dieksekusi setelah token terverifikasi untuk:
 *    - Mengekstrak data user dari payload
 *    - Mengembalikan objek dengan userId dan username
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from '../../../config/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * @constructor
     * Inisialisasi konfigurasi strategi JWT
     */
    constructor() {
        super({
            // Mengekstrak token dari header Authorization dengan format Bearer
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Mengaktifkan validasi waktu kadaluarsa token
            ignoreExpiration: envConfig.jwt.ignoreExpiration,
            // Secret key untuk verifikasi token
            secretOrKey: envConfig.jwt.secret,
        });
    }

    /**
     * @method validate
     * @param payload - Data yang terdekripsi dari token JWT
     * @returns Object berisi data user (userId dan username)
     */
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}

// created by : Muhammad Arif https://github.com/BlackCoffeee
// created at : 2025-01-01
// updated by : .... https://github.com/....
// updated at : ....
