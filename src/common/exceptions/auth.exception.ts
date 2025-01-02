import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationException extends HttpException {
    constructor() {
        super('Username or password is wrong', HttpStatus.UNAUTHORIZED);
    }
}