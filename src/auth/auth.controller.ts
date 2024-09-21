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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);

    return {
      data: result,
    };
  }

  @Post('login')
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.login(request);

    return {
      data: result,
    };
  }

  @Post('refresh')
  async refresh(
    @Body() request: TokenRequest,
  ): Promise<WebResponse<TokenResponse>> {
    const result = await this.authService.refreshToken(request);

    return {
      data: result,
    };
  }
}
