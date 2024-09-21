import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    email: z.string().min(1).max(255),
    name: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    avatar: z.string().min(1).max(250),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly REFRESH_TOKEN: ZodType = z.object({
    refresh_token: z.string().min(1).max(250),
  });
}
