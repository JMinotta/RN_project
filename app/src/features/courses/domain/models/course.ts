export type CourseRole = "Profesor" | "Estudiante";

export interface Course {
  id?: string;
  title: string;
  description: string;
  code?: string | null;
  professorId: string;
  role: CourseRole;
  createdAt: Date;
  studentCount: number;
}

export class CourseEntity {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly professorId: string,
    public readonly role: CourseRole,
    public readonly createdAt: Date,
    public readonly studentCount: number,
    public readonly id?: string,
    public readonly code?: string | null
  ) {}

  isProfessor(): boolean {
    return this.role === "Profesor";
  }

  isStudent(): boolean {
    return this.role === "Estudiante";
  }

  hasStudents(): boolean {
    return this.studentCount > 0;
  }

  hasCode(): boolean {
    return !!this.code && this.code.trim() !== '';
  }

  getAgeInDays(): number {
    const now = new Date();
    const diffTime = now.getTime() - this.createdAt.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  isRecent(): boolean {
    return this.getAgeInDays() <= 7;
  }

  canEdit(userId: string): boolean {
    return this.isProfessor() && this.professorId === userId;
  }

  canDelete(userId: string): boolean {
    // Solo el profesor puede eliminar y si no tiene estudiantes
    return this.canEdit(userId) && !this.hasStudents();
  }

  static create(params: {
    title: string;
    description: string;
    professorId: string;
    role: CourseRole;
    createdAt?: Date;
    studentCount?: number;
    id?: string;
    code?: string | null;
  }): CourseEntity {
    return new CourseEntity(
      params.title,
      params.description,
      params.professorId,
      params.role,
      params.createdAt || new Date(),
      params.studentCount || 0,
      params.id,
      params.code
    );
  }

  toPlainObject(): Course {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      code: this.code,
      professorId: this.professorId,
      role: this.role,
      createdAt: this.createdAt,
      studentCount: this.studentCount,
    };
  }
}


export interface CourseMapperOptions {
  currentUserId?: string | null;
  enrollmentCount?: number;
}

export type RawCourseRecord = Record<string, any>;

export const mapRobleCourseToDomain = (
  record: RawCourseRecord,
  options: CourseMapperOptions = {}
): Course => {
  const {
    currentUserId,
    enrollmentCount = typeof record["student_count"] === "number"
      ? (record["student_count"] as number)
      : 0,
  } = options;

  const id = typeof record["_id"] === "string" ? record["_id"] : undefined;
  const professorId =
    typeof record["professor_id"] === "string"
      ? (record["professor_id"] as string)
      : "";

  const role: CourseRole =
    currentUserId && professorId && currentUserId === professorId
      ? "Profesor"
      : "Estudiante";

  let createdAt: Date;
  const createdAtValue = record["created_at"] ?? record["createdAt"];
  if (createdAtValue) {
    const parsed = new Date(createdAtValue);
    createdAt = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  } else {
    createdAt = new Date();
  }

  return {
    id,
    title: typeof record["title"] === "string" ? record["title"] : "",
    description:
      typeof record["description"] === "string"
        ? record["description"]
        : "",
    code: typeof record["code"] === "string" ? record["code"] : null,
    professorId,
    role,
    createdAt,
    studentCount: enrollmentCount,
  };
};

export const mapCourseToRobleRecord = (course: Course): RawCourseRecord => {
  const payload: RawCourseRecord = {
    title: course.title,
    description: course.description,
    professor_id: course.professorId,
  };

  if (course.id) {
    payload["_id"] = course.id;
  }
  if (course.code) {
    payload["code"] = course.code;
  }

  return payload;
};
