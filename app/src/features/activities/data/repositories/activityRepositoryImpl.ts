import { Activity } from '../../domain/models/activity';
import { ActivityRepository } from '../../domain/repositories/activityRepository';
import { ActivityMapper } from '../mappers/activityMapper';
import { robleActivityService, RobleActivityService } from '../../../core/services/robleActivityService';

export class ActivityRepositoryImpl implements ActivityRepository {
  constructor(
    private readonly activityService: RobleActivityService = robleActivityService
  ) {}

  async getActivitiesByCourse(courseId: string): Promise<Activity[]> {
    const records = await this.activityService.getActivitiesByCourse(courseId);
    return records.map((record) => ActivityMapper.toDomain(record));
  }

  async getActivitiesByCategory(categoryId: string): Promise<Activity[]> {
    const records = await this.activityService.getActivitiesByCourse(categoryId);
    return records
      .filter((r) => r.category_id === categoryId)
      .map((record) => ActivityMapper.toDomain(record));
  }

  async getActivityById(activityId: string): Promise<Activity | null> {
    const record = await this.activityService.getActivityById(activityId);
    if (!record) return null;
    return ActivityMapper.toDomain(record);
  }

  async createActivity(params: {
    title: string;
    description?: string;
    dueDate?: Date;
    courseId: string;
    categoryId?: string;
  }): Promise<void> {
    await this.activityService.createActivity({
      title: params.title,
      description: params.description,
      due_date: params.dueDate,
      course_id: params.courseId,
      category_id: params.categoryId,
    });
  }

  async updateActivity(
    activityId: string,
    params: {
      title?: string;
      description?: string;
      dueDate?: Date;
      categoryId?: string;
    }
  ): Promise<void> {
    await this.activityService.updateActivity(activityId, {
      title: params.title,
      description: params.description,
      due_date: params.dueDate,
      category_id: params.categoryId,
    });
  }

  async deleteActivity(activityId: string): Promise<void> {
    await this.activityService.deleteActivity(activityId);
  }

  async getActivityStats(courseId: string): Promise<{
    total: number;
    pending: number;
    overdue: number;
  }> {
    const stats = await this.activityService.getActivityStatsByCourse(courseId);
    return {
      total: stats.total || 0,
      pending: stats.pending || 0,
      overdue: stats.overdue || 0,
    };
  }
}

export const activityRepository = new ActivityRepositoryImpl();
