import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Ini comment',
    description: 'Comment of the task',
  })
  content: string;

  @ApiProperty({
    example: '3fc53b10-498a-4801-b8a5-5c5d5bcec1d3',
    description: 'ID of the task',
  })
  taskId: string;
}
