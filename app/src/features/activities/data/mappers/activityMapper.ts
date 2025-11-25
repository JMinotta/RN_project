import { Activity } from '../../domain/models/activity';

export class ActivityMapper {
  static toDomain(raw: Record<string, any>): Activity {
    let dueDate: Date | null = null;
    
    if (raw.due_date) {
      const parsed = new Date(raw.due_date);
      if (!isNaN(parsed.getTime())) {
        dueDate = parsed;
      }
    }

    return Activity.create({
      id: raw._id || raw.id,
      title: raw.title || '',
      courseId: raw.course_id || '',
      description: raw.description || null,
      dueDate,
      categoryId: raw.category_id || null,
      categoryName: raw.category_name || null,
      categoryType: raw.category_type || null,
    });
  }

  static toDTO(activity: {
    title: string;
    courseId: string;
    description?: string;
    dueDate?: Date;
    categoryId?: string;
  }): Record<string, any> {
    return {
      title: activity.title,
      course_id: activity.courseId,
      description: activity.description || null,
      due_date: activity.dueDate ? activity.dueDate.toISOString() : null,
      category_id: activity.categoryId || null,
    };
  }

  static toUpdateDTO(params: {
    title?: string;
    description?: string;
    dueDate?: Date;
    categoryId?: string;
  }): Record<string, any> {
    const dto: Record<string, any> = {};

    if (params.title !== undefined) dto.title = params.title;
    if (params.description !== undefined) dto.description = params.description ?? null;
    if (params.dueDate !== undefined) dto.due_date = params.dueDate ? params.dueDate.toISOString() : null;
    if (params.categoryId !== undefined) dto.category_id = params.categoryId ?? null;

    return dto;
  }
}
