import { Category } from '../models/category';
import { Group } from '../models/group';

export interface CategoryRepository {
  // Category operations
  getCategoriesByCourse(courseId: string): Promise<Category[]>;
  getCategoryById(categoryId: string): Promise<Category | null>;
  createCategory(params: {
    name: string;
    courseId: string;
    type?: string;
    capacity?: number;
    description?: string;
  }): Promise<Category>;
  updateCategory(params: {
    categoryId: string;
    name?: string;
    type?: string;
    capacity?: number;
    description?: string;
  }): Promise<boolean>;
  deleteCategory(categoryId: string): Promise<boolean>;

  // Group operations
  getGroupsByCategory(categoryId: string): Promise<Group[]>;
  createGroup(params: {
    categoryId: string;
    name: string;
    description?: string;
  }): Promise<void>;
  updateGroup(params: {
    groupId: string;
    name?: string;
    description?: string;
  }): Promise<void>;
  deleteGroup(groupId: string): Promise<void>;

  // Group member operations
  addStudentToGroup(groupId: string, studentId: string): Promise<void>;
  removeStudentFromGroup(groupId: string, studentId: string): Promise<void>;
  getAvailableStudentsForCategory(categoryId: string, courseId: string): Promise<any[]>;
}
