import { Course } from '../models/course';
import { CourseRepository } from '../repositories/courseRepository';

export class GetCoursesByProfessor {
  constructor(private readonly repository: CourseRepository) {}

  async execute(
    professorId: string,
    options?: { currentUserId?: string | null }
  ): Promise<Course[]> {
    if (!professorId || professorId.trim() === '') {
      throw new Error('El ID del profesor es requerido');
    }

    return this.repository.getCoursesByProfessor(professorId, options);
  }
}
