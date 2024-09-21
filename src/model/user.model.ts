export class UserJwtPayload {
  userId: string;
  email: string;
}

export class UserRequest extends Request {
  user: UserJwtPayload;
}

export class UserProfileResponse {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
}

export class UpdateUserRequest {
  name?: string;
  avatar?: string;
}
