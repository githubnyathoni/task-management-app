import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RegisterUserRequest, UserResponse } from '../model/auth.model';
import { UserProfileResponse } from 'src/model/user.model';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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
}
