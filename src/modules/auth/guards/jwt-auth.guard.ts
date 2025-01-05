/**
 * Guard untuk melakukan autentikasi JWT (JSON Web Token)
 *
 * @description
 * File ini berisi implementasi guard untuk memvalidasi JWT pada request.
 * Guard ini mengextend AuthGuard dari @nestjs/passport dengan strategy 'jwt'.
 * Digunakan sebagai decorator pada endpoint/route yang membutuhkan autentikasi.
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class JwtAuthGuard
 * @extends {AuthGuard('jwt')}
 * @description
 * Guard yang mengimplementasikan JWT authentication strategy.
 * Memvalidasi token JWT yang dikirim pada request header.
 * Jika token valid, request akan dilanjutkan.
 * Jika token invalid/expired, akan mengembalikan unauthorized error.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// created by : Muhammad Arif https://github.com/BlackCoffeee
// created at : 2025-01-01
// updated by : .... https://github.com/....
// updated at : ....
