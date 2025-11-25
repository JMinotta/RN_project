import { CategoryRepository } from '../repositories/categoryRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class UpdateCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: {
    categoryId: string;
    name?: string;
    type?: string;
    capacity?: number;
    description?: string;
  }): Promise<Result<void>> {
    try {
      if (!params.categoryId || params.categoryId.trim() === '') {
        return new Err('El ID de la categoría es requerido');
      }

      if (params.name !== undefined && params.name.trim() === '') {
        return new Err('El nombre no puede estar vacío');
      }

      if (params.capacity !== undefined && params.capacity < 0) {
        return new Err('La capacidad no puede ser negativa');
      }

      const success = await this.repository.updateCategory(params);
      
      if (!success) {
        return new Err('No se pudo actualizar la categoría');
      }

      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al actualizar categoría: ${message}`);
    }
  }
}
