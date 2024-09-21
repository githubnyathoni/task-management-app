import { z, ZodType } from 'zod';

export class TaskValidation {
  static readonly CREATE_TASK: ZodType = z.object({
    title: z.string().min(1).max(255),
    description: z.string(),
    status: z.enum(['To Do', 'In Progress', 'Done']),
    dueDate: z.string(),
    assignedUserIds: z.array(z.string().uuid()),
  });

  static readonly EDIT_TASK: ZodType = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
    dueDate: z.string().optional(),
    assignedUserIds: z.array(z.string().uuid()).optional(),
  });
}
