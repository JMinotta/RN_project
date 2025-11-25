import { CategoryRepository } from '../repositories/categoryRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class CreateGroup {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: {
    categoryId: string;
    name: string;
    description?: string;
  }): Promise<Result<void>> {
    try {
      if (!params.name || params.name.trim() === '') {
        return new Err('El nombre del grupo es requerido');
      }

      if (!params.categoryId || params.categoryId.trim() === '') {
        return new Err('El ID de la categoría es requerido');
      }

      await this.repository.createGroup(params);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al crear grupo: ${message}`);
    }
  }
}
