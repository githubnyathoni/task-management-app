import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly UPDATE_PROFILE: ZodType = z.object({
    name: z.string().optional(),
    avatar: z.string().optional(),
  });
}
