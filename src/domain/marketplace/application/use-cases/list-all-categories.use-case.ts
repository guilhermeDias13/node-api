import { Injectable } from '@nestjs/common';

import { Either, right } from '@core/logic/either';

import { CategoriesRepository } from '@domain/marketplace/application/repositories/categories.repository';
import { Category } from '@domain/marketplace/enterprise/entities/category';

type Result = Either<null, { categories: Category[] }>;

@Injectable()
export class ListAllCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<Result> {
    const categories = await this.categoriesRepository.listAll();

    return right({ categories });
  }
}
