export class CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignedUserIds: object;
}
