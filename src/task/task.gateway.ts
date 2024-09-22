import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TaskService } from './task.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly taskService: TaskService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('updateTask')
  async handleTaskUpdate(
    client: Socket,
    payload: { taskId: string; data: any },
  ) {
    const updatedTask = await this.taskService.editTask(
      payload.taskId,
      payload.data,
    );

    this.server.emit('taskUpdated', updatedTask);
    return updatedTask;
  }

  @SubscribeMessage('assignTask')
  async handleTaskAssign(
    client: Socket,
    payload: { taskId: string; userId: string },
  ) {
    const assignedTask = await this.taskService.assignTask(payload);

    this.server.emit('taskAssigned', assignedTask);
    return assignedTask;
  }
}
