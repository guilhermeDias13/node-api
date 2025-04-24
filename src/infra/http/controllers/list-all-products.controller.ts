import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { ListAllProductsUseCase } from '@domain/marketplace/application/use-cases/list-all-products.use-case';
import { ProductStatus } from '@domain/marketplace/enterprise/entities/product';

import { EnvService } from '@infra/env/env.service';
import { ProductPresenter } from '@infra/http/presenters/product.presenter';

class QuerySchema extends createZodDto(
  z.object({
    search: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    page: z.coerce.number().optional().default(1),
  }),
) {}

class ListAllProductsResponse extends createZodDto(
  z.object({
    products: z.array(ProductPresenter.zod),
  }),
) {}

@ApiTags('Products')
@Controller('products')
export class ListAllProductsController {
  constructor(
    private listAllProducts: ListAllProductsUseCase,
    private envService: EnvService,
  ) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: ProductStatus, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiOkResponse({
    description: 'All products were successfully found.',
    type: ListAllProductsResponse,
  })
  @ApiOperation({ summary: 'List all products' })
  async handle(@Query() query: QuerySchema): Promise<ListAllProductsResponse> {
    const result = await this.listAllProducts.execute({
      search: query.search,
      status: query.status,
      page: query.page,
    });

    if (result.isLeft()) throw result.value;

    return {
      products: result.value.products.map((product) =>
        ProductPresenter.toHTTP(this.envService, product),
      ),
    };
  }
}
