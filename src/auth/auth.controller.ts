import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  TokenRequest,
  TokenResponse,
  UserResponse,
} from '../model/auth.model';
import { WebResponse } from '../model/web.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  async register(
    @Body() request: RegisterUserDto,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);

    return {
      data: result,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User login successfully',
  })
  async login(
    @Body() request: LoginUserDto,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.login(request);

    return {
      data: result,
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Get access token by refresh token' })
  @ApiResponse({
    status: 201,
    description: 'Access token generated successfully',
  })
  async refresh(
    @Body() request: RefreshTokenDto,
  ): Promise<WebResponse<TokenResponse>> {
    const result = await this.authService.refreshToken(request);

    return {
      data: result,
    };
  }
}
