import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ZodError } from "zod";

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        if(exception instanceof HttpException){
            const status = exception.getStatus();
            
            // Handle unauthorized error (status 401)
            if(status === 401) {
                return response.status(401).json({
                    error: "Unauthorized access",
                    message: "You are not authorized to access this resource"
                });
            }

            response.status(status).json({
                error: exception.getResponse(),
            });
        }else if(exception instanceof ZodError){
            response.status(400).json({
                error: "validation error",
            });
        }else{
            response.status(500).json({
                error: exception.message,
            });
        }
    }
}

