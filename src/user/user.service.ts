import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RegisterUserRequest, UserResponse } from '../model/auth.model';
import { UpdateUserRequest, UserProfileResponse } from '../model/user.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { UserValidation } from './user.validation';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async create(request: RegisterUserRequest): Promise<UserResponse> {
    const user = await this.prismaService.user.create({
      data: request,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };
  }

  async findByEmail(email: string): Promise<RegisterUserRequest | undefined> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    };
  }

  async updateUserProfile(
    userId: string,
    updateData: UpdateUserRequest,
  ): Promise<UserProfileResponse> {
    this.logger.info(`Update user ${JSON.stringify(updateData)}`);
    const filteredData = this.validationService.validate(
      UserValidation.UPDATE_PROFILE,
      updateData,
    );

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: filteredData,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    };
  }
}
