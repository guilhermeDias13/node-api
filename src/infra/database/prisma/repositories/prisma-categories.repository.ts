import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/maybe';

import { CategoriesRepository } from '@domain/marketplace/application/repositories/categories.repository';
import { Category } from '@domain/marketplace/enterprise/entities/category';

import { PrismaCategoryMapper } from '@infra/database/prisma/mappers/prisma-category.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async listAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();

    return categories.map(PrismaCategoryMapper.toDomain);
  }

  async findById(id: string): AsyncMaybe<Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) return null;

    return PrismaCategoryMapper.toDomain(category);
  }
}
