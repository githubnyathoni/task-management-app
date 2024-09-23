import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  password: string;
}
