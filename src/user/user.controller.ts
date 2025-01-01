import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, RegisterUserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';

@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async register(
        @Body() request: RegisterUserRequest,
    ): Promise<WebResponse<RegisterUserResponse>> {
        const result = await this.userService.register(request);
        return {
            data: result,
        };
    }
}
