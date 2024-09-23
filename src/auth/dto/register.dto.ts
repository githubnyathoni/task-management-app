import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  password: string;
}
