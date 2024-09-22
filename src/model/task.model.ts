export interface TaskRequest {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignedUserIds: object;
}

export interface TaskDetailResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  createdAt: Date;
  assignees: {
    id: string;
    name: string;
    avatar: string;
  }[];
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
}

export interface AddCommentRequest {
  content: string;
  taskId: string;
}

export interface AddCommentResponse {
  content: string;
  taskId: string;
  userId: string;
}

export interface AssignTaskRequest {
  taskId: string;
  userId: string;
}
