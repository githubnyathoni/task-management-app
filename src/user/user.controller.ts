import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import {
  UpdateUserRequest,
  UserProfileResponse,
  UserRequest,
} from 'src/model/user.model';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(
    @Req() request: UserRequest,
  ): Promise<WebResponse<UserProfileResponse>> {
    const userId = request.user.userId;
    const user = await this.userService.getProfile(userId);

    return {
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() request: UserRequest,
    @Body() updateData: UpdateUserRequest,
  ): Promise<WebResponse<UserProfileResponse>> {
    const userId = request.user.userId;
    const updatedUser = await this.userService.updateUserProfile(
      userId,
      updateData,
    );

    return {
      data: updatedUser,
    };
  }
}
