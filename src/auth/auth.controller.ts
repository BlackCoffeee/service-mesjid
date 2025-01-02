/**
 * @file auth.controller.ts
 * @description Controller untuk menangani autentikasi pengguna
 * 
 * Controller ini bertanggung jawab untuk menangani endpoint-endpoint terkait autentikasi:
 * - Login pengguna
 * - Refresh token
 * - Logout pengguna
 *
 * @class AuthController
 * @implements Controller
 * @author Muhammad Arif https://github.com/BlackCoffeee
 * @created 2025-01-01
 */

import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserRequest } from '../model/user.model';
import { WebResponse } from '../model/web.model';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * @method login
     * @description Endpoint untuk melakukan login pengguna
     * @param request - Data login yang dikirim oleh pengguna (username & password)
     * @returns WebResponse berisi access token dan refresh token
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() request: LoginUserRequest): Promise<WebResponse<any>> {
        const result = await this.authService.login(request);
        return new WebResponse<any>(
            HttpStatus.OK,
            'Login successful',
            result,
        );
    }

    /**
     * @method refreshToken
     * @description Endpoint untuk memperbarui access token menggunakan refresh token
     * @param body - Objek berisi refresh token
     * @returns WebResponse berisi access token baru
     */
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: { refresh_token: string }): Promise<WebResponse<any>> {
        const result = await this.authService.refreshToken(body.refresh_token);
        return new WebResponse<any>(
            HttpStatus.OK,
            'Token refreshed successfully',
            result
        );
    }

    /**
     * @method logout
     * @description Endpoint untuk melakukan logout pengguna
     * @param req - Request object berisi data user yang sedang login
     * @returns WebResponse dengan pesan sukses
     */
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req): Promise<WebResponse<any>> {
        await this.authService.logout(req.user.userId);
        return new WebResponse<any>(
            HttpStatus.OK,
            'Logged out successfully',
            null
        );
    }
}
