import { AsyncMaybe } from '@core/logic/maybe';

import { Category } from '@domain/marketplace/enterprise/entities/category';

export abstract class CategoriesRepository {
  abstract findById(id: string): AsyncMaybe<Category>;
  abstract listAll(): Promise<Category[]>;
}
