import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddCommentRequest,
  AddCommentResponse,
  AssignTaskRequest,
  TaskDetailResponse,
  TaskRequest,
  TaskResponse,
} from '../model/task.model';
import { Logger } from 'winston';
import { TaskValidation } from './task.validation';
import { EmailService } from '../common/email.service';
import { TaskGateway } from './task.gateway';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private emailService: EmailService,
    // private taskGateway: TaskGateway,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async getAllTask(): Promise<TaskResponse[]> {
    this.logger.info(`Get All task`);

    const tasks = await this.prismaService.task.findMany({});

    return tasks;
  }

  async createTask(
    userId: string,
    request: CreateTaskDto,
  ): Promise<TaskResponse> {
    this.logger.info(`User ${userId} created task ${request}`);
    const filteredData = this.validationService.validate(
      TaskValidation.CREATE_TASK,
      request,
    );

    const { title, description, dueDate, status, assignedUserIds } =
      filteredData;

    const newTask = await this.prismaService.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status,
        creatorId: userId,
      },
    });

    if (assignedUserIds.length) {
      const taskAssignees = assignedUserIds.map((userId: string) => ({
        taskId: newTask.id,
        userId: userId,
      }));

      await this.prismaService.taskAssignee.createMany({
        data: taskAssignees,
      });
    }

    return newTask;
  }

  async editTask(taskId: string, request: EditTaskDto): Promise<TaskResponse> {
    this.logger.info(
      `Updated task ${taskId} with request ${JSON.stringify(request)}`,
    );
    const filteredData = this.validationService.validate(
      TaskValidation.EDIT_TASK,
      request,
    );
    // Convert to datetime object if duedate is provided
    if (filteredData.dueDate) {
      filteredData.dueDate = new Date(filteredData.dueDate);
    }

    const updatedTask = await this.prismaService.task.update({
      where: { id: taskId },
      data: {
        ...filteredData,
      },
    });

    // Update assigned users if provided
    if (filteredData.assignedUserIds) {
      // Delete old assignees
      await this.prismaService.taskAssignee.deleteMany({
        where: { taskId },
      });

      // Create new assignees
      const taskAssignees = filteredData.assignedUserIds.map(
        (userId: string) => ({
          taskId: updatedTask.id,
          userId: userId,
        }),
      );

      await this.prismaService.taskAssignee.createMany({
        data: taskAssignees,
      });
    }

    // this.taskGateway.server.emit('taskUpdated', updatedTask);

    return updatedTask;
  }

  async getTaskById(taskId: string): Promise<TaskDetailResponse> {
    this.logger.info(`Get task ${taskId}`);

    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        taskAssignees: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new HttpException('Task not found', 404);
    }

    const formattedTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      assignees: task.taskAssignees.map((assignee) => ({
        id: assignee.user.id,
        name: assignee.user.name,
        avatar: assignee.user.avatar,
      })),
      comments: task.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.avatar,
        },
      })),
    };

    return formattedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new HttpException('Task not found', 404);
    }

    await this.prismaService.task.delete({
      where: {
        id: taskId,
      },
    });
  }

  async addCommentToTask(
    userId: string,
    request: AddCommentRequest,
  ): Promise<AddCommentResponse> {
    this.logger.info(
      `Add comment to task by ${userId} with payload ${JSON.stringify(request)}`,
    );

    const filteredData = this.validationService.validate(
      TaskValidation.CREATE_COMMENT,
      request,
    );

    const task = await this.prismaService.task.findUnique({
      where: { id: filteredData.taskId },
    });

    if (!task) {
      throw new HttpException('Task not found', 404);
    }

    const comment = await this.prismaService.comment.create({
      data: {
        userId,
        taskId: filteredData.taskId,
        content: filteredData.content,
      },
    });

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    const creator = await this.prismaService.user.findUnique({
      where: { id: task.creatorId },
    });
    await this.emailService.sendCommentNotification(
      creator.email,
      task.title,
      user.name,
    );

    return comment;
  }

  async assignTask(request: AssignTaskRequest): Promise<void> {
    this.logger.info(
      `Assign task ${request.taskId} to ${JSON.stringify(request.userId)}`,
    );

    const validatedData = this.validationService.validate(
      TaskValidation.ASSIGN_TASK,
      request,
    );

    const taskExists = await this.prismaService.task.findUnique({
      where: { id: validatedData.taskId },
    });

    const userExists = await this.prismaService.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!taskExists || !userExists) {
      throw new HttpException('Task or User not found', 404);
    }

    const existingAssignment = await this.prismaService.taskAssignee.findFirst({
      where: {
        taskId: validatedData.taskId,
        userId: validatedData.userId,
      },
    });

    if (existingAssignment) {
      throw new HttpException('User already assigned to this task', 400);
    }

    const taskAssignee = await this.prismaService.taskAssignee.create({
      data: {
        taskId: validatedData.taskId,
        userId: validatedData.userId,
      },
    });

    // this.taskGateway.server.emit('taskAssigned', taskAssignee);

    await this.emailService.sendTaskAssignedEmail(
      userExists.email,
      taskExists.title,
    );
  }
}
