import { CategoryRepository } from '../repositories/categoryRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class AddStudentToGroup {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(groupId: string, studentId: string): Promise<Result<void>> {
    try {
      if (!groupId || groupId.trim() === '') {
        return new Err('El ID del grupo es requerido');
      }

      if (!studentId || studentId.trim() === '') {
        return new Err('El ID del estudiante es requerido');
      }

      await this.repository.addStudentToGroup(groupId, studentId);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al agregar estudiante: ${message}`);
    }
  }
}

export class RemoveStudentFromGroup {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(groupId: string, studentId: string): Promise<Result<void>> {
    try {
      if (!groupId || groupId.trim() === '') {
        return new Err('El ID del grupo es requerido');
      }

      if (!studentId || studentId.trim() === '') {
        return new Err('El ID del estudiante es requerido');
      }

      await this.repository.removeStudentFromGroup(groupId, studentId);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al remover estudiante: ${message}`);
    }
  }
}
