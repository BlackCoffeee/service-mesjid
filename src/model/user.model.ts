/**
 * @fileoverview Model untuk entitas dan request/response pengguna dalam aplikasi
 * @module model/user.model
 * @description
 * File ini berisi definisi tipe data untuk:
 * - Response data pengguna ke client (UserResponse)
 * - Entitas pengguna internal dengan password (UserEntity) 
 * - Request registrasi pengguna baru (RegisterUserRequest)
 * - Request login pengguna (LoginUserRequest)
 *
 * @author Muhammad Arif <https://github.com/BlackCoffeee>
 * @created 2025-01-01
 * @version 1.0.0
 */

/**
 * Class untuk response data pengguna ke client
 * Tidak menyertakan data sensitif seperti password
 */
export class UserResponse {
    id: string;
    name: string; 
    username: string;
    role?: string;
    refreshToken?: string;
    isActive?: boolean;
}

/**
 * Class untuk entitas pengguna internal
 * Menyertakan password untuk keperluan autentikasi
 * @extends UserResponse
 */
export class UserEntity extends UserResponse {
    password: string;
}

/**
 * Class untuk request registrasi pengguna baru
 * Berisi data yang diperlukan untuk membuat akun
 */
export class RegisterUserRequest {
    name: string;
    username: string;
    password: string;
}

/**
 * Class untuk request login pengguna
 * Berisi kredensial untuk autentikasi
 */
export class LoginUserRequest {
    username: string;
    password: string;
}
