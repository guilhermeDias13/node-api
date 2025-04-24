import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { ViewsRepository } from '@domain/marketplace/application/repositories/views.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';

interface Params {
  productId: string;
  from: Date;
}

type Result = Either<ResourceNotFoundError, { amount: number }>;

@Injectable()
export class CountProductViewsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const product = await this.productsRepository.findById(params.productId);

    if (!product) {
      return left(new ResourceNotFoundError('Product', 'ID', params.productId));
    }

    const amount = await this.viewsRepository.countByProduct({
      productId: params.productId,
      from: params.from,
    });

    return right({ amount });
  }
}
