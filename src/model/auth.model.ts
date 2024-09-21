export class RegisterUserRequest {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  role: string;
}

export class UserResponse {
  email: string;
  name: string;
  avatar: string;
  access_token?: string;
  refresh_token?: string;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class LoginUserResponse {
  email: string;
  name: string;
  avatar: string;
  access_token: string;
  refresh_token: string;
}

export class TokenRequest {
  refresh_token: string;
}

export class TokenResponse {
  access_token?: string;
  refresh_token?: string;
}
