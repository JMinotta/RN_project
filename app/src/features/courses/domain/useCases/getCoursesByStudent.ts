import { Course } from '../models/course';
import { CourseRepository } from '../repositories/courseRepository';

export class GetCoursesByStudent {
  constructor(private readonly repository: CourseRepository) {}

  async execute(
    studentId: string,
    options?: { currentUserId?: string | null }
  ): Promise<Course[]> {
    if (!studentId || studentId.trim() === '') {
      throw new Error('El ID del estudiante es requerido');
    }

    return this.repository.getCoursesByStudent(studentId, options);
  }
}
