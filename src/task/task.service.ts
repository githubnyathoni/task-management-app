import { Inject, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CreateTaskRequest } from 'src/model/task.model';
import { Logger } from 'winston';
import { TaskValidation } from './task.validation';

@Injectable()
export class TaskService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createTask(userId: string, request: CreateTaskRequest): Promise<Task> {
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
}
