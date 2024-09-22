import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { UserRequest } from 'src/model/user.model';
import {
  AddCommentRequest,
  AddCommentResponse,
  AssignTaskRequest,
  TaskDetailResponse,
  TaskRequest,
  TaskResponse,
} from 'src/model/task.model';
import { MessageResponse, WebResponse } from 'src/model/web.model';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTask(): Promise<WebResponse<TaskResponse[]>> {
    const tasks = await this.taskService.getAllTask();

    return {
      data: tasks,
    };
  }

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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTask(
    @Param('id') taskId: string,
  ): Promise<WebResponse<TaskDetailResponse>> {
    const task = await this.taskService.getTaskById(taskId);

    return {
      data: task,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteTask(
    @Param('id') taskId: string,
  ): Promise<WebResponse<MessageResponse>> {
    await this.taskService.deleteTask(taskId);

    return {
      data: {
        message: 'Successfully delete task',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addCommentToTask(
    @Req() req: UserRequest,
    @Param('id') taskId: string,
    @Body() request: AddCommentRequest,
  ): Promise<WebResponse<AddCommentResponse>> {
    const userId = req.user.userId;

    const comment = await this.taskService.addCommentToTask(userId, {
      ...request,
      taskId,
    });

    return {
      data: comment,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('assign')
  async assignTask(
    @Body() request: AssignTaskRequest,
  ): Promise<WebResponse<MessageResponse>> {
    await this.taskService.assignTask(request);

    return {
      data: {
        message: 'Task successfully assigned',
      },
    };
  }
}
