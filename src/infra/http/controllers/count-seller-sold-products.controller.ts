import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { CountSellerSoldProductsUseCase } from '@domain/marketplace/application/use-cases/count-seller-sold-products.use-case';

import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { AmountResponse } from '@infra/http/controllers/dto/amount.response';

class QuerySchema extends createZodDto(
  z.object({
    from: z.coerce
      .date()
      .optional()
      .default(dayjs().subtract(30, 'days').startOf('day').toDate()),
  }),
) {}

@ApiTags('Metrics')
@Controller('sellers/metrics/products/sold')
export class CountSellerSoldProductsController {
  constructor(private countSellerSoldProducts: CountSellerSoldProductsUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'The amount of products sold by the seller in 30 days',
    type: AmountResponse,
  })
  @ApiNotFoundResponse({ description: 'The seller was not found.' })
  @ApiOperation({ summary: 'Count the number of products sold by the seller in 30 days' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query() query: QuerySchema,
  ): Promise<AmountResponse> {
    const result = await this.countSellerSoldProducts.execute({
      sellerId: user.sub,
      from: query.from,
    });

    if (result.isLeft()) throw result.value;

    return result.value;
  }
}
