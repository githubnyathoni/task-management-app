import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { UserRequest } from 'src/model/user.model';
import { TaskRequest } from 'src/model/task.model';
import { MessageResponse, WebResponse } from 'src/model/web.model';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @Req() request: UserRequest,
    @Body() createData: TaskRequest,
  ): Promise<WebResponse<MessageResponse>> {
    const userId = request.user.userId;
    await this.taskService.createTask(userId, createData);

    return {
      data: {
        message: 'Successfully create the task',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editTask(
    @Param('id') taskId: string,
    @Body() request: TaskRequest,
  ): Promise<WebResponse<MessageResponse>> {
    await this.taskService.editTask(taskId, request);

    return {
      data: {
        message: 'Successfully edit the task',
      },
    };
  }
}
