import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AppConfigModule } from '@config/config.module';

@Module({
    imports: [AppConfigModule, CommonModule, UserModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
