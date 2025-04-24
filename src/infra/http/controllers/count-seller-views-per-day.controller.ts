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

import { CountSellerViewsPerDayUseCase } from '@domain/marketplace/application/use-cases/count-seller-views-per-day.use-case';

import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';

class QuerySchema extends createZodDto(
  z.object({
    from: z.coerce
      .date()
      .optional()
      .default(dayjs().subtract(30, 'days').startOf('day').toDate()),
  }),
) {}

class ViewsPerDayResponse extends createZodDto(
  z.object({ viewsPerDay: z.array(z.object({ date: z.date(), amount: z.number() })) }),
) {}

@ApiTags('Metrics')
@Controller('sellers/metrics/views/days')
export class CountSellerViewsPerDayController {
  constructor(private countSellerViewsPerDay: CountSellerViewsPerDayUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'The amount of views per day received by the seller in 30 days.',
    type: ViewsPerDayResponse,
  })
  @ApiNotFoundResponse({ description: 'The seller was not found.' })
  @ApiOperation({
    summary: 'Count the number of views per day received by the seller in 30 days',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query() query: QuerySchema,
  ): Promise<ViewsPerDayResponse> {
    const result = await this.countSellerViewsPerDay.execute({
      sellerId: user.sub,
      from: query.from,
    });

    if (result.isLeft()) throw result.value;

    return result.value;
  }
}
