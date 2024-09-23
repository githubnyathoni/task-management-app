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
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { UserRequest } from '../model/user.model';
import {
  AddCommentRequest,
  AddCommentResponse,
  AssignTaskRequest,
  TaskDetailResponse,
  TaskRequest,
  TaskResponse,
} from '../model/task.model';
import { MessageResponse, WebResponse } from '../model/web.model';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AssignTaskDto } from './dto/assign-task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all task' })
  @ApiResponse({ status: 200, description: 'Successfully get tasks' })
  async getAllTask(): Promise<WebResponse<TaskResponse[]>> {
    const tasks = await this.taskService.getAllTask();

    return {
      data: tasks,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: 200, description: 'Successfully create the task' })
  async createTask(
    @Req() request: UserRequest,
    @Body() createData: CreateTaskDto,
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
  @ApiOperation({ summary: 'Edit task' })
  @ApiResponse({ status: 200, description: 'Successfully edit the task' })
  async editTask(
    @Param('id') taskId: string,
    @Body() request: EditTaskDto,
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
  @ApiOperation({ summary: 'Get task detail by ID' })
  @ApiResponse({ status: 200, description: 'Successfully get the task' })
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
  @ApiOperation({ summary: 'Delete task detail by ID for Admin' })
  @ApiResponse({ status: 200, description: 'Successfully delete the task' })
  async deleteTask(
    @Param('id') taskId: string,
  ): Promise<WebResponse<MessageResponse>> {
    await this.taskService.deleteTask(taskId);

    return {
      data: {
        message: 'Successfully delete the task',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to task' })
  @ApiResponse({ status: 200, description: 'Successfully add comment to task' })
  async addCommentToTask(
    @Req() req: UserRequest,
    @Param('id') taskId: string,
    @Body() request: CreateCommentDto,
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
  @ApiOperation({ summary: 'Assign user to task' })
  @ApiResponse({ status: 200, description: 'Task successfully assigned' })
  async assignTask(
    @Body() request: AssignTaskDto,
  ): Promise<WebResponse<MessageResponse>> {
    await this.taskService.assignTask(request);

    return {
      data: {
        message: 'Task successfully assigned',
      },
    };
  }
}
