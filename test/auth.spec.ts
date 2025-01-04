/**
 * @file auth.spec.ts
 * @description File pengujian (test) untuk AuthController yang menangani autentikasi pengguna
 * @author [BlackCoffeee]
 * @version 1.0.0
 * @lastModified [2025-01-02]
 */

/**
 * Import modul-modul yang diperlukan untuk pengujian
 */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

/**
 * Suite pengujian untuk AuthController
 * Menguji fungsionalitas autentikasi dan otorisasi
 */
describe('AuthController', () => {
    let app: INestApplication;
    let logger: Logger;
    let prisma: PrismaService;
    let testUser: any;

    /**
     * Setup awal sebelum semua test dijalankan
     * Menginisialisasi aplikasi dan membuat user test
     */
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Tambahkan global prefix jika ada di main.ts
        // app.setGlobalPrefix('api');

        await app.init();

        logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
        prisma = app.get(PrismaService);

        // Buat user test
        const hashedPassword = await bcrypt.hash('password123', 10);
        testUser = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                username: faker.internet.userName().toLowerCase(),
                password: hashedPassword,
                role: 'user',
            },
        });
    });

    /**
     * Pembersihan data setelah semua test selesai
     */
    afterAll(async () => {
        // Bersihkan data test
        await prisma.user.delete({
            where: { id: testUser.id },
        });
        await prisma.$disconnect();
        await app.close();
    });

    /**
     * Suite pengujian untuk endpoint login
     * Menguji berbagai skenario login
     */
    describe('POST /api/auth/login', () => {
        it('should reject login with invalid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: 'invalid-user',
                    password: 'wrong-password',
                });

            logger.warn(response.body);

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            expect(response.body.error).toBeDefined();
        });

        it('should reject login with invalid password', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: testUser.username,
                    password: 'wrong-password',
                });

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            expect(response.body.error).toBeDefined();
        });

        it('should successfully login with valid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: testUser.username,
                    password: 'password123',
                });

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.access_token).toBeDefined();
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.user.username).toBe(testUser.username);
        });
    });

    /**
     * Suite pengujian untuk rute yang dilindungi (protected routes)
     * Menguji akses ke endpoint yang memerlukan autentikasi
     */
    describe('Protected Routes', () => {
        let authToken: string;

        beforeAll(async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: testUser.username,
                    password: 'password123',
                });

            authToken = response.body.data.access_token;
        });

        it('should reject access to protected route without token', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/users',
            );

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should allow access to protected route with valid token', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(
                response.body.data.some(
                    (user) => user.username === testUser.username,
                ),
            ).toBe(true);
        });

        it('should reject access with invalid token', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });

    /**
     * Suite pengujian untuk validasi token
     * Menguji penanganan token yang tidak valid atau kadaluarsa
     */
    describe('Token Validation', () => {
        it('should reject expired token', async () => {
            // Buat token yang sudah expired
            const expiredToken = 'expired.token.here'; // Gunakan token yang sudah expired

            const response = await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should reject malformed token', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', 'Bearer malformed.token');

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
// created by : Muhammad Arif https://github.com/BlackCoffeee
// created at : 2025-01-02
// updated by : .... https://github.com/....
// updated at : ....
