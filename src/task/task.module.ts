import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskGateway } from './task.gateway';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [forwardRef(() => TaskModule)],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, TaskGateway],
  exports: [TaskService],
})
export class TaskModule {}
