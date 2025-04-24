import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { ListAllSellerProductsUseCase } from '@domain/marketplace/application/use-cases/list-all-seller-products.use-case';
import { ProductStatus } from '@domain/marketplace/enterprise/entities/product';

import { EnvService } from '@infra/env/env.service';
import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { ProductPresenter } from '@infra/http/presenters/product.presenter';

class QuerySchema extends createZodDto(
  z.object({
    search: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
  }),
) {}

class ListAllSellerProductsResponse extends createZodDto(
  z.object({
    products: z.array(ProductPresenter.zod),
  }),
) {}

@ApiTags('Products')
@Controller('/products/me')
export class ListAllSellerProductsController {
  constructor(
    private listAllSellerProducts: ListAllSellerProductsUseCase,
    private envService: EnvService,
  ) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: ProductStatus, required: false })
  @ApiOkResponse({
    description: 'All products were successfully found.',
    type: ListAllSellerProductsResponse,
  })
  @ApiNotFoundResponse({ description: 'The seller was not found.' })
  @ApiOperation({ summary: 'List all products from the seller' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query() query: QuerySchema,
  ): Promise<ListAllSellerProductsResponse> {
    const result = await this.listAllSellerProducts.execute({
      search: query.search,
      status: query.status,
      sellerId: user.sub,
    });

    if (result.isLeft()) throw result.value;

    return {
      products: result.value.products.map((product) =>
        ProductPresenter.toHTTP(this.envService, product),
      ),
    };
  }
}
