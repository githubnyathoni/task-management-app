import { BadRequestException, Injectable } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(zodType: ZodType<T>, data: T): T {
    try {
      return zodType.parse(data);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException(e.errors.map((err) => err.message));
      }
      throw e;
    }
  }
}
