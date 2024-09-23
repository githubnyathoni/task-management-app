import { ApiProperty } from '@nestjs/swagger';

export class EditTaskDto {
  @ApiProperty({
    example: 'Fix the login bug',
    description: 'Title of the task',
  })
  title?: string;

  @ApiProperty({
    example: 'Description of the task',
    description: 'Description of the task',
  })
  description?: string;

  @ApiProperty({
    example: 'To Do',
    description: 'Status of the task',
  })
  status?: string;

  @ApiProperty({
    example: '2024-10-30',
    description: 'Due date of the task',
  })
  dueDate?: string;

  @ApiProperty({
    example: ['a66cb6ad-abf3-44e3-a154-19b6b133b48d'],
    description: 'Assigned user of the task',
  })
  assignedUserIds?: string;
}
