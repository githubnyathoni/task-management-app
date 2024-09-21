import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@gmail.com',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        email: 'test@gmail.com',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        avatar: 'https://test.com/image.png',
        role: 'user',
      },
    });
  }
}
