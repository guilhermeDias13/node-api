import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { SellProductUseCase } from '@domain/marketplace/application/use-cases/sell-product.use-case';

import { EnvService } from '@infra/env/env.service';
import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { ProductPresenter } from '@infra/http/presenters/product.presenter';

class CreateProductBody extends createZodDto(
  z.object({
    title: z.string(),
    categoryId: z.string().uuid(),
    description: z.string(),
    priceInCents: z.coerce.number(),
    attachmentsIds: z.array(z.string().uuid()),
  }),
) {}

class CreateProductResponse extends createZodDto(
  z.object({ product: ProductPresenter.zod }),
) {}

@ApiTags('Products')
@Controller('/products')
export class SellProductController {
  constructor(
    private sellProduct: SellProductUseCase,
    private envService: EnvService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'The product was successfully created.',
    type: CreateProductResponse,
  })
  @ApiNotFoundResponse({
    description: 'The seller, category or attachments were not found.',
  })
  @ApiOperation({ summary: 'Create a product to sell' })
  async handle(
    @Body() body: CreateProductBody,
    @CurrentUser() user: UserPayload,
  ): Promise<CreateProductResponse> {
    const result = await this.sellProduct.execute({
      ownerId: user.sub,
      categoryId: body.categoryId,
      title: body.title,
      priceInCents: body.priceInCents,
      description: body.description,
      attachmentsIds: body.attachmentsIds,
    });

    if (result.isLeft()) throw result.value;

    return { product: ProductPresenter.toHTTP(this.envService, result.value.product) };
  }
}
