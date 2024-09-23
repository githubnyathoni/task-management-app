import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
  })
  name?: string;

  @ApiProperty({
    example: 'https://image.com/example',
    description: 'Link avatar of the user',
  })
  avatar?: string;
}
