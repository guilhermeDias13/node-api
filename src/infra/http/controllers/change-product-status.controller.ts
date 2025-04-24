import { Controller, Param, Patch } from '@nestjs/common';
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

import { MarkSellAsAvailableUseCase } from '@domain/marketplace/application/use-cases/mark-sell-as-available.use-case';
import { MarkSellAsCancelledUseCase } from '@domain/marketplace/application/use-cases/mark-sell-as-cancelled.use-case';
import { MarkSellAsSoldUseCase } from '@domain/marketplace/application/use-cases/mark-sell-as-sold.use-case';

import { EnvService } from '@infra/env/env.service';
import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { ProductPresenter } from '@infra/http/presenters/product.presenter';

class ChangeProductStatusParams extends createZodDto(
  z.object({
    id: z.string().uuid(),
    status: z.enum(['available', 'cancelled', 'sold']),
  }),
) {}

class ChangeProductStatusResponse extends createZodDto(
  z.object({ product: ProductPresenter.zod }),
) {}

@ApiTags('Products')
@ApiParam({ name: 'id', type: 'string', description: 'The product id (uuid)' })
@ApiParam({ name: 'status', type: 'string', enum: ['available', 'cancelled', 'sold'] })
@Controller('products/:id/:status')
export class ChangeProductStatusController {
  private ACTION: Record<
    ChangeProductStatusParams['status'],
    MarkSellAsAvailableUseCase | MarkSellAsCancelledUseCase | MarkSellAsSoldUseCase
  >;

  constructor(
    private markSellAsAvailable: MarkSellAsAvailableUseCase,
    private markSellAsCancelled: MarkSellAsCancelledUseCase,
    private markSellAsSold: MarkSellAsSoldUseCase,
    private envService: EnvService,
  ) {
    this.ACTION = {
      available: this.markSellAsAvailable,
      cancelled: this.markSellAsCancelled,
      sold: this.markSellAsSold,
    };
  }

  @Patch()
  @ApiOkResponse({
    description: 'The product status was successfully changed.',
    type: ChangeProductStatusResponse,
  })
  @ApiNotFoundResponse({ description: 'The product was not found.' })
  @ApiForbiddenResponse({
    description: `The product does not belong to the seller or the product is with the same status.`,
  })
  @ApiOperation({ summary: 'Change the product status' })
  async handle(
    @Param() params: ChangeProductStatusParams,
    @CurrentUser() user: UserPayload,
  ): Promise<ChangeProductStatusResponse> {
    const result = await this.ACTION[params.status].execute({
      productId: params.id,
      ownerId: user.sub,
    });

    if (result.isLeft()) throw result.value;

    return { product: ProductPresenter.toHTTP(this.envService, result.value.product) };
  }
}
