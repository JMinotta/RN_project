import { Category } from '../models/category';
import { CategoryRepository } from '../repositories/categoryRepository';

export class GetCategoryById {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(categoryId: string): Promise<Category | null> {
    if (!categoryId || categoryId.trim() === '') {
      throw new Error('El ID de la categoría es requerido');
    }

    return this.repository.getCategoryById(categoryId);
  }
}
