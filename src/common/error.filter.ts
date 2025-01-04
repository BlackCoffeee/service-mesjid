import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    UnauthorizedException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { AuthenticationException } from './exceptions/auth.exception';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        if (exception instanceof AuthenticationException) {
            return response.status(401).json({
                statusCode: 401,
                message: 'Username or password is wrong',
            });
        }

        if (exception instanceof UnauthorizedException) {
            return response.status(401).json({
                statusCode: 401,
                error: 'Unauthorized access',
                message: 'You are not authorized to access this resource',
            });
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            response.status(status).json({
                error: exception.getResponse(),
            });
        } else if (exception instanceof ZodError) {
            response.status(400).json({
                error: 'validation error',
            });
        } else {
            response.status(500).json({
                error: exception.message,
            });
        }
    }
}
