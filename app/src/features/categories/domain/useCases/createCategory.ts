import { Category } from '../models/category';
import { CategoryRepository } from '../repositories/categoryRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class CreateCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: {
    name: string;
    courseId: string;
    type?: string;
    capacity?: number;
    description?: string;
  }): Promise<Result<Category>> {
    try {
      // Validaciones de negocio
      if (!params.name || params.name.trim() === '') {
        return new Err('El nombre de la categoría es requerido');
      }

      if (!params.courseId || params.courseId.trim() === '') {
        return new Err('El ID del curso es requerido');
      }

      if (params.capacity !== undefined && params.capacity < 0) {
        return new Err('La capacidad no puede ser negativa');
      }

      // Validar límites de categorías por curso si es necesario
      const existingCategories = await this.repository.getCategoriesByCourse(params.courseId);
      if (existingCategories.length >= 20) {
        return new Err('Has alcanzado el límite máximo de 20 categorías por curso');
      }

      const category = await this.repository.createCategory(params);
      return new Ok(category);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al crear categoría: ${message}`);
    }
  }
}
