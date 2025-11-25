import { Category } from '../../domain/models/category';

export class CategoryMapper {
  static toDomain(raw: Record<string, any>): Category {
    return Category.create({
      id: raw._id || raw.id,
      name: raw.name || '',
      courseId: raw.course_id || '',
      type: raw.type || null,
      capacity: raw.capacity !== undefined ? Number(raw.capacity) : null,
      description: raw.description || null,
      activityCount: raw.activity_count || 0,
      pendingActivities: raw.pending_activities || 0,
      overdueActivities: raw.overdue_activities || 0,
      groupCount: raw.group_count || 0,
      totalMembers: raw.total_members || 0,
    });
  }

  static toDTO(category: Category): Record<string, any> {
    const dto: Record<string, any> = {
      course_id: category.courseId,
      name: category.name,
    };

    if (category.type) dto.type = category.type;
    if (category.capacity !== null && category.capacity !== undefined) {
      dto.capacity = category.capacity;
    }
    if (category.description) dto.description = category.description;

    return dto;
  }

  static toUpdateDTO(params: {
    name?: string;
    type?: string;
    capacity?: number;
    description?: string;
  }): Record<string, any> {
    const dto: Record<string, any> = {};

    if (params.name !== undefined) dto.name = params.name;
    if (params.type !== undefined) dto.type = params.type;
    if (params.capacity !== undefined) dto.capacity = params.capacity;
    if (params.description !== undefined) dto.description = params.description;

    return dto;
  }
}
