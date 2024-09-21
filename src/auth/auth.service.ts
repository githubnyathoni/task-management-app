import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { UserService } from '../user/user.service';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  TokenRequest,
  TokenResponse,
  UserResponse,
} from '../model/auth.model';
import * as bcrypt from 'bcrypt';
import { AuthValidation } from './auth.validation';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);
    const registerRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    const existingUser = await this.userService.findByEmail(
      registerRequest.email,
    );
    if (existingUser) {
      throw new HttpException('Email already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const newUser = await this.userService.create({
      ...registerRequest,
      role: 'user',
    });

    const payload = {
      email: registerRequest.email,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      expiresIn: '7d',
    });

    return {
      ...newUser,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(request: LoginUserRequest): Promise<LoginUserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);
    const loginRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    const user = await this.userService.findByEmail(loginRequest.email);

    if (!user) {
      throw new HttpException('Email or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Email or password is invalid', 401);
    }

    const payload = {
      email: loginRequest.email,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      expiresIn: '7d',
    });

    return {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(request: TokenRequest): Promise<TokenResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);
    const tokenRequest = this.validationService.validate(
      AuthValidation.REFRESH_TOKEN,
      request,
    );

    const payload = this.jwtService.verify(tokenRequest.refresh_token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
    });

    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const newAccessToken = this.jwtService.sign(
      { email: payload.email },
      { expiresIn: '15m' },
    );

    return {
      access_token: newAccessToken,
    };
  }
}
