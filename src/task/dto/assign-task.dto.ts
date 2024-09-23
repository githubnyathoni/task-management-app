import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({
    example: '3fc53b10-498a-4801-b8a5-5c5d5bcec1d3',
    description: 'ID of the task',
  })
  taskId: string;

  @ApiProperty({
    example: 'a66cb6ad-abf3-44e3-a154-19b6b133b48d',
    description: 'ID of the user',
  })
  userId: string;
}
