import { CourseRepository } from '../repositories/courseRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class DeleteCourse {
  constructor(private readonly repository: CourseRepository) {}

  async execute(courseId: string): Promise<Result<void>> {
    try {
      if (!courseId || courseId.trim() === '') {
        return new Err('El ID del curso es requerido');
      }

      // Verificar que el curso existe
      const existing = await this.repository.getById(courseId);
      if (!existing) {
        return new Err('El curso no existe');
      }

      // Aquí podrías agregar validaciones adicionales, como:
      // - No permitir eliminar cursos con actividades
      // - No permitir eliminar cursos con estudiantes inscritos
      // - etc.

      await this.repository.delete(courseId);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al eliminar curso: ${message}`);
    }
  }
}
