import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequest, RegisterUserResponse } from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private prismaService: PrismaService,
    ) {}
    async register(
        request: RegisterUserRequest,
    ): Promise<RegisterUserResponse> {
        this.logger.info(`Registering user ${JSON.stringify(request)}`);
        const registerRequest: RegisterUserRequest =
            this.validationService.validate(UserValidation.REGISTER, request);

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
            name: user.name,
            username: user.username,
            role: user.role,
        };
    }
}
