import { CategoryRepository } from '../repositories/categoryRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class DeleteCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(categoryId: string): Promise<Result<void>> {
    try {
      if (!categoryId || categoryId.trim() === '') {
        return new Err('El ID de la categoría es requerido');
      }

      // Validar si la categoría tiene grupos o actividades
      const category = await this.repository.getCategoryById(categoryId);
      
      if (!category) {
        return new Err('La categoría no existe');
      }

      if (category.hasGroups()) {
        return new Err('No se puede eliminar una categoría con grupos. Elimina los grupos primero.');
      }

      if (category.hasActivities()) {
        return new Err('No se puede eliminar una categoría con actividades. Elimina las actividades primero.');
      }

      const success = await this.repository.deleteCategory(categoryId);
      
      if (!success) {
        return new Err('No se pudo eliminar la categoría');
      }

      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al eliminar categoría: ${message}`);
    }
  }
}
