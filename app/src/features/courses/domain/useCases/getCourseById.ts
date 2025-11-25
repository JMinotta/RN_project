import { Course } from '../models/course';
import { CourseRepository } from '../repositories/courseRepository';

export class GetCourseById {
  constructor(private readonly repository: CourseRepository) {}

  async execute(
    courseId: string,
    options?: { currentUserId?: string | null }
  ): Promise<Course | null> {
    if (!courseId || courseId.trim() === '') {
      throw new Error('El ID del curso es requerido');
    }

    return this.repository.getById(courseId, options);
  }
}
