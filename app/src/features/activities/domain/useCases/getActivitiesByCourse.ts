import { Activity } from '../models/activity';
import { ActivityRepository } from '../repositories/activityRepository';

export class GetActivitiesByCourse {
  constructor(private readonly repository: ActivityRepository) {}

  async execute(courseId: string): Promise<Activity[]> {
    if (!courseId || courseId.trim() === '') {
      throw new Error('El ID del curso es requerido');
    }

    return this.repository.getActivitiesByCourse(courseId);
  }
}
