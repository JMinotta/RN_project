import { ActivityRepository } from '../repositories/activityRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class UpdateActivity {
  constructor(private readonly repository: ActivityRepository) {}

  async execute(
    activityId: string,
    params: {
      title?: string;
      description?: string;
      dueDate?: Date;
      categoryId?: string;
    }
  ): Promise<Result<void>> {
    try {
      if (!activityId || activityId.trim() === '') {
        return new Err('El ID de la actividad es requerido');
      }

      if (params.title !== undefined && params.title.trim() === '') {
        return new Err('El título no puede estar vacío');
      }

      if (params.dueDate && params.dueDate < new Date()) {
        return new Err('La fecha de vencimiento no puede ser en el pasado');
      }

      await this.repository.updateActivity(activityId, params);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al actualizar actividad: ${message}`);
    }
  }
}
