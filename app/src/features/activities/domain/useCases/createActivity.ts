import { ActivityRepository } from '../repositories/activityRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class CreateActivity {
  constructor(private readonly repository: ActivityRepository) {}

  async execute(params: {
    title: string;
    description?: string;
    dueDate?: Date;
    courseId: string;
    categoryId?: string;
  }): Promise<Result<void>> {
    try {
      // Validaciones de negocio
      if (!params.title || params.title.trim() === '') {
        return new Err('El título de la actividad es requerido');
      }

      if (!params.courseId || params.courseId.trim() === '') {
        return new Err('El ID del curso es requerido');
      }

      if (params.dueDate && params.dueDate < new Date()) {
        return new Err('La fecha de vencimiento no puede ser en el pasado');
      }

      // Validar límite de actividades por curso
      const stats = await this.repository.getActivityStats(params.courseId);
      if (stats.total >= 50) {
        return new Err('Has alcanzado el límite máximo de 50 actividades por curso');
      }

      await this.repository.createActivity(params);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al crear actividad: ${message}`);
    }
  }
}
