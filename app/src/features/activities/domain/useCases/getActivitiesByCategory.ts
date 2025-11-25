import { Activity } from '../models/activity';
import { ActivityRepository } from '../repositories/activityRepository';

export class GetActivitiesByCategory {
  constructor(private readonly repository: ActivityRepository) {}

  async execute(categoryId: string): Promise<Activity[]> {
    if (!categoryId || categoryId.trim() === '') {
      throw new Error('El ID de la categoría es requerido');
    }

    return this.repository.getActivitiesByCategory(categoryId);
  }
}
