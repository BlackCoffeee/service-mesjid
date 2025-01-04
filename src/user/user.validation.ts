import { z, ZodType } from 'zod';

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z.string().min(3).max(75),
        username: z.string().min(3).max(15),
        password: z.string().min(8).max(255),
    });

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(3).max(15),
        password: z.string().min(8).max(255),
    });

    static readonly PATCH: ZodType = z.object({
        name: z.string().min(3).max(75).optional(),
        username: z.string().min(3).max(15).optional(),
        password: z.string().min(8).max(255).optional(),
        role: z.string().optional(),
        isActive: z.union([z.boolean(), z.string()])
            .transform((val) => {
                if (typeof val === 'string') {
                    if (val.toLowerCase() === 'true') return true;
                    if (val.toLowerCase() === 'false') return false;
                    throw new Error('Invalid boolean string');
                }
                return val;
            })
            .optional(),
    });
}
