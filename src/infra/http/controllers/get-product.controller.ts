import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { GetProductUseCase } from '@domain/marketplace/application/use-cases/get-product.use-case';

import { EnvService } from '@infra/env/env.service';
import { ProductPresenter } from '@infra/http/presenters/product.presenter';

class GetProductResponse extends createZodDto(
  z.object({ product: ProductPresenter.zod }),
) {}

@ApiTags('Products')
@ApiParam({ name: 'id', type: 'string', description: 'The product id (uuid)' })
@Controller('products/:id')
export class GetProductController {
  constructor(
    private getProduct: GetProductUseCase,
    private envService: EnvService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'The product was successfully found.',
    type: GetProductResponse,
  })
  @ApiNotFoundResponse({ description: 'The product was not found.' })
  @ApiOperation({ summary: 'Get a product by its ID' })
  async handle(@Param('id') id: string): Promise<GetProductResponse> {
    const result = await this.getProduct.execute({ id });

    if (result.isLeft()) throw result.value;

    return { product: ProductPresenter.toHTTP(this.envService, result.value.product) };
  }
}
