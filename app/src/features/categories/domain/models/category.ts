export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly courseId: string,
    public readonly type?: string | null,
    public readonly capacity?: number | null,
    public readonly description?: string | null,
    public readonly activityCount: number = 0,
    public readonly pendingActivities: number = 0,
    public readonly overdueActivities: number = 0,
    public readonly groupCount: number = 0,
    public readonly totalMembers: number = 0
  ) {}

  canAddActivity(): boolean {
    // Lógica de negocio: Podría haber un límite de actividades
    return true;
  }

  isOverCapacity(): boolean {
    if (!this.capacity) return false;
    return this.totalMembers > this.capacity;
  }

  hasGroups(): boolean {
    return this.groupCount > 0;
  }

  hasActivities(): boolean {
    return this.activityCount > 0;
  }

  hasPendingWork(): boolean {
    return this.pendingActivities > 0 || this.overdueActivities > 0;
  }

  getCapacityPercentage(): number {
    if (!this.capacity || this.capacity === 0) return 0;
    return Math.min(100, (this.totalMembers / this.capacity) * 100);
  }

  static create(params: {
    id: string;
    name: string;
    courseId: string;
    type?: string | null;
    capacity?: number | null;
    description?: string | null;
    activityCount?: number;
    pendingActivities?: number;
    overdueActivities?: number;
    groupCount?: number;
    totalMembers?: number;
  }): Category {
    return new Category(
      params.id,
      params.name,
      params.courseId,
      params.type,
      params.capacity,
      params.description,
      params.activityCount ?? 0,
      params.pendingActivities ?? 0,
      params.overdueActivities ?? 0,
      params.groupCount ?? 0,
      params.totalMembers ?? 0
    );
  }
}
