import { useState, useCallback, useEffect, useMemo } from "react";
import { Activity } from '../../domain/models/activity';
import { ActivityRepository } from '../../domain/repositories/activityRepository';
import { activityRepository } from '../../data/repositories/activityRepositoryImpl';
import { GetActivitiesByCourse } from '../../domain/useCases/getActivitiesByCourse';
import { CreateActivity } from '../../domain/useCases/createActivity';
import { UpdateActivity } from '../../domain/useCases/updateActivity';
import { DeleteActivity } from '../../domain/useCases/deleteActivity';
import { categoryRepository } from '../../../categories/data/repositories/categoryRepositoryImpl';
import { GetCategoriesByCourse } from '../../../categories/domain/useCases/getCategoriesByCourse';
import { Category } from '../../../categories/domain/models/category';
import { CategoryRepository } from '../../../categories/domain/repositories/categoryRepository';

// Hook para manejar actividades y categorías de un curso
export interface ActivityData {
  title: string;
  description?: string;
  due_date?: Date;
  course_id: string;
  category_id?: string;
}

export interface UseActivitiesControllerOptions {
  activityRepository?: ActivityRepository;
  categoryRepository?: CategoryRepository;
}

export function useActivitiesController(
  courseId: string,
  options: UseActivitiesControllerOptions = {}
) {
  const {
    activityRepository: activityRepo = activityRepository,
    categoryRepository: categoryRepo = categoryRepository,
  } = options;

  // Initialize use cases
  const getActivitiesUseCase = useMemo(
    () => new GetActivitiesByCourse(activityRepo),
    [activityRepo]
  );
  const createActivityUseCase = useMemo(
    () => new CreateActivity(activityRepo),
    [activityRepo]
  );
  const updateActivityUseCase = useMemo(
    () => new UpdateActivity(activityRepo),
    [activityRepo]
  );
  const deleteActivityUseCase = useMemo(
    () => new DeleteActivity(activityRepo),
    [activityRepo]
  );
  const getCategoriesUseCase = useMemo(
    () => new GetCategoriesByCourse(categoryRepo),
    [categoryRepo]
  );

  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    if (!courseId) return;

    try {
      const data = await getActivitiesUseCase.execute(courseId);
      setActivities(data);
    } catch (err) {
      console.warn("Error cargando actividades:", err);
    }
  }, [courseId, getActivitiesUseCase]);

  const loadCategories = useCallback(async () => {
    if (!courseId) return;

    try {
      const data = await getCategoriesUseCase.execute(courseId);
      setCategories(data);
    } catch (err) {
      console.warn("Error cargando categorías:", err);
    }
  }, [courseId, getCategoriesUseCase]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([loadActivities(), loadCategories()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [loadActivities, loadCategories]);

  const createActivity = useCallback(
    async (data: ActivityData) => {
      setIsCreating(true);
      try {
        const result = await createActivityUseCase.execute({
          title: data.title,
          description: data.description,
          dueDate: data.due_date,
          courseId: data.course_id,
          categoryId: data.category_id,
        });

        if (result instanceof Error || 'message' in result) {
          const errorMsg = 'message' in result ? result.message : result.message;
          throw new Error(errorMsg);
        }

        await loadActivities();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(message);
      } finally {
        setIsCreating(false);
      }
    },
    [createActivityUseCase, loadActivities]
  );

  const updateActivity = useCallback(
    async (
      activityId: string,
      data: {
        title?: string;
        description?: string;
        due_date?: Date;
        category_id?: string;
      }
    ) => {
      try {
        const result = await updateActivityUseCase.execute(activityId, {
          title: data.title,
          description: data.description,
          dueDate: data.due_date,
          categoryId: data.category_id,
        });

        if (result instanceof Error || 'message' in result) {
          const errorMsg = 'message' in result ? result.message : result.message;
          throw new Error(errorMsg);
        }

        await loadActivities();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(message);
      }
    },
    [updateActivityUseCase, loadActivities]
  );

  const deleteActivity = useCallback(
    async (activityId: string) => {
      try {
        const result = await deleteActivityUseCase.execute(activityId);

        if (result instanceof Error || 'message' in result) {
          const errorMsg = 'message' in result ? result.message : result.message;
          throw new Error(errorMsg);
        }

        await loadActivities();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(message);
      }
    },
    [deleteActivityUseCase, loadActivities]
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    activities,
    categories,
    isLoading,
    isCreating,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refresh: loadData,
  };
}
