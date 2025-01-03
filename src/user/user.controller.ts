import { Body, Controller, Get, HttpStatus, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllData(): Promise<WebResponse<UserResponse[]>> {
        const datas = await this.userService.getAllData();
        return new WebResponse<UserResponse[]>(
            HttpStatus.OK,
            'Users successfully retrieved',
            datas,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id') id: string): Promise<WebResponse<UserResponse>> {
        const { password, ...user } = await this.userService.findById(id);

        return new WebResponse<UserResponse>(
            HttpStatus.OK,
            'User successfully retrieved',
            user,
        );
    }

    @Post()
    async register(
        @Body() request: RegisterUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(request);
        return new WebResponse<UserResponse>(
            HttpStatus.CREATED,
            'User created successfully',
            result,
        );
    }
}
