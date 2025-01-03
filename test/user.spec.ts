import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('UserController', () => {
    let app: INestApplication;
    let logger: Logger;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();

        logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    });

    describe('POST /api/users', () => {
        it('should be rejected if request is invalid', async () => {
            const userData = {
                name: '',
                username: '',
                password: '',
            };

            const response = await request(app.getHttpServer())
                .post('/api/users')
                .send(userData);

            logger.warn(response.body);

            expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
            expect(response.body.error).toBeDefined();
        });

        it('should be able to create a user', async () => {
            const userData = {
                name: faker.person.fullName(),
                username: faker.internet.displayName(),
                password: 'password',
            };

            const response = await request(app.getHttpServer())
                .post('/api/users')
                .send(userData);

            expect(response.statusCode).toEqual(HttpStatus.CREATED);
            expect(response.body.data.name).toEqual(userData.name);
            expect(response.body.data.username).toEqual(userData.username);
        });
    });
});
