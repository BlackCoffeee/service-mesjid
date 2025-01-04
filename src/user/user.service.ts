import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
    UserResponse,
    UserEntity,
    PatchUserRequest,
    PutUserRequest,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private validationService: ValidationService,
        private prismaService: PrismaService,
    ) {}

    async getAllData(): Promise<UserResponse[]> {
        try {
            const users = await this.prismaService.user.findMany({
                where: {
                    deletedAt: null
                }
            });

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

    async findByUsername(username: string): Promise<UserEntity> {
        return this.prismaService.user.findUnique({
            where: { username, deletedAt: null },
        });
    }

    async comparePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async updateRefreshToken(
        userId: string,
        refreshToken: string | null,
    ): Promise<void> {
        await this.prismaService.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }

    async findById(id: string): Promise<UserEntity> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { 
                    id,
                    deletedAt: null
                },
            });

            if (!user) {
                this.logger.warn(`User with id ${id} not found`);
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'User not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return user;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error getting user by id: ${error}`);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createUser(request: CreateUserDto): Promise<UserResponse> {
        this.logger.info(`Creating user ${JSON.stringify(request)}`);
        const createRequest: CreateUserDto = this.validationService.validate(UserValidation.CREATE, request);

        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                username: createRequest.username,
            },
        });

        if (totalUserWithSameUsername != 0) {
            throw new HttpException(
                `Username is already exists`,
                HttpStatus.BAD_REQUEST,
            );
        }

        createRequest.password = await bcrypt.hash(
            createRequest.password,
            10,
        );

        const user = await this.prismaService.user.create({
            data: createRequest,
        });

        const { password, refreshToken, ...userResponse } = user;
        return userResponse;
    }

    async patchUser(
        id: string,
        request: PatchUserRequest,
    ): Promise<UserResponse> {
        try {
            // Validasi request
            const patchRequest: PatchUserRequest =
                this.validationService.validate(UserValidation.PATCH, request);

            // Hash password jika ada dalam request
            if (patchRequest.password) {
                const hashedPassword = await bcrypt.hash(
                    patchRequest.password,
                    10,
                );
                patchRequest.password = hashedPassword;
            }

            try {
                await this.findById(id);
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Internal server error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            // Update user
            const updatedUser = await this.prismaService.user.update({
                where: { id },
                data: patchRequest,
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
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async putUser(id: string, request: PutUserRequest): Promise<UserResponse> {
        try {
            // Cek user exists dulu
            try {
                await this.findById(id);
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Internal server error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            
            // Validasi request dengan try-catch khusus
            try {
                const putRequest: PutUserRequest = this.validationService.validate(
                    UserValidation.PUT,
                    request
                );

                // Hash password jika ada
                if (putRequest.password) {
                    putRequest.password = await bcrypt.hash(putRequest.password, 10);
                }

                // Update user
                const updatedUser = await this.prismaService.user.update({
                    where: { id },
                    data: putRequest
                });

                // Return response tanpa password dan refreshToken
                const { password, refreshToken, ...userResponse } = updatedUser;
                return userResponse;

            } catch (validationError) {
                // Parse error Zod
                const zodError = JSON.parse(validationError.message);
                this.logger.error(`Validation error: ${validationError.message}`);
                
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: 'Validation failed',
                        errors: zodError // Menggunakan error Zod langsung
                    },
                    HttpStatus.BAD_REQUEST
                );
            }

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            this.logger.error(`Error putting user: ${error}`);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteUser(id: string): Promise<UserResponse> {
        try {
            // Cek user exists dulu
            await this.findById(id);

            // Soft delete user dengan mengupdate deletedAt
            const deletedUser = await this.prismaService.user.update({
                where: { 
                    id,
                    deletedAt: null // Pastikan hanya menghapus user yang belum dihapus
                },
                data: {
                    deletedAt: new Date(),
                    isActive: false // Set isActive menjadi false juga
                }
            });

            // Return response tanpa password dan refreshToken
            const { password, refreshToken, ...userResponse } = deletedUser;
            return userResponse;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            this.logger.error(`Error deleting user: ${error}`);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
