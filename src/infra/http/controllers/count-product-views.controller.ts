import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { CountProductViewsUseCase } from '@domain/marketplace/application/use-cases/count-product-views.use-case';

import { AmountResponse } from '@infra/http/controllers/dto/amount.response';

class QuerySchema extends createZodDto(
  z.object({
    from: z.coerce
      .date()
      .optional()
      .default(dayjs().subtract(7, 'days').startOf('day').toDate()),
  }),
) {}

@ApiTags('Metrics')
@ApiParam({ name: 'id', type: 'string', description: 'The product id (uuid)' })
@Controller('products/:id/metrics/views')
export class CountProductViewsController {
  constructor(private countProductViews: CountProductViewsUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'The amount of views received by the product in 7 days.',
    type: AmountResponse,
  })
  @ApiNotFoundResponse({ description: 'The product was not found.' })
  @ApiQuery({ type: QuerySchema })
  @ApiOperation({
    summary: 'Count the number of views received by a product in the last 7 days',
  })
  async handle(
    @Param('id') productId: string,
    @Query() query: QuerySchema,
  ): Promise<AmountResponse> {
    const result = await this.countProductViews.execute({
      productId,
      from: query.from,
    });

    if (result.isLeft()) throw result.value;

    return result.value;
  }
}
