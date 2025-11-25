import { useCallback, useEffect, useMemo, useState } from 'react';
import { Category } from '../../domain/models/category';
import { CategoryRepository } from '../../domain/repositories/categoryRepository';
import { categoryRepository } from '../../data/repositories/categoryRepositoryImpl';
import { GetCategoriesByCourse } from '../../domain/useCases/getCategoriesByCourse';
import { GetCategoryById } from '../../domain/useCases/getCategoryById';
import { CreateCategory } from '../../domain/useCases/createCategory';
import { UpdateCategory } from '../../domain/useCases/updateCategory';
import { DeleteCategory } from '../../domain/useCases/deleteCategory';

export interface UseCategoriesControllerOptions {
  repository?: CategoryRepository;
}

export function useCategoriesController(
  courseId?: string,
  options: UseCategoriesControllerOptions = {}
) {
  const { repository = categoryRepository } = options;

  // Initialize use cases
  const getCategoriesUseCase = useMemo(
    () => new GetCategoriesByCourse(repository),
    [repository]
  );
  const getCategoryByIdUseCase = useMemo(
    () => new GetCategoryById(repository),
    [repository]
  );
  const createCategoryUseCase = useMemo(
    () => new CreateCategory(repository),
    [repository]
  );
  const updateCategoryUseCase = useMemo(
    () => new UpdateCategory(repository),
    [repository]
  );
  const deleteCategoryUseCase = useMemo(
    () => new DeleteCategory(repository),
    [repository]
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!courseId) {
      setCategories([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategoriesUseCase.execute(courseId);
      setCategories(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, getCategoriesUseCase]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const createCategory = useCallback(
    async (payload: {
      name: string;
      type?: string;
      capacity?: number;
      description?: string;
      courseId: string;
    }) => {
      try {
        console.log('[useCategoriesController] Creando categoría con payload:', payload);
        const result = await createCategoryUseCase.execute(payload);
        
        if (result instanceof Error || 'message' in result) {
          const errorMsg = 'message' in result ? result.message : result.message;
          console.error('[useCategoriesController] Error:', errorMsg);
          setError(errorMsg);
          return null;
        }
        
        console.log('[useCategoriesController] Categoría creada, recargando lista...');
        await load();
        return result.value;
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('[useCategoriesController] Error creando categoría:', message);
        setError(message);
        return null;
      }
    },
    [createCategoryUseCase, load]
  );

  const getById = useCallback(
    async (id: string) => {
      try {
        return await getCategoryByIdUseCase.execute(id);
      } catch {
        return null;
      }
    },
    [getCategoryByIdUseCase]
  );

  const updateCategory = useCallback(
    async (id: string, updates: Record<string, any>) => {
      try {
        console.log('[useCategoriesController] Actualizando categoría:', { id, updates });
        const result = await updateCategoryUseCase.execute({
          categoryId: id,
          name: updates.name,
          type: updates.type,
          capacity: updates.capacity,
          description: updates.description,
        });
        
        if (result instanceof Error || 'message' in result) {
          const errorMsg = 'message' in result ? result.message : result.message;
          console.error('[useCategoriesController] Error:', errorMsg);
          return false;
        }
        
        console.log('[useCategoriesController] Categoría actualizada, recargando lista...');
        await load();
        return true;
      } catch (e) {
        console.error('[useCategoriesController] Error actualizando categoría:', e);
        return false;
      }
    },
    [updateCategoryUseCase, load]
  );

  const removeCategory = useCallback(
    async (id: string) => {
      console.log('[useCategoriesController] Eliminando categoría:', id);
      try {
        const result = await deleteCategoryUseCase.execute(id);
        
        if (result instanceof Error || 'message' in result) {
          const errorMsg = 'message' in result ? result.message : result.message;
          console.error('[useCategoriesController] Error:', errorMsg);
          throw new Error(errorMsg);
        }
        
        console.log('[useCategoriesController] Categoría eliminada, recargando lista...');
        await load();
        return true;
      } catch (e) {
        console.error('[useCategoriesController] Error eliminando categoría:', e);
        throw e;
      }
    },
    [deleteCategoryUseCase, load]
  );

  return {
    categories,
    isLoading,
    error,
    refresh,
    createCategory,
    getById,
    updateCategory,
    removeCategory,
  } as const;
}
