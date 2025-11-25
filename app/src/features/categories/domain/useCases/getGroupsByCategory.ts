import { Group } from '../models/group';
import { CategoryRepository } from '../repositories/categoryRepository';

export class GetGroupsByCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(categoryId: string): Promise<Group[]> {
    if (!categoryId || categoryId.trim() === '') {
      throw new Error('El ID de la categoría es requerido');
    }

    return this.repository.getGroupsByCategory(categoryId);
  }
}
