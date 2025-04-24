import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ViewsRepository } from '@domain/marketplace/application/repositories/views.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';

interface Params {
  sellerId: string;
  from: Date;
}

type Result = Either<
  ResourceNotFoundError,
  { viewsPerDay: { date: Date; amount: number }[] }
>;

@Injectable()
export class CountSellerViewsPerDayUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const seller = await this.sellersRepository.findById(params.sellerId);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.sellerId));
    }

    const viewsPerDay = await this.viewsRepository.countPerDay({
      sellerId: params.sellerId,
      from: params.from,
    });

    return right({ viewsPerDay });
  }
}
