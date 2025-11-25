export class Activity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly courseId: string,
    public readonly description?: string | null,
    public readonly dueDate?: Date | null,
    public readonly categoryId?: string | null,
    public readonly categoryName?: string | null,
    public readonly categoryType?: string | null
  ) {}

  isPastDue(): boolean {
    if (!this.dueDate) return false;
    return this.dueDate < new Date();
  }

  isUpcoming(): boolean {
    if (!this.dueDate) return true;
    return this.dueDate >= new Date();
  }

  hasDueDate(): boolean {
    return this.dueDate !== null && this.dueDate !== undefined;
  }

  hasCategory(): boolean {
    return !!this.categoryId;
  }

  getDaysUntilDue(): number {
    if (!this.dueDate) return Infinity;
    const now = new Date();
    const diffTime = this.dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isWithinDays(days: number): boolean {
    if (!this.dueDate) return false;
    const daysUntil = this.getDaysUntilDue();
    return daysUntil >= 0 && daysUntil <= days;
  }

  getFormattedDueDate(): string {
    if (!this.dueDate) return 'Sin fecha límite';
    
    const day = this.dueDate.getDate();
    const month = this.dueDate.getMonth() + 1;
    const year = this.dueDate.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  static create(params: {
    id: string;
    title: string;
    courseId: string;
    description?: string | null;
    dueDate?: Date | null;
    categoryId?: string | null;
    categoryName?: string | null;
    categoryType?: string | null;
  }): Activity {
    return new Activity(
      params.id,
      params.title,
      params.courseId,
      params.description,
      params.dueDate,
      params.categoryId,
      params.categoryName,
      params.categoryType
    );
  }
}
