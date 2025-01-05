import { z, ZodType } from 'zod';

export class AuthValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z.string().min(3).max(75),
        username: z.string().min(3).max(15),
        password: z.string().min(8).max(255),
    });
}
