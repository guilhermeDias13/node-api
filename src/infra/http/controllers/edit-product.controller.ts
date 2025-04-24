import { Body, Controller, Param, Put } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { EditProductUseCase } from '@domain/marketplace/application/use-cases/edit-product.use-case';

import { EnvService } from '@infra/env/env.service';
import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { ProductPresenter } from '@infra/http/presenters/product.presenter';

class EditProductRequestBody extends createZodDto(
  z.object({
    title: z.string(),
    categoryId: z.string().uuid(),
    description: z.string(),
    priceInCents: z.coerce.number(),
    attachmentsIds: z.array(z.string().uuid()),
  }),
) {}

class EditProductResponse extends createZodDto(
  z.object({ product: ProductPresenter.zod }),
) {}

@ApiTags('Products')
@ApiParam({ name: 'id', type: 'string', description: 'The product id (uuid)' })
@Controller('products/:id')
export class EditProductController {
  constructor(
    private editProduct: EditProductUseCase,
    private envService: EnvService,
  ) {}

  @Put()
  @ApiOkResponse({
    description: 'The product was successfully edited.',
    type: EditProductResponse,
  })
  @ApiNotFoundResponse({ description: 'The product was not found.' })
  @ApiForbiddenResponse({
    description: 'You are not the owner of this product or the product is sold.',
  })
  @ApiOperation({ summary: 'Edit a product' })
  async handle(
    @Param('id') id: string,
    @Body() body: EditProductRequestBody,
    @CurrentUser() user: UserPayload,
  ): Promise<EditProductResponse> {
    const result = await this.editProduct.execute({
      id,
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
