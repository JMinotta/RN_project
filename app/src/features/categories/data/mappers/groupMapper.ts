import { Group, GroupMember } from '../../domain/models/group';

export class GroupMapper {
  static toDomain(raw: Record<string, any>): Group {
    const members: GroupMember[] = (raw.members || raw.member_details || []).map(
      (m: Record<string, any>) => ({
        id: m._id || m.id,
        studentId: m.student_id || m.studentId,
        groupId: m.group_id || m.groupId,
        name: m.name,
        email: m.email,
      })
    );

    return Group.create({
      id: raw._id || raw.id,
      name: raw.name || '',
      categoryId: raw.category_id || raw.categoryId || '',
      description: raw.description || null,
      members,
      memberCount: raw.member_count || members.length,
    });
  }

  static toDTO(group: {
    name: string;
    categoryId: string;
    description?: string;
  }): Record<string, any> {
    const dto: Record<string, any> = {
      category_id: group.categoryId,
      name: group.name,
    };

    if (group.description) dto.description = group.description;

    return dto;
  }
}
