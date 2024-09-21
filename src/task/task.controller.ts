import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { UserRequest } from 'src/model/user.model';
import { CreateTaskRequest } from 'src/model/task.model';
import { WebResponse } from 'src/model/web.model';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @Req() request: UserRequest,
    @Body() createData: CreateTaskRequest,
  ): Promise<WebResponse<any>> {
    const userId = request.user.userId;
    const newTask = await this.taskService.createTask(userId, createData);

    return {
      data: newTask,
    };
  }
}
