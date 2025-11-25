import { Activity } from '../models/activity';

export interface ActivityRepository {
  getActivitiesByCourse(courseId: string): Promise<Activity[]>;
  getActivitiesByCategory(categoryId: string): Promise<Activity[]>;
  getActivityById(activityId: string): Promise<Activity | null>;
  createActivity(params: {
    title: string;
    description?: string;
    dueDate?: Date;
    courseId: string;
    categoryId?: string;
  }): Promise<void>;
  updateActivity(
    activityId: string,
    params: {
      title?: string;
      description?: string;
      dueDate?: Date;
      categoryId?: string;
    }
  ): Promise<void>;
  deleteActivity(activityId: string): Promise<void>;
  getActivityStats(courseId: string): Promise<{
    total: number;
    pending: number;
    overdue: number;
  }>;
}
