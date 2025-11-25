import { Course } from '../models/course';
import { CourseRepository } from '../repositories/courseRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class UpdateCourse {
  constructor(private readonly repository: CourseRepository) {}

  async execute(courseId: string, course: Course): Promise<Result<void>> {
    try {
      if (!courseId || courseId.trim() === '') {
        return new Err('El ID del curso es requerido');
      }

      if (!course.title || course.title.trim() === '') {
        return new Err('El título del curso es requerido');
      }

      // Verificar que el curso existe
      const existing = await this.repository.getById(courseId);
      if (!existing) {
        return new Err('El curso no existe');
      }

      // Verificar que el usuario es el profesor del curso
      if (existing.professorId !== course.professorId) {
        return new Err('No tienes permiso para actualizar este curso');
      }

      await this.repository.update(courseId, course);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al actualizar curso: ${message}`);
    }
  }
}
