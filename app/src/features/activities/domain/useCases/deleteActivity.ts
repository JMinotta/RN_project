import { ActivityRepository } from '../repositories/activityRepository';

export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  constructor(public readonly value: T) {}
}

export class Err {
  constructor(public readonly message: string) {}
}

export class DeleteActivity {
  constructor(private readonly repository: ActivityRepository) {}

  async execute(activityId: string): Promise<Result<void>> {
    try {
      if (!activityId || activityId.trim() === '') {
        return new Err('El ID de la actividad es requerido');
      }

      const activity = await this.repository.getActivityById(activityId);
      
      if (!activity) {
        return new Err('La actividad no existe');
      }

      await this.repository.deleteActivity(activityId);
      return new Ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Err(`Error al eliminar actividad: ${message}`);
    }
  }
}
