import { Category } from '../models/category';
import { CategoryRepository } from '../repositories/categoryRepository';

export class GetCategoriesByCourse {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(courseId: string): Promise<Category[]> {
    if (!courseId || courseId.trim() === '') {
      throw new Error('El ID del curso es requerido');
    }

    return this.repository.getCategoriesByCourse(courseId);
  }
}
