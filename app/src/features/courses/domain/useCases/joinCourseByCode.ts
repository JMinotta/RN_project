import { CourseRepository } from '../repositories/courseRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class JoinCourseByCode {
  constructor(private readonly repository: CourseRepository) {}

  async execute(studentId: string, courseCode: string): Promise<Result<void>> {
    try {
      if (!studentId || studentId.trim() === '') {
        return new Err('El ID del estudiante es requerido');
      }

      if (!courseCode || courseCode.trim() === '') {
        return new Err('El código del curso es requerido');
      }

      await this.repository.joinCourseByCode({
        studentId,
        courseCode,
      });

      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(message);
    }
  }
}
