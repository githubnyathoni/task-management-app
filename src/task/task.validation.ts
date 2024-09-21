import { z, ZodType } from 'zod';

export class TaskValidation {
  static readonly CREATE_TASK: ZodType = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string(),
    status: z.enum(['To Do', 'In Progress', 'Done']),
    dueDate: z.string(),
    assignedUserIds: z.array(z.string().uuid()),
  });
}
