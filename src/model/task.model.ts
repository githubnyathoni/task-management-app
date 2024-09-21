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
