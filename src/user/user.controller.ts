import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { UserProfileResponse, UserRequest } from '../model/user.model';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Successfully get user profile' })
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
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Successfully update user profile',
  })
  async updateProfile(
    @Req() request: UserRequest,
    @Body() updateData: UpdateProfileDto,
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
