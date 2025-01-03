import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequest, UserResponse, UserEntity, PatchUserRequest } from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private validationService: ValidationService,
        private prismaService: PrismaService,
    ) {}

    async getAllData(): Promise<UserResponse[]> {
        try {
            const users = await this.prismaService.user.findMany();
            
            if (users.length === 0) {
                this.logger.warn('userService.getAll: User not found');
                throw new HttpException(
                    'User not found',
                    HttpStatus.NO_CONTENT,
                );
            }

            return users.map(({ password, ...rest }) => rest) as UserResponse[];
            
        } catch (error) {
            this.logger.error(`Error getting all data user: ${error}`);
            throw new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
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
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
        };
    }

    async findByUsername(username: string): Promise<UserEntity> {
        return this.prismaService.user.findUnique({
            where: { username }
        });
    }

    async comparePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        await this.prismaService.user.update({
            where: { id: userId },
            data: { refreshToken }
        });
    }

    async findById(id: string): Promise<UserEntity> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id }
            });
        
            if (!user) {
                this.logger.warn(`User with id ${id} not found`);
                throw new HttpException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'User not found'
                }, HttpStatus.NOT_FOUND);
            }
            
            return user;
        } catch (error) {
            // Jika error adalah HttpException, teruskan
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error getting user by id: ${error}`);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR, 
                    message: 'Internal server error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async patchUser(id: string, request: PatchUserRequest): Promise<UserResponse> {
        try {
            // Validasi request
            const patchRequest: PatchUserRequest = this.validationService.validate(
                UserValidation.PATCH,
                request
            );

            // Hash password jika ada dalam request
            if (patchRequest.password) {
                const hashedPassword = await bcrypt.hash(patchRequest.password, 10);
                patchRequest.password = hashedPassword;
            }

            try {
                await this.findById(id);
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                throw new HttpException(
                    'Internal server error',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            // Update user
            const updatedUser = await this.prismaService.user.update({
                where: { id },
                data: patchRequest
            });

            // Return response tanpa password
            const { password, refreshToken, ...userResponse } = updatedUser;
            return userResponse;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            this.logger.error(`Error patching user: ${error}`);
            throw new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
