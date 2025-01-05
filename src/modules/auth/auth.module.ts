import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { envConfig } from '../../config/env.config';
import { JWT_CONSTANTS } from './constants/auth.constant';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: envConfig.jwt.secret,
            signOptions: {
                expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRATION,
            },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
