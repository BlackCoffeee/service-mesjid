/**
 * @fileoverview Service untuk menangani autentikasi pengguna dalam aplikasi.
 * @module auth/auth.service
 * @description
 * File ini berisi implementasi logika autentikasi termasuk:
 * - Proses login pengguna
 * - Validasi kredensial
 * - Pembuatan dan pengelolaan token JWT (access & refresh token)
 * - Proses logout
 * - Pembaruan refresh token
 *
 * @author Muhammad Arif <https://github.com/BlackCoffeee>
 * @created 2025-01-01
 * @version 1.0.0
 */

import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../../model/user.model';
import { AuthenticationException } from '../../common/exceptions/auth.exception';
import { JWT_CONSTANTS } from './constants/auth.constant';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from 'src/common/validation.service';
import { PrismaService } from 'src/common/prisma.service';
import { AuthValidation } from './auth.validation';
@Injectable()
export class AuthService {
    /**
     * Constructor untuk AuthService
     * @param jwtService - Service untuk mengelola JWT token
     * @param userService - Service untuk mengelola data pengguna
     */
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private validationService: ValidationService,
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    private async validateUser(request: LoginUserRequest) {
        const user = await this.userService.findByUsername(request.username);
        if (!user) {
            throw new AuthenticationException();
        }

        const isPasswordValid = await bcrypt.compare(
            request.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new AuthenticationException();
        }

        return user;
    }

    private generateTokens(userId: string, username: string) {
        const accessToken = this.jwtService.sign(
            { sub: userId, username },
            { expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRATION },
        );

        const refreshToken = this.jwtService.sign(
            { sub: userId, username },
            { expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRATION },
        );

        return { accessToken, refreshToken };
    }

    /**
     * Method untuk melakukan proses login pengguna
     * @param loginRequest - Data login pengguna
     * @returns Object yang berisi access token JWT
     */
    async login(request: LoginUserRequest) {
        const user = await this.validateUser(request);
        const tokens = this.generateTokens(user.id, user.username);

        // Simpan refresh token ke database
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

        // Kirim response tanpa password
        const userResponse: UserResponse = {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
        };

        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user: userResponse,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.findById(payload.sub);

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const tokens = this.generateTokens(user.id, user.username);

            // Update refresh token di database
            await this.userService.updateRefreshToken(
                user.id,
                tokens.refreshToken,
            );

            return {
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async logout(userId: string) {
        await this.userService.updateRefreshToken(userId, null);
        return { message: 'Logged out successfully' };
    }


    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`Registering user ${JSON.stringify(request)}`);
        const registerRequest: RegisterUserRequest =
            this.validationService.validate(AuthValidation.REGISTER, request);

        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                username: registerRequest.username,
            },
        });

        if (totalUserWithSameUsername != 0) {
            throw new HttpException(
                `Username is already exists`,
                HttpStatus.BAD_REQUEST,
            );
        }

        registerRequest.password = await bcrypt.hash(
            registerRequest.password,
            10,
        );

        const user = await this.prismaService.user.create({
            data: registerRequest,
        });

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
        };
    }
}

/**
 * @copyright 2025 Muhammad Arif
 * @created 2025-01-01 - Muhammad Arif <https://github.com/BlackCoffeee>
 * @lastModified belum ada perubahan
 * @lastModifiedBy belum ada perubahan
 */
