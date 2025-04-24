import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { ListAllCategoriesUseCase } from '@domain/marketplace/application/use-cases/list-all-categories.use-case';

import { CategoryPresenter } from '@infra/http/presenters/category.presenter';

class ListAllCategoriesResponse extends createZodDto(
  z.object({ categories: z.array(CategoryPresenter.zod) }),
) {}

@Controller('categories')
@ApiTags('Categories')
export class ListAllCategoriesController {
  constructor(private listAllCategories: ListAllCategoriesUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'All categories were successfully found.',
    type: ListAllCategoriesResponse,
  })
  @ApiOperation({ summary: 'List all categories' })
  async handle(): Promise<ListAllCategoriesResponse> {
    const result = await this.listAllCategories.execute();

    if (result.isLeft()) throw result.value;

    return {
      categories: result.value.categories.map(CategoryPresenter.toHTTP),
    };
  }
}
