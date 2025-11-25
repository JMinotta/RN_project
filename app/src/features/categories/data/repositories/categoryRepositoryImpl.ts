import { Category } from '../../domain/models/category';
import { Group } from '../../domain/models/group';
import { CategoryRepository } from '../../domain/repositories/categoryRepository';
import { CategoryMapper } from '../mappers/categoryMapper';
import { GroupMapper } from '../mappers/groupMapper';
import { robleCategoryService, RobleCategoryService } from '../../../core/services/robleCategoryService';
import { robleGroupService, RobleGroupService } from '../../../core/services/robleGroupService';

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(
    private readonly categoryService: RobleCategoryService = robleCategoryService,
    private readonly groupService: RobleGroupService = robleGroupService
  ) {}

  async getCategoriesByCourse(courseId: string): Promise<Category[]> {
    const records = await this.categoryService.getCategoriesByCourse(courseId);
    return records.map((record) => CategoryMapper.toDomain(record));
  }

  async getCategoryById(categoryId: string): Promise<Category | null> {
    const record = await this.categoryService.getCategoryById(categoryId);
    if (!record) return null;
    return CategoryMapper.toDomain(record);
  }

  async createCategory(params: {
    name: string;
    courseId: string;
    type?: string;
    capacity?: number;
    description?: string;
  }): Promise<Category> {
    const record = await this.categoryService.createCategory(params);
    if (!record) {
      throw new Error('No se pudo crear la categoría');
    }
    return CategoryMapper.toDomain(record);
  }

  async updateCategory(params: {
    categoryId: string;
    name?: string;
    type?: string;
    capacity?: number;
    description?: string;
  }): Promise<boolean> {
    return this.categoryService.updateCategory(params);
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    return this.categoryService.deleteCategory(categoryId);
  }

  async getGroupsByCategory(categoryId: string): Promise<Group[]> {
    const records = await this.groupService.getGroupsByCategory(categoryId);
    return records.map((record) => GroupMapper.toDomain(record));
  }

  async createGroup(params: {
    categoryId: string;
    name: string;
    description?: string;
  }): Promise<void> {
    await this.groupService.createGroup({
      category_id: params.categoryId,
      name: params.name,
      description: params.description,
    });
  }

  async updateGroup(params: {
    groupId: string;
    name?: string;
    description?: string;
  }): Promise<void> {
    await this.groupService.updateGroup(params.groupId, {
      name: params.name,
      description: params.description,
    });
  }

  async deleteGroup(groupId: string): Promise<void> {
    await this.groupService.deleteGroup(groupId);
  }

  async addStudentToGroup(groupId: string, studentId: string): Promise<void> {
    await this.groupService.joinGroup(groupId, studentId);
  }

  async removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
    await this.groupService.leaveGroup(groupId, studentId);
  }

  async getAvailableStudentsForCategory(
    categoryId: string,
    courseId: string
  ): Promise<any[]> {
    return this.groupService.getAvailableStudentsForCategory(categoryId, courseId);
  }
}

export const categoryRepository = new CategoryRepositoryImpl();
