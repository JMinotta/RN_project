export interface GroupMember {
  id: string;
  studentId: string;
  groupId: string;
  name?: string;
  email?: string;
}

export class Group {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly categoryId: string,
    public readonly description?: string | null,
    public readonly members: GroupMember[] = [],
    public readonly memberCount: number = 0
  ) {}

  isFull(capacity?: number): boolean {
    if (!capacity) return false;
    return this.members.length >= capacity;
  }

  hasMember(studentId: string): boolean {
    return this.members.some(m => m.studentId === studentId);
  }

  isEmpty(): boolean {
    return this.members.length === 0;
  }

  canAddMember(studentId: string, capacity?: number): boolean {
    if (this.hasMember(studentId)) return false;
    if (capacity && this.isFull(capacity)) return false;
    return true;
  }

  static create(params: {
    id: string;
    name: string;
    categoryId: string;
    description?: string | null;
    members?: GroupMember[];
    memberCount?: number;
  }): Group {
    return new Group(
      params.id,
      params.name,
      params.categoryId,
      params.description,
      params.members ?? [],
      params.memberCount ?? params.members?.length ?? 0
    );
  }
}
